// OCF reference validator.
// Validates one or more OCF files against spec/schema.json using AJV (JSON Schema 2020-12).
// Run from repo root: node reference/validator/validate.js
//   or:               cd reference/validator && node validate.js

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

const inputs = process.argv.slice(2);
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
  console.log(`${label}: ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) {
    console.log(JSON.stringify(validate.errors, null, 2));
    allPassed = false;
  }
}

process.exit(allPassed ? 0 : 1);
