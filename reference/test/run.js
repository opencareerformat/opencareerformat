#!/usr/bin/env node

const assert = require("assert");
const { filterByVisibility } = require("../lib/visibility");
const { toJsonResume } = require("../exporters/json-resume");
const { validateSemantic } = require("../validator/semantic");

testPrivateDefaults();
testCanonicalVariantExport();
testSemanticReferences();
console.log("reference behavior tests: PASS");

function testPrivateDefaults() {
  const filtered = filterByVisibility({
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
        achievements: [{ id: "achievement", statement: "Shared by schema default" }],
      }],
    }],
  });

  assert.deepStrictEqual(filtered.person.contacts, []);
  assert.deepStrictEqual(filtered.sourceArtifacts, []);
  assert.deepStrictEqual(filtered.talkingPoints, []);
  assert.strictEqual(filtered.experience[0].positions[0].achievements[0].statement, "Shared by schema default");
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
