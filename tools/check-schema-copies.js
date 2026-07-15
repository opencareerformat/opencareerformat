#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const currentPath = path.join(repoRoot, "schema.json");
const current = JSON.parse(fs.readFileSync(currentPath, "utf8"));
const version = current.properties?.schemaVersion?.const;

if (!version) {
  throw new Error("schema.json does not declare properties.schemaVersion.const");
}

const expected = fs.readFileSync(currentPath);
const copies = [
  path.join(repoRoot, "spec", "schema.json"),
  path.join(repoRoot, `v${version}`, "schema.json"),
];

for (const copy of copies) {
  if (!fs.existsSync(copy)) {
    throw new Error(`Missing current schema copy: ${path.relative(repoRoot, copy)}`);
  }
  if (!expected.equals(fs.readFileSync(copy))) {
    throw new Error(`${path.relative(repoRoot, copy)} differs from schema.json`);
  }
}

console.log(`current schema copies (${version}): PASS`);
