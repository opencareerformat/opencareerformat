const schemaIndex = require("../schema-index.json");

const OMIT = Symbol("omit");
const VALID_VISIBILITY = new Set(["public", "shared", "private"]);
const EXTENSION_NAMESPACE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
const defaultByPath = new Map(
  schemaIndex.visibilityPaths.map((item) => [item.segments.join("."), item.default]),
);
const idPathGroups = new Map(
  schemaIndex.idDefinitionPaths.map((item) => [item.segments.join("."), item.group]),
);

function filterByVisibility(value, mode = "shared", options = {}) {
  const filtered = filterValue(value, [], mode);
  if (filtered === OMIT) return undefined;
  if (!options.preserveFilteredReferences) {
    pruneFilteredReferences(filtered, collectTargets(value), collectTargets(filtered));
  }
  return filtered;
}

function resolvedVisibility(value, segments = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  if (Object.prototype.hasOwnProperty.call(value, "visibility")) {
    return VALID_VISIBILITY.has(value.visibility) ? value.visibility : "private";
  }
  return defaultByPath.get(segments.join("."));
}

function unknownExtensionWarning(document) {
  const namespaces = new Set();
  collectExtensionNamespaces(document, namespaces);

  if (namespaces.size === 0) return undefined;
  const noun = namespaces.size === 1 ? "namespace was" : "namespaces were";
  return `Warning: ${namespaces.size} unknown extension ${noun} preserved after generic visibility filtering. OCF cannot determine whether the remaining extension content is safe to share; review it before use.`;
}

function collectExtensionNamespaces(value, namespaces) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectExtensionNamespaces(item, namespaces));
    return;
  }
  if (!value || typeof value !== "object") return;

  if (value.extensions && typeof value.extensions === "object" && !Array.isArray(value.extensions)) {
    for (const namespace of Object.keys(value.extensions)) {
      if (EXTENSION_NAMESPACE.test(namespace)) namespaces.add(namespace);
    }
  }
  for (const [key, item] of Object.entries(value)) {
    if (key !== "extensions") collectExtensionNamespaces(item, namespaces);
  }
}

function filterValue(value, segments, mode) {
  if (Array.isArray(value)) {
    return value
      .map((item) => filterValue(item, [...segments, "*"], mode))
      .filter((item) => item !== OMIT);
  }

  if (!value || typeof value !== "object") return value;

  const visibility = resolvedVisibility(value, segments);
  if (visibility === "private") return OMIT;
  if (mode === "public" && visibility && visibility !== "public") return OMIT;

  const result = {};
  for (const [key, item] of Object.entries(value)) {
    const filtered = filterValue(item, [...segments, key], mode);
    if (filtered !== OMIT) result[key] = filtered;
  }
  return result;
}

function collectTargets(document) {
  const targets = new Map([
    ["any-id", new Set()],
    ["source-artifact", new Set()],
    ["experience", new Set()],
    ["project", new Set()],
    ["achievement", new Set()],
    ["organization-key", new Set(Object.keys(document?.organizations || {}))],
  ]);

  walk(document, [], (value, segments) => {
    const group = idPathGroups.get(patternPath(segments));
    if (!group || typeof value.id !== "string") return;
    targets.get("any-id").add(value.id);
    targets.get(group)?.add(value.id);
  });
  return targets;
}

function pruneFilteredReferences(document, originalTargets, filteredTargets) {
  walk(document, [], (value) => {
    for (const [field, rule] of Object.entries(schemaIndex.referenceFields)) {
      if (!Object.prototype.hasOwnProperty.call(value, field)) continue;
      const existedAndWasFiltered = (targetId) =>
        originalTargets.get(rule.target)?.has(targetId) && !filteredTargets.get(rule.target)?.has(targetId);

      if (rule.many && Array.isArray(value[field])) {
        value[field] = value[field].filter((targetId) => !existedAndWasFiltered(targetId));
        if (value[field].length === 0) delete value[field];
      } else if (!rule.many && typeof value[field] === "string" && existedAndWasFiltered(value[field])) {
        delete value[field];
      }
    }
  });
}

function walk(value, segments, visit) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, [...segments, index], visit));
    return;
  }
  if (!value || typeof value !== "object") return;
  visit(value, segments);
  for (const [key, item] of Object.entries(value)) walk(item, [...segments, key], visit);
}

function patternPath(segments) {
  return segments.map((part) => typeof part === "number" ? "*" : part).join(".");
}

module.exports = { filterByVisibility, resolvedVisibility, unknownExtensionWarning };
