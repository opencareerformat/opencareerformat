#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const full = readJson(path.join(repoRoot, "schema.json"));
const config = readJson(path.join(__dirname, "schema-core-projection.json"));
const requiredDefs = new Set();

const core = {};
for (const key of ["$schema", "title", "description", "type", "required", "properties", "additionalProperties"]) {
  if (Object.prototype.hasOwnProperty.call(full, key)) core[key] = clone(full[key]);
}

core.$id = config.metadata.$id;
core.title = config.metadata.title;
core.description = config.metadata.description;
core.properties = Object.fromEntries(
  config.rootProperties.map((name) => {
    if (!full.properties[name]) throw new Error(`Unknown root property in projection: ${name}`);
    return [name, project(full.properties[name], `#/properties/${escapePointer(name)}`)];
  }),
);
core.required = (full.required || []).filter((name) => config.rootProperties.includes(name));

core.$defs = {};
while (requiredDefs.size > Object.keys(core.$defs).length) {
  for (const name of [...requiredDefs]) {
    if (core.$defs[name]) continue;
    if (!full.$defs[name]) throw new Error(`Projection references missing definition: ${name}`);
    core.$defs[name] = project(full.$defs[name], `#/$defs/${escapePointer(name)}`);
  }
}

const outputPath = path.join(repoRoot, "schema-core.json");
fs.writeFileSync(outputPath, `${JSON.stringify(core, null, 2)}\n`);
console.log(`schema.json -> schema-core.json (${Object.keys(core.$defs).length} definitions)`);

function project(value, pointer) {
  if (Array.isArray(value)) return value.map((item, index) => project(item, `${pointer}/${index}`));
  if (!value || typeof value !== "object") return value;

  if (typeof value.$ref === "string" && value.$ref.startsWith("#/$defs/")) {
    requiredDefs.add(unescapePointer(value.$ref.slice("#/$defs/".length)));
  }

  const result = {};
  const selection = config.propertySelections[pointer];
  for (const [key, item] of Object.entries(value)) {
    if (key === "properties" && selection) {
      for (const name of selection) {
        if (!item[name]) throw new Error(`Unknown projected property ${name} at ${pointer}`);
        result.properties ||= {};
        result.properties[name] = project(item[name], `${pointer}/properties/${escapePointer(name)}`);
      }
      continue;
    }
    if (key === "required" && selection) {
      result.required = item.filter((name) => selection.includes(name));
      continue;
    }
    result[key] = project(item, `${pointer}/${escapePointer(key)}`);
  }
  return result;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function escapePointer(value) {
  return value.replace(/~/g, "~0").replace(/\//g, "~1");
}

function unescapePointer(value) {
  return value.replace(/~1/g, "/").replace(/~0/g, "~");
}
