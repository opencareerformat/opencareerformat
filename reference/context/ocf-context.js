#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const schemaIndex = require("../schema-index.json");

const DEFAULT_PROFILE_PATH = path.join(__dirname, "career-summary.profile.json");
const idDefinitionPaths = new Set(schemaIndex.idDefinitionPaths.map((item) => item.segments.join(".")));

main(process.argv.slice(2));

function main(args) {
  const [command, ...rest] = args;
  try {
    if (command === "init") return initProfile(rest);
    if (command === "build") return buildView(rest);
    if (command === "get") return getItem(rest);
    usage();
    process.exitCode = 2;
  } catch (error) {
    console.error(`ocf-context: ${error.message}`);
    process.exitCode = 1;
  }
}

function usage() {
  console.error([
    "Usage:",
    "  node reference/context/ocf-context.js init [profile.json]",
    "  node reference/context/ocf-context.js build <master.ocf.json> [profile.json] [view.json]",
    "  node reference/context/ocf-context.js get <master.ocf.json> <item-id> [item.json]",
  ].join("\n"));
}

function initProfile(args) {
  if (args.length > 1) return invalidUsage();
  const profile = readJson(DEFAULT_PROFILE_PATH);
  const outputPath = args[0];
  if (!outputPath) return writeJson(profile, true);
  if (fs.existsSync(outputPath)) {
    throw new Error(`refusing to overwrite existing profile: ${outputPath}`);
  }
  writeJsonFile(outputPath, profile, true);
}

function buildView(args) {
  if (args.length < 1 || args.length > 3) return invalidUsage();
  const [masterPath, profilePath, outputPath] = args;
  const master = readJson(masterPath);
  const profile = readJson(profilePath || DEFAULT_PROFILE_PATH);
  validateProfile(profile);

  const omitted = [];
  const reduced = reduceValue(master, "$", null, profile, omitted);
  const view = {
    context: {
      format: "ocf-context-view",
      contextVersion: "1",
      profile: profile.name,
      source: {
        file: path.basename(masterPath),
        schemaVersion: master.schemaVersion || null,
        metaId: master.meta?.id || null,
        version: master.meta?.version || null,
        lastModified: master.meta?.lastModified || null,
      },
      authoritative: false,
      notice: "Disposable context view. Missing content may be not loaded; apply accepted changes to the complete source master.",
      omitted,
    },
    ocf: reduced,
  };
  outputPath ? writeJsonFile(outputPath, view) : writeJson(view);
}

function getItem(args) {
  if (args.length < 2 || args.length > 3) return invalidUsage();
  const [masterPath, itemId, outputPath] = args;
  const master = readJson(masterPath);
  const matches = [];
  findById(master, [], "$", itemId, matches);
  if (matches.length === 0) throw new Error(`item id not found: ${itemId}`);
  if (matches.length > 1) throw new Error(`item id is not unique: ${itemId}`);

  const result = {
    context: {
      format: "ocf-context-item",
      contextVersion: "1",
      source: {
        file: path.basename(masterPath),
        schemaVersion: master.schemaVersion || null,
        metaId: master.meta?.id || null,
        version: master.meta?.version || null,
        lastModified: master.meta?.lastModified || null,
      },
      path: matches[0].path,
      authoritative: false,
      notice: "Full item retrieved from the source master for temporary context. Apply accepted changes to the complete source master.",
    },
    item: matches[0].item,
  };
  outputPath ? writeJsonFile(outputPath, result) : writeJson(result);
}

function reduceValue(value, jsonPath, collectionName, profile, omitted) {
  if (Array.isArray(value)) {
    return value.map((item, index) => reduceValue(item, `${jsonPath}[${index}]`, collectionName, profile, omitted));
  }
  if (!isObject(value)) return value;

  const result = {};
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${jsonPath}.${key}`;
    const compactFields = profile.compactCollections?.[collectionName] || [];
    const reason = profile.withholdSections.includes(key)
      ? "section withheld by profile"
      : profile.withholdFields.includes(key) || compactFields.includes(key)
        ? "field withheld by profile"
        : null;
    if (reason) {
      omitted.push(describeOmission(childPath, reason, value, child));
      continue;
    }
    const nextCollection = Array.isArray(child) ? key : null;
    result[key] = reduceValue(child, childPath, nextCollection, profile, omitted);
  }
  return result;
}

function describeOmission(itemPath, reason, parent, value) {
  const omission = { path: itemPath, reason };
  if (typeof parent.id === "string") omission.itemId = parent.id;
  if (typeof parent.kind === "string") omission.itemKind = parent.kind;
  if (typeof parent.label === "string") omission.itemLabel = parent.label;
  omission.valueType = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
  return omission;
}

function findById(value, segments, jsonPath, itemId, matches) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findById(item, [...segments, "*"], `${jsonPath}[${index}]`, itemId, matches));
    return;
  }
  if (!isObject(value)) return;
  if (idDefinitionPaths.has(segments.join(".")) && value.id === itemId) {
    matches.push({ path: jsonPath, item: value });
  }
  for (const [key, child] of Object.entries(value)) {
    findById(child, [...segments, key], `${jsonPath}.${key}`, itemId, matches);
  }
}

function validateProfile(profile) {
  if (!isObject(profile) || profile.format !== "ocf-context-profile") {
    throw new Error('profile format must be "ocf-context-profile"');
  }
  if (typeof profile.name !== "string" || !profile.name) {
    throw new Error("profile name must be a non-empty string");
  }
  for (const field of ["withholdFields", "withholdSections"]) {
    if (!Array.isArray(profile[field]) || !profile[field].every((item) => typeof item === "string")) {
      throw new Error(`${field} must be an array of strings`);
    }
  }
  if (!isObject(profile.compactCollections)) {
    throw new Error("compactCollections must be an object");
  }
  for (const [name, fields] of Object.entries(profile.compactCollections)) {
    if (!Array.isArray(fields) || !fields.every((item) => typeof item === "string")) {
      throw new Error(`compactCollections.${name} must be an array of strings`);
    }
  }
}

function readJson(inputPath) {
  return JSON.parse(fs.readFileSync(inputPath, "utf8"));
}

function writeJson(value, pretty = false) {
  process.stdout.write(`${JSON.stringify(value, null, pretty ? 2 : 0)}\n`);
}

function writeJsonFile(outputPath, value, pretty = false) {
  fs.writeFileSync(outputPath, `${JSON.stringify(value, null, pretty ? 2 : 0)}\n`, { flag: "wx" });
}

function invalidUsage() {
  usage();
  process.exitCode = 2;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
