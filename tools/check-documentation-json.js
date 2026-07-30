#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

let Ajv;
let addFormats;
try {
  Ajv = require("../reference/validator/node_modules/ajv/dist/2020");
  addFormats = require("../reference/validator/node_modules/ajv-formats");
} catch {
  console.error("Documentation validation requires the pinned validator dependencies.");
  console.error("Run: npm --prefix reference/validator ci");
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, "..");
const schema = JSON.parse(fs.readFileSync(path.join(repoRoot, "spec/schema.json"), "utf8"));
const markdownFiles = findMarkdownFiles(repoRoot);
const syntaxOnlyPaths = [
  /^spec\/v\d+\.\d+-planning\.md$/,
  /^prompts\/.*-experimental\.md$/,
];

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const fullDocumentValidator = ajv.compile(schema);
const relaxedDefinitions = relaxForFragment(schema.$defs);
const fragmentValidators = collectClosedObjectSchemas(schema).map(({ pointer, objectSchema }) => ({
  pointer,
  validate: ajv.compile({
    $schema: schema.$schema,
    $defs: relaxedDefinitions,
    ...relaxForFragment(objectSchema),
  }),
}));

const provenanceKeys = new Set([
  "source",
  "tool",
  "date",
  "sourceArtifactId",
  "sourceFileId",
  "sourceItemId",
  "confidence",
  "sessionTopic",
  "operation",
  "note",
]);

const failures = [];
let jsonBlockCount = 0;
let schemaCheckedCount = 0;
let syntaxOnlyCount = 0;

for (const file of markdownFiles) {
  const relativePath = path.relative(repoRoot, file).split(path.sep).join("/");
  const markdown = fs.readFileSync(file, "utf8");
  const blocks = extractJsonBlocks(markdown);

  for (const block of blocks) {
    jsonBlockCount += 1;
    let value;
    try {
      value = JSON.parse(block.source);
    } catch (error) {
      failures.push(`${relativePath}:${block.line}: invalid JSON: ${error.message}`);
      continue;
    }

    if (syntaxOnlyPaths.some((pattern) => pattern.test(relativePath))) {
      syntaxOnlyCount += 1;
      continue;
    }

    const result = validateDocumentationFragment(value);
    if (result.ok) {
      schemaCheckedCount += 1;
      continue;
    }

    failures.push(
      `${relativePath}:${block.line}: JSON example does not match a current OCF document or object shape\n` +
      `  keys: ${result.keys}\n` +
      `  closest shape: ${result.closestPointer}\n` +
      formatErrors(result.errors),
    );
  }
}

if (failures.length) {
  console.error("documentation JSON validation: FAIL");
  for (const failure of failures) console.error(`\n${failure}`);
  process.exit(1);
}

console.log(
  `documentation JSON validation: PASS ` +
  `(${jsonBlockCount} blocks: ${schemaCheckedCount} schema-checked, ${syntaxOnlyCount} syntax-only)`,
);

function validateDocumentationFragment(value) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      keys: Array.isArray(value) ? "[array]" : typeof value,
      closestPointer: "(none)",
      errors: [{ instancePath: "", message: "top-level documentation examples must be JSON objects" }],
    };
  }

  const keys = Object.keys(value);
  const looksLikeFullDocument = "$schema" in value || "schemaVersion" in value;
  if (looksLikeFullDocument) {
    const ok = fullDocumentValidator(value);
    return {
      ok,
      keys: keys.join(", ") || "(none)",
      closestPointer: "#",
      errors: fullDocumentValidator.errors || [],
    };
  }

  if (keys.length > 0 && keys.every((key) => provenanceKeys.has(key))) {
    return { ok: true };
  }

  let closest = null;
  for (const candidate of fragmentValidators) {
    const ok = candidate.validate(value);
    if (ok) return { ok: true };

    const errors = candidate.validate.errors || [];
    const score = errors.reduce((total, error) => {
      if (error.keyword === "additionalProperties") return total + 10;
      return total + 1;
    }, 0);
    if (!closest || score < closest.score) {
      closest = { pointer: candidate.pointer, errors, score };
    }
  }

  return {
    ok: false,
    keys: keys.join(", ") || "(none)",
    closestPointer: closest?.pointer || "(none)",
    errors: closest?.errors || [],
  };
}

function collectClosedObjectSchemas(rootSchema) {
  const found = [];
  visit(rootSchema, "#");
  return found;

  function visit(node, pointer) {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;

    if (
      node.type === "object" &&
      node.properties &&
      node.additionalProperties === false
    ) {
      found.push({ pointer, objectSchema: node });
    }

    for (const [key, child] of Object.entries(node)) {
      if (key === "examples" || key === "default") continue;
      if (child && typeof child === "object") {
        visit(child, `${pointer}/${escapeJsonPointer(key)}`);
      }
    }
  }
}

function relaxForFragment(value) {
  if (Array.isArray(value)) return value.map(relaxForFragment);
  if (!value || typeof value !== "object") return value;

  const relaxed = {};
  for (const [key, child] of Object.entries(value)) {
    if (
      key === "$id" ||
      key === "required" ||
      key === "anyOf" ||
      key === "oneOf" ||
      key === "allOf" ||
      key === "minProperties"
    ) {
      continue;
    }
    relaxed[key] = relaxForFragment(child);
  }
  return relaxed;
}

function extractJsonBlocks(markdown) {
  const blocks = [];
  const pattern = /^```json\s*\n([\s\S]*?)^```\s*$/gm;
  for (const match of markdown.matchAll(pattern)) {
    blocks.push({
      source: match[1].replace(/\n$/, ""),
      line: markdown.slice(0, match.index).split("\n").length,
    });
  }
  return blocks;
}

function findMarkdownFiles(directory) {
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...findMarkdownFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".md")) found.push(fullPath);
  }
  return found.sort();
}

function formatErrors(errors) {
  if (!errors.length) return "  no compatible closed object shape found";
  return errors
    .slice(0, 5)
    .map((error) => {
      const location = error.instancePath || "/";
      const detail = error.params?.additionalProperty
        ? `: ${error.params.additionalProperty}`
        : "";
      return `  ${location} ${error.message}${detail}`;
    })
    .join("\n");
}

function escapeJsonPointer(value) {
  return value.replace(/~/g, "~0").replace(/\//g, "~1");
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
