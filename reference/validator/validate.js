// OCF reference validator.
// Validates one or more OCF files against spec/schema.json using AJV (JSON Schema 2020-12).
// Run from repo root: node reference/validator/validate.js
//   or:               cd reference/validator && node validate.js
// Use --warn-unknown to treat additionalProperties violations as warnings while
// still failing other schema violations.

const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const schemaPath = path.join(repoRoot, 'spec', 'schema.json');
const examplesDir = path.join(repoRoot, 'spec', 'examples');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
console.log('Schema compilation: OK');
const schemaVersion = schema.properties?.schemaVersion?.const || 'unknown';
console.log(`Loaded OCF schemaVersion: ${schemaVersion}`);

const args = process.argv.slice(2);
const warnUnknown = args.includes('--warn-unknown');
const inputs = args.filter(arg => arg !== '--warn-unknown');
const examples = inputs.length
  ? inputs.map(file => path.resolve(process.cwd(), file))
  : fs.readdirSync(examplesDir)
      .filter(f => f.endsWith('.json'))
      .map(file => path.join(examplesDir, file));

let allPassed = true;
for (const file of examples) {
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  const ok = validate(doc);
  const label = path.relative(process.cwd(), file) || file;
  const errors = validate.errors || [];
  const unknownErrors = errors.filter(error => error.keyword === 'additionalProperties');
  const hardErrors = warnUnknown
    ? errors.filter(error => error.keyword !== 'additionalProperties')
    : errors;
  const passed = ok || (warnUnknown && hardErrors.length === 0);
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
}

process.exit(allPassed ? 0 : 1);
