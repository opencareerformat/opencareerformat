const schemaIndex = require("../schema-index.json");

const OMIT = Symbol("omit");
const defaultByPath = new Map(
  schemaIndex.visibilityPaths.map((item) => [item.segments.join("."), item.default]),
);

function filterByVisibility(value, mode = "shared") {
  const filtered = filterValue(value, [], mode);
  return filtered === OMIT ? undefined : filtered;
}

function resolvedVisibility(value, segments = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  if (value.visibility) return value.visibility;
  return defaultByPath.get(segments.join("."));
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

module.exports = { filterByVisibility, resolvedVisibility };
