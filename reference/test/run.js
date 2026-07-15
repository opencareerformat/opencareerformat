#!/usr/bin/env node

const assert = require("assert");
const { spawnSync } = require("child_process");
const path = require("path");
const { filterByVisibility } = require("../lib/visibility");
const { toJsonResume } = require("../exporters/json-resume");
const { validateSemantic } = require("../validator/semantic");

testPrivateDefaults();
testCanonicalVariantExport();
testSemanticReferences();
testContextProfile();
console.log("reference behavior tests: PASS");

function testPrivateDefaults() {
  const source = {
    person: {
      name: { renderAs: "Example Person" },
      contacts: [{ kind: "email", value: "private@example.com" }],
    },
    sourceArtifacts: [{ id: "resume", kind: "resume", capturedDate: { year: 2026 } }],
    talkingPoints: [{ statement: "Private by schema default" }],
    experience: [{
      id: "experience",
      name: "Example",
      positions: [{
        id: "position",
        title: "Role",
        achievements: [{
          id: "achievement",
          statement: "Shared by schema default",
          provenance: { sourceArtifactId: "resume" },
        }],
      }],
    }],
  };
  const filtered = filterByVisibility(source);

  assert.deepStrictEqual(filtered.person.contacts, []);
  assert.deepStrictEqual(filtered.sourceArtifacts, []);
  assert.deepStrictEqual(filtered.talkingPoints, []);
  assert.strictEqual(filtered.experience[0].positions[0].achievements[0].statement, "Shared by schema default");
  assert.strictEqual(filtered.experience[0].positions[0].achievements[0].provenance.sourceArtifactId, undefined);
  assert.deepStrictEqual(validateSemantic(filtered), []);

  const childInput = {
    ...source,
    meta: { parentFileId: "parent-file" },
  };
  const child = filterByVisibility(childInput, "shared", { preserveFilteredReferences: true });
  assert.strictEqual(child.experience[0].positions[0].achievements[0].provenance.sourceArtifactId, "resume");
  assert.deepStrictEqual(validateSemantic(child), []);
}

function testCanonicalVariantExport() {
  const exported = toJsonResume({
    person: { name: { renderAs: "Example Person" } },
    experience: [{
      name: "Example",
      positions: [{
        title: "Canonical title",
        titleVariants: [{ title: "Unselected title" }],
        achievements: [{
          statement: "Canonical statement",
          narrativeVariants: [{ statement: "Unselected statement" }],
        }],
      }],
    }],
  });

  assert.strictEqual(exported.work[0].position, "Canonical title");
  assert.deepStrictEqual(exported.work[0].highlights, ["Canonical statement"]);
}

function testSemanticReferences() {
  const valid = {
    sourceArtifacts: [{ id: "resume" }],
    experience: [{ id: "role", name: "Example" }],
    talkingPoints: [{ id: "point", statement: "Point", supportingItemIds: ["role"] }],
  };
  assert.deepStrictEqual(validateSemantic(valid), []);

  const invalid = {
    talkingPoints: [{ id: "point", statement: "Point", supportingItemIds: ["missing"] }],
  };
  assert.match(validateSemantic(invalid)[0].message, /missing any-id/);

  const child = {
    meta: { parentFileId: "parent-file" },
    talkingPoints: [{ id: "point", statement: "Point", supportingItemIds: ["parent-item"] }],
  };
  assert.deepStrictEqual(validateSemantic(child), []);

  const missingOrganization = {
    experience: [{ id: "role", name: "Example", organizationRef: "missing.example" }],
  };
  assert.match(validateSemantic(missingOrganization)[0].message, /missing organization-key/);
}

function testContextProfile() {
  const repoRoot = path.resolve(__dirname, "../..");
  const script = path.join(repoRoot, "reference/context/ocf-context.js");
  const master = path.join(repoRoot, "spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json");
  const profile = path.join(repoRoot, "reference/context/career-summary.profile.json");
  const build = spawnSync(process.execPath, [script, "build", master, profile], { encoding: "utf8" });
  assert.strictEqual(build.status, 0, build.stderr);

  const view = JSON.parse(build.stdout);
  assert.strictEqual(view.context.format, "ocf-context-view");
  assert.strictEqual(view.context.authoritative, false);
  assert.ok(view.context.omitted.some((item) => item.path.endsWith(".longform") && item.itemId === "mhs-ransomware-2024"));

  const reflectionId = "meridian-health-systems-director-of-cybersecurity-never-on-resume-story-reflection";
  const reflection = findById(view.ocf, reflectionId);
  assert.ok(reflection);
  assert.strictEqual(reflection.text, undefined);

  const get = spawnSync(process.execPath, [script, "get", master, reflectionId], { encoding: "utf8" });
  assert.strictEqual(get.status, 0, get.stderr);
  const retrieved = JSON.parse(get.stdout);
  assert.strictEqual(retrieved.context.format, "ocf-context-item");
  assert.match(retrieved.item.text, /parking garage/);
}

function findById(value, id) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findById(item, id);
      if (match) return match;
    }
    return null;
  }
  if (!value || typeof value !== "object") return null;
  if (value.id === id) return value;
  for (const child of Object.values(value)) {
    const match = findById(child, id);
    if (match) return match;
  }
  return null;
}
