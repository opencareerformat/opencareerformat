#!/usr/bin/env node

const fs = require("fs");
const { filterByVisibility } = require("../lib/visibility");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node reference/cli/filter-private.js <file.ocf.json>");
  process.exit(2);
}

const document = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const filtered = filterByVisibility(document, "shared");
process.stdout.write(`${JSON.stringify(filtered, null, 2)}\n`);
