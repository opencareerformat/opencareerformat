// OCF reference validator.
// Validates one or more OCF files against their declared local versioned schema
// using AJV (JSON Schema 2020-12).
// Run from repo root: node reference/validator/validate.js
//   or:               cd reference/validator && node validate.js
// Use --warn-unknown to treat additionalProperties violations as warnings while
// still failing other schema violations.

const fs = require('fs');
const path = require('path');
const { validateSemantic } = require('./semantic');

let Ajv;
let addFormats;
try {
  Ajv = require('ajv/dist/2020');
  addFormats = require('ajv-formats');
} catch {
  console.error('The OCF validator requires its pinned dependencies. Run: npm --prefix reference/validator ci');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..', '..');
const examplesDir = path.join(repoRoot, 'spec', 'examples');
const currentSchema = JSON.parse(fs.readFileSync(path.join(repoRoot, 'spec', 'schema.json'), 'utf8'));
const currentSchemaVersion = currentSchema.properties?.schemaVersion?.const || 'unknown';
const validators = new Map();

const args = process.argv.slice(2);
const warnUnknown = args.includes('--warn-unknown');
const inputs = args.filter(arg => arg !== '--warn-unknown');
const examples = inputs.length
  ? inputs.map(file => path.resolve(process.cwd(), file))
  : findJsonFiles(examplesDir);

let allPassed = true;
for (const file of examples) {
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.log(`${path.relative(process.cwd(), file) || file}: FAIL`);
    console.log(`Could not read valid JSON: ${error.message}`);
    allPassed = false;
    continue;
  }
  const schemaVersion = doc.schemaVersion;
  const validator = getValidator(schemaVersion);
  if (!validator) {
    console.log(`${path.relative(process.cwd(), file) || file}: FAIL`);
    console.log(`No local schema is available for declared schemaVersion ${JSON.stringify(schemaVersion)}.`);
    allPassed = false;
    continue;
  }
  const validate = validator.validate;
  const ok = validate(doc);
  // Semantic rules are generated from the current schema. Older pinned examples
  // still receive structural validation from their declared versioned schema.
  const semanticErrors = schemaVersion === currentSchemaVersion ? validateSemantic(doc) : [];
  const label = path.relative(process.cwd(), file) || file;
  const errors = validate.errors || [];
  const unknownErrors = errors.filter(error => error.keyword === 'additionalProperties');
  const hardErrors = warnUnknown
    ? errors.filter(error => error.keyword !== 'additionalProperties')
    : errors;
  const passed = (ok || (warnUnknown && hardErrors.length === 0)) && semanticErrors.length === 0;
  console.log(`${label}: ${passed ? 'PASS' : 'FAIL'}`);
  if (!ok) {
    if (warnUnknown && unknownErrors.length) {
      console.log('Unknown-property warnings:');
      console.log(JSON.stringify(unknownErrors, null, 2));
    }
    if (hardErrors.length) {
      console.log(JSON.stringify(hardErrors, null, 2));
      allPassed = false;
    }
  }
  if (semanticErrors.length) {
    console.log('OCF semantic integrity errors:');
    console.log(JSON.stringify(semanticErrors, null, 2));
    allPassed = false;
  }
}

process.exit(allPassed ? 0 : 1);

function getValidator(schemaVersion) {
  if (validators.has(schemaVersion)) return validators.get(schemaVersion);
  if (typeof schemaVersion !== 'string') return null;

  const versionedPath = path.join(repoRoot, `v${schemaVersion}`, 'schema.json');
  const schemaPath = fs.existsSync(versionedPath)
    ? versionedPath
    : schemaVersion === currentSchemaVersion
      ? path.join(repoRoot, 'spec', 'schema.json')
      : null;
  if (!schemaPath) return null;

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const entry = { validate: ajv.compile(schema), schemaPath };
  validators.set(schemaVersion, entry);
  console.log(`Schema compilation: OK (${schemaVersion}, ${path.relative(repoRoot, schemaPath)})`);
  return entry;
}

function findJsonFiles(directory) {
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...findJsonFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.json')) found.push(fullPath);
  }
  return found.sort();
}
