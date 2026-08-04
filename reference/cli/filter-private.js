#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { filterByVisibility, unknownExtensionWarning } = require("../lib/visibility");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node reference/cli/filter-private.js <file.ocf.json>");
  process.exit(2);
}

const validatorPath = path.resolve(__dirname, "../validator/validate.js");
const validation = spawnSync(process.execPath, [validatorPath, inputPath], { encoding: "utf8" });
if (validation.status !== 0) {
  console.error("Refusing to filter an OCF file that does not pass validation.");
  if (validation.stdout) console.error(validation.stdout.trim());
  if (validation.stderr) console.error(validation.stderr.trim());
  process.exit(validation.status || 1);
}

const document = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const filtered = filterByVisibility(document, "shared");
const sourceMeta = document.meta || {};
filtered.meta = pruneUndefined({
  fileRole: "candidate-curated",
  lastModified: new Date().toISOString().slice(0, 10),
  language: sourceMeta.language,
  source: { kind: "converted" },
  parentFileId: sourceMeta.id,
  parentVersion: sourceMeta.version,
  lineageNotes: "Derived by schema-aware visibility filtering. Private items and unknown extension namespaces without explicit valid visibility were excluded; review retained content before sharing.",
});
const extensionWarning = unknownExtensionWarning(document);
if (extensionWarning) console.error(extensionWarning);
process.stdout.write(`${JSON.stringify(filtered, null, 2)}\n`);

function pruneUndefined(value) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}
