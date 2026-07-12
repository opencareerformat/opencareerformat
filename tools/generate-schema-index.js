#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const schema = readJson(path.join(repoRoot, "schema.json"));
const semantics = readJson(path.join(__dirname, "schema-semantics.json"));
const visibilityPaths = new Map();
const idDefinitionPaths = new Map();
const referenceLikeFields = new Set();
const visited = new Set();

walk(schema, [], "#");
checkReferenceCoverage();

const index = {
  schemaVersion: schema.properties?.schemaVersion?.const,
  visibilityPaths: [...visibilityPaths.values()].sort((a, b) => pathKey(a.segments).localeCompare(pathKey(b.segments))),
  idDefinitionPaths: [...idDefinitionPaths.values()].sort((a, b) => pathKey(a.segments).localeCompare(pathKey(b.segments))),
  referenceFields: semantics.referenceFields,
};

const outputPath = path.join(repoRoot, "reference", "schema-index.json");
fs.writeFileSync(outputPath, `${JSON.stringify(index, null, 2)}\n`);
console.log(`schema.json -> reference/schema-index.json (${index.visibilityPaths.length} visibility paths)`);

function walk(node, segments, schemaPointer) {
  if (!node || typeof node !== "object") return;
  if (node.$ref?.startsWith("#/$defs/")) {
    const name = decodePointer(node.$ref.slice("#/$defs/".length));
    const key = `${name}|${pathKey(segments)}`;
    if (visited.has(key)) return;
    visited.add(key);
    walk(schema.$defs[name], segments, node.$ref);
    return;
  }

  const visibility = node.properties?.visibility;
  if (visibility) {
    const resolved = resolve(visibility);
    if (resolved?.default) {
      visibilityPaths.set(pathKey(segments), { segments, default: resolved.default });
    }
  }

  if (node.properties?.id && !semantics.nonDefiningIdPaths.includes(pathKey(segments))) {
    idDefinitionPaths.set(pathKey(segments), { segments, group: idGroup(segments) });
  }

  for (const [name, child] of Object.entries(node.properties || {})) {
    if (/(Id|Ids|Ref)$/.test(name)) referenceLikeFields.add(name);
    if (name === "visibility") continue;
    walkProperty(child, [...segments, name], `${schemaPointer}/properties/${encodePointer(name)}`);
  }

  if (node.additionalProperties && typeof node.additionalProperties === "object") {
    walkProperty(node.additionalProperties, [...segments, "*"], `${schemaPointer}/additionalProperties`);
  }

  for (const keyword of ["allOf", "anyOf", "oneOf"]) {
    for (const [index, child] of (node[keyword] || []).entries()) {
      walk(child, segments, `${schemaPointer}/${keyword}/${index}`);
    }
  }
}

function walkProperty(node, segments, pointer) {
  if (node?.type === "array" || node?.items) {
    walk(node.items, [...segments, "*"], `${pointer}/items`);
  } else {
    walk(node, segments, pointer);
  }
}

function resolve(node) {
  if (!node?.$ref?.startsWith("#/$defs/")) return node;
  return schema.$defs[decodePointer(node.$ref.slice("#/$defs/".length))];
}

function checkReferenceCoverage() {
  const covered = new Set([
    ...Object.keys(semantics.referenceFields),
    ...semantics.ignoredReferenceLikeFields,
  ]);
  const missing = [...referenceLikeFields].filter((name) => !covered.has(name)).sort();
  if (missing.length) {
    throw new Error(`Reference-like schema fields need classification in tools/schema-semantics.json: ${missing.join(", ")}`);
  }
}

function pathKey(segments) {
  return segments.join(".");
}

function idGroup(segments) {
  if (segments[0] === "sourceArtifacts") return "source-artifact";
  if (segments[0] === "experience" && segments.length === 2) return "experience";
  if (segments.includes("achievements") || segments.includes("spanning")) return "achievement";
  if (segments.includes("projects")) return "project";
  return "durable-item";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function encodePointer(value) {
  return value.replace(/~/g, "~0").replace(/\//g, "~1");
}

function decodePointer(value) {
  return value.replace(/~1/g, "/").replace(/~0/g, "~");
}
