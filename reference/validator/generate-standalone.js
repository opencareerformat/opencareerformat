#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const standaloneCode = require("ajv/dist/standalone").default;
const { _ } = require("ajv/dist/compile/codegen");

const repoRoot = path.resolve(__dirname, "../..");
const schemaPath = path.join(repoRoot, "schema.json");
const outputPath = path.join(__dirname, "standalone.cjs");
const formatsOutputPath = path.join(__dirname, "standalone-formats.cjs");
const formatsSourcePath = require.resolve("ajv-formats/dist/formats");
const annotationKeywords = new Set([
  "$comment",
  "default",
  "deprecated",
  "description",
  "examples",
  "readOnly",
  "title",
  "writeOnly",
]);

const schema = stripAnnotations(JSON.parse(fs.readFileSync(schemaPath, "utf8")));
const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  code: {
    source: true,
    formats: _`require("./standalone-formats.cjs")`,
  },
});
addFormats(ajv);

const validate = ajv.compile(schema);
fs.writeFileSync(outputPath, `${standaloneCode(ajv, validate)}\n`);
fs.writeFileSync(
  formatsOutputPath,
  `${fs.readFileSync(formatsSourcePath, "utf8")}\nmodule.exports = exports.fullFormats;\n`,
);

console.log(`Generated ${path.relative(repoRoot, outputPath)} and ${path.relative(repoRoot, formatsOutputPath)}.`);

function stripAnnotations(value) {
  if (Array.isArray(value)) return value.map(stripAnnotations);
  if (!value || typeof value !== "object") return value;
  const result = {};
  for (const [key, child] of Object.entries(value)) {
    if (annotationKeywords.has(key)) continue;
    if (["$defs", "dependentSchemas", "patternProperties", "properties"].includes(key)) {
      result[key] = Object.fromEntries(
        Object.entries(child).map(([name, schema]) => [name, stripAnnotations(schema)]),
      );
    } else {
      result[key] = stripAnnotations(child);
    }
  }
  return result;
}
