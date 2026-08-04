#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

let Ajv;
let addFormats;
try {
  ({ Ajv2020: Ajv, addFormats } = require("../reference/validator/dependencies"));
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
const canonicalDocuments = new Map();
let jsonBlockCount = 0;
let schemaCheckedCount = 0;
let syntaxOnlyCount = 0;
let canonicalSubsetCount = 0;

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

    if (block.canonicalSource) {
      const canonicalFailure = validateCanonicalSubset(value, block.canonicalSource);
      if (canonicalFailure) {
        failures.push(`${relativePath}:${block.line}: ${canonicalFailure}`);
        continue;
      }
      canonicalSubsetCount += 1;
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
  `(${jsonBlockCount} blocks: ${schemaCheckedCount} schema-checked, ` +
  `${canonicalSubsetCount} canonical subsets, ${syntaxOnlyCount} syntax-only)`,
);

function validateCanonicalSubset(value, source) {
  const separator = source.indexOf("#");
  const filePart = separator === -1 ? source : source.slice(0, separator);
  const pointer = separator === -1 ? "" : source.slice(separator + 1);
  const canonicalPath = path.resolve(repoRoot, filePart);

  if (!canonicalPath.startsWith(`${repoRoot}${path.sep}`)) {
    return `canonical subset path leaves the repository: ${source}`;
  }
  if (!fs.existsSync(canonicalPath)) {
    return `canonical subset source does not exist: ${filePart}`;
  }

  let canonicalDocument = canonicalDocuments.get(canonicalPath);
  if (!canonicalDocument) {
    try {
      canonicalDocument = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
    } catch (error) {
      return `could not read canonical subset source ${filePart}: ${error.message}`;
    }
    canonicalDocuments.set(canonicalPath, canonicalDocument);
  }

  const target = resolveJsonPointer(canonicalDocument, pointer);
  if (!target.found) {
    return `canonical subset pointer not found: ${source}`;
  }

  const mismatch = compareSubset(value, target.value, "$");
  return mismatch ? `canonical subset drifted from ${source}\n  ${mismatch}` : null;
}

function compareSubset(subset, canonical, location) {
  if (Array.isArray(subset)) {
    if (!Array.isArray(canonical)) return `${location} is an array only in the documentation`;

    const objectsWithIds = subset.every(
      (item) => isPlainObject(item) && typeof item.id === "string",
    );
    if (objectsWithIds) {
      for (const item of subset) {
        const canonicalItem = canonical.find(
          (candidate) => isPlainObject(candidate) && candidate.id === item.id,
        );
        if (!canonicalItem) return `${location} has no canonical item with id ${JSON.stringify(item.id)}`;
        const mismatch = compareSubset(item, canonicalItem, `${location}[id=${JSON.stringify(item.id)}]`);
        if (mismatch) return mismatch;
      }
      return null;
    }

    const objectsWithoutIds = subset.every(isPlainObject);
    if (objectsWithoutIds) {
      const remaining = canonical.map((item, index) => ({ item, index }));
      for (const item of subset) {
        const matchIndex = remaining.findIndex(
          (candidate) => compareSubset(item, candidate.item, `${location}[${candidate.index}]`) === null,
        );
        if (matchIndex === -1) {
          return `${location} has no canonical object matching ${JSON.stringify(item)}`;
        }
        remaining.splice(matchIndex, 1);
      }
      return null;
    }

    if (JSON.stringify(subset) !== JSON.stringify(canonical)) {
      return `${location} array differs; arrays without item IDs must be included in full`;
    }
    return null;
  }

  if (isPlainObject(subset)) {
    if (!isPlainObject(canonical)) return `${location} is an object only in the documentation`;
    for (const [key, child] of Object.entries(subset)) {
      if (!(key in canonical)) return `${location}.${key} does not exist in the canonical object`;
      const mismatch = compareSubset(child, canonical[key], `${location}.${key}`);
      if (mismatch) return mismatch;
    }
    return null;
  }

  if (JSON.stringify(subset) !== JSON.stringify(canonical)) {
    return `${location} differs: documentation has ${JSON.stringify(subset)}, ` +
      `canonical has ${JSON.stringify(canonical)}`;
  }
  return null;
}

function resolveJsonPointer(document, pointer) {
  if (pointer === "") return { found: true, value: document };
  if (!pointer.startsWith("/")) return { found: false };

  let value = document;
  for (const encodedPart of pointer.slice(1).split("/")) {
    const part = encodedPart.replace(/~1/g, "/").replace(/~0/g, "~");
    if (Array.isArray(value)) {
      if (!/^(0|[1-9]\d*)$/.test(part) || Number(part) >= value.length) return { found: false };
      value = value[Number(part)];
    } else if (isPlainObject(value) && part in value) {
      value = value[part];
    } else {
      return { found: false };
    }
  }
  return { found: true, value };
}

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
    const before = markdown.slice(0, match.index);
    const precedingLines = before.split("\n");
    let previousLine = precedingLines.length - 1;
    while (previousLine >= 0 && !precedingLines[previousLine].trim()) previousLine -= 1;
    const annotation = precedingLines[previousLine]?.match(
      /^<!--\s*canonical-subset:\s*(.+?)\s*-->$/,
    );
    blocks.push({
      source: match[1].replace(/\n$/, ""),
      line: markdown.slice(0, match.index).split("\n").length,
      canonicalSource: annotation?.[1],
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
