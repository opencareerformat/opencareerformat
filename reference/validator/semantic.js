const schemaIndex = require("../schema-index.json");

const idPathGroups = new Map(
  schemaIndex.idDefinitionPaths.map((item) => [item.segments.join("."), item.group]),
);

function validateSemantic(document) {
  const errors = [];
  const ids = new Map();
  const groups = new Map([
    ["source-artifact", new Set()],
    ["experience", new Set()],
    ["project", new Set()],
    ["achievement", new Set()],
    ["durable-item", new Set()],
  ]);
  const references = [];
  const supersession = new Map();

  walk(document, [], (value, segments) => {
    const group = idPathGroups.get(patternPath(segments));
    if (group && typeof value.id === "string") {
      if (ids.has(value.id)) {
        errors.push(error(segments, `duplicate local id ${JSON.stringify(value.id)}; first defined at ${ids.get(value.id)}`));
      } else {
        ids.set(value.id, jsonPointer(segments));
      }
      groups.get(group)?.add(value.id);
    }

    for (const [field, rule] of Object.entries(schemaIndex.referenceFields)) {
      if (!Object.prototype.hasOwnProperty.call(value, field)) continue;
      const raw = value[field];
      const values = rule.many ? raw : [raw];
      if (!Array.isArray(values)) continue;
      for (const targetId of values) {
        if (typeof targetId === "string") {
          references.push({ field, targetId, target: rule.target, allowParentLineage: rule.allowParentLineage, segments: [...segments, field] });
          if (field === "supersededById" && typeof value.id === "string") supersession.set(value.id, targetId);
        }
      }
    }
  });

  const organizationKeys = new Set(Object.keys(document.organizations || {}));
  for (const reference of references) {
    const targets = targetSet(reference.target, ids, groups, organizationKeys);
    const mayResolveInParent = reference.allowParentLineage && document.meta?.parentFileId;
    if (!targets.has(reference.targetId) && !mayResolveInParent) {
      errors.push(error(reference.segments, `${reference.field} points to missing ${reference.target} ${JSON.stringify(reference.targetId)}`));
    }
  }

  const reportedCycles = new Set();
  for (const start of supersession.keys()) {
    const seen = new Map();
    const path = [];
    let current = start;
    while (supersession.has(current)) {
      if (seen.has(current)) {
        const cycle = path.slice(seen.get(current));
        const signature = [...cycle].sort().join("\u0000");
        if (!reportedCycles.has(signature)) {
          reportedCycles.add(signature);
          errors.push(error([], `supersession cycle includes ${cycle.map((id) => JSON.stringify(id)).join(", ")}`));
        }
        break;
      }
      seen.set(current, path.length);
      path.push(current);
      current = supersession.get(current);
    }
  }

  return errors;
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

function targetSet(target, ids, groups, organizationKeys) {
  if (target === "any-id") return new Set(ids.keys());
  if (target === "organization-key") return organizationKeys;
  return groups.get(target) || new Set();
}

function patternPath(segments) {
  return segments.map((part) => typeof part === "number" ? "*" : part).join(".");
}

function jsonPointer(segments) {
  if (!segments.length) return "/";
  return `/${segments.map((part) => String(part).replace(/~/g, "~0").replace(/\//g, "~1")).join("/")}`;
}

function error(segments, message) {
  return { instancePath: jsonPointer(segments), keyword: "ocfSemantic", message };
}

module.exports = { validateSemantic };
