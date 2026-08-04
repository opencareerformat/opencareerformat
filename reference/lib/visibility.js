const schemaIndex = require("../schema-index.json");

const OMIT = Symbol("omit");
const VALID_VISIBILITY = new Set(["public", "shared", "private"]);
const EXTENSION_NAMESPACE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
const visibilityPaths = schemaIndex.visibilityPaths;
const defaultByPath = new Map(visibilityPaths.map((item) => [item.segments.join("."), item.default]));
const structuralPathKeys = new Set(schemaIndex.structuralPaths);
const structuralPaths = schemaIndex.structuralPaths.map((item) => item ? item.split(".") : []);
const idPathGroups = new Map(
  schemaIndex.idDefinitionPaths.map((item) => [item.segments.join("."), item.group]),
);

function filterByVisibility(value, mode = "shared", options = {}) {
  const filtered = filterValue(value, [], mode);
  if (filtered === OMIT) return undefined;
  if (!options.preserveFilteredReferences) {
    pruneFilteredReferences(filtered, collectTargets(value), collectTargets(filtered));
  }
  pruneUnreferencedOrganizations(filtered);
  if (!options.preserveMetadata && filtered && typeof filtered === "object") {
    delete filtered.meta;
  }
  return filtered;
}

function resolvedVisibility(value, segments = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  if (Object.prototype.hasOwnProperty.call(value, "visibility")) {
    return VALID_VISIBILITY.has(value.visibility) ? value.visibility : "private";
  }
  const exact = defaultByPath.get(segments.join("."));
  if (exact) return exact;
  return visibilityPaths.find((item) => matchesSchemaPath(item.segments, segments))?.default;
}

function unknownExtensionWarning(document) {
  const namespaces = new Set();
  collectExtensionNamespaces(document, namespaces);

  if (namespaces.size === 0) return undefined;
  const noun = namespaces.size === 1 ? "namespace was" : "namespaces were";
  return `Warning: ${namespaces.size} unknown extension ${noun} encountered. Generic visibility filtering excludes extension namespaces without explicit valid visibility and cannot determine whether retained extension content is safe to share; review it before use.`;
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

function filterValue(value, segments, mode, opaqueNamespaceAllowed = false) {
  if (Array.isArray(value)) {
    return value
      .map((item) => filterValue(item, [...segments, "*"], mode, opaqueNamespaceAllowed))
      .filter((item) => item !== OMIT);
  }

  if (!value || typeof value !== "object") return value;

  const visibility = resolvedVisibility(value, segments);
  if (visibility === "private") return OMIT;
  if (mode === "public" && visibility && visibility !== "public") return OMIT;
  const allowsOpaquePayload = opaqueNamespaceAllowed || isExplicitlyVisibleExtensionNamespace(value, segments);
  if (visibility === undefined && !allowsOpaquePayload && !isStructuralPath(segments)) return OMIT;

  const result = {};
  for (const [key, item] of Object.entries(value)) {
    const filtered = filterValue(item, [...segments, key], mode, allowsOpaquePayload);
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

function pruneUnreferencedOrganizations(document) {
  if (!document?.organizations || typeof document.organizations !== "object" || Array.isArray(document.organizations)) {
    return;
  }

  const referenced = new Set();
  walk(document, [], (value, segments) => {
    if (segments[0] === "organizations") return;
    for (const [field, rule] of Object.entries(schemaIndex.referenceFields)) {
      if (rule.target !== "organization-key" || !Object.prototype.hasOwnProperty.call(value, field)) continue;
      if (rule.many && Array.isArray(value[field])) {
        value[field].forEach((target) => typeof target === "string" && referenced.add(target));
      } else if (!rule.many && typeof value[field] === "string") {
        referenced.add(value[field]);
      }
    }
  });

  for (const key of Object.keys(document.organizations)) {
    if (!referenced.has(key)) delete document.organizations[key];
  }
  if (Object.keys(document.organizations).length === 0) delete document.organizations;
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

function isStructuralPath(segments) {
  if (structuralPathKeys.has(segments.join("."))) return true;
  return structuralPaths.some((item) => matchesSchemaPath(item, segments));
}

function matchesSchemaPath(pattern, segments) {
  return pattern.length === segments.length && pattern.every((part, index) => part === "*" || part === segments[index]);
}

function isExplicitlyVisibleExtensionNamespace(value, segments) {
  return segments.length >= 2 && segments.at(-2) === "extensions" && VALID_VISIBILITY.has(value.visibility);
}

module.exports = { filterByVisibility, resolvedVisibility, unknownExtensionWarning };
