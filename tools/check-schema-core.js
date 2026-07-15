#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

let Ajv;
let addFormats;
try {
  Ajv = require("../reference/validator/node_modules/ajv/dist/2020");
  addFormats = require("../reference/validator/node_modules/ajv-formats");
} catch {
  console.error("Schema checks require the pinned validator dependencies. Run: npm --prefix reference/validator ci");
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, "..");
execFileSync(process.execPath, [path.join(__dirname, "generate-schema-core.js"), "--check"], { stdio: "inherit" });
const core = readJson(path.join(repoRoot, "schema-core.json"));
const full = readJson(path.join(repoRoot, "schema.json"));
const bootstrap = fs.readFileSync(path.join(repoRoot, "prompts", "application-bootstrap.md"), "utf8");
const marker = "## Minimal Starter Shape";
const section = bootstrap.slice(bootstrap.indexOf(marker));
const match = section.match(/```json\s*\n([\s\S]*?)\n```/);
if (!match) throw new Error("Could not find the bootstrap minimal starter JSON block");
const example = JSON.parse(match[1]);

for (const [label, schema] of [["schema-core.json", core], ["schema.json", full]]) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(example)) {
    console.error(`Application bootstrap starter does not validate against ${label}:`);
    console.error(JSON.stringify(validate.errors, null, 2));
    process.exit(1);
  }
}

console.log("schema core projection and bootstrap starter: PASS");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
