#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const { spawnSync } = require("child_process");
const path = require("path");
const { filterByVisibility } = require("../lib/visibility");
const { formatDateRange } = require("../exporters/lib/ocf");
const { toJsonResume } = require("../exporters/json-resume");
const { toLinkedInBundle } = require("../exporters/linkedin");
const { importResumeText } = require("../importers/resume-text-to-ocf");
const { buildPrompt } = require("../ollama/ocf-local-llm");
const { curateForJob, summarizeCuration } = require("../curators/job-description");
const { validateSemantic } = require("../validator/semantic");
const validateStandalone = require("../validator/standalone.cjs");

testPrivateDefaults();
testInvalidVisibilityFailsClosed();
testCanonicalVariantExport();
testReferenceToolSmoke();
testDateRangeFormatting();
testImporterSafety();
testOllamaImportMetadata();
testSemanticReferences();
testValidatorCli();
testStandaloneValidator();
testPythonCli();
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

function testInvalidVisibilityFailsClosed() {
  const source = {
    person: {
      name: { renderAs: "Example Person" },
      contacts: [{ kind: "email", value: "private@example.com", visibility: "Private" }],
    },
  };
  assert.deepStrictEqual(filterByVisibility(source).person.contacts, []);
  assert.deepStrictEqual(filterByVisibility(source, "public").person.contacts, []);
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

function testReferenceToolSmoke() {
  const source = {
    schemaVersion: "0.3",
    meta: { id: "master-file", version: "one", fileRole: "candidate-master" },
    person: {
      name: { renderAs: "Example Person" },
      headline: "Security leader",
      contacts: [{ kind: "email", value: "private@example.com" }],
    },
    skills: [{ name: "Incident Response", visibility: "shared" }],
    experience: [{
      id: "example",
      name: "Example Corp",
      positions: [{
        id: "security-leader",
        title: "Security Leader",
        achievements: [{ id: "response", statement: "Improved incident response", visibility: "shared" }],
      }],
    }],
  };
  const curated = curateForJob(source, "security incident response");
  assert.strictEqual(curated.meta.fileRole, "candidate-curated");
  assert.strictEqual(curated.experience[0].positions[0].achievements[0].id, "response");
  assert.strictEqual(summarizeCuration(source, curated, "shared").privateItemsRemoved, 1);
  assert.match(toLinkedInBundle(source), /# LinkedIn Paste Bundle/);
}

function testDateRangeFormatting() {
  assert.strictEqual(formatDateRange({ start: { year: 2020 } }), "2020");
  assert.strictEqual(formatDateRange({ start: { year: 2020 }, end: { present: true } }), "2020 - Present");
  assert.strictEqual(formatDateRange({ start: { year: 2020 }, end: { year: 2024 } }), "2020 - 2024");
}

function testImporterSafety() {
  const text = [
    "Example Person",
    "Example Headline",
    "Example City, ST, US",
    "https://example.social/profile",
    "EXPERIENCE",
    "- Orphan bullet",
    "Example Corp | Engineer | 2020 - 2024",
    "- Role achievement",
    "- Role achievement",
  ].join("\n");
  const originalError = console.error;
  const warnings = [];
  console.error = (message) => warnings.push(message);
  let imported;
  try {
    imported = importResumeText(text, "example-resume.txt");
  } finally {
    console.error = originalError;
  }

  assert.strictEqual(imported.person.contacts[0].visibility, "shared");
  assert.deepStrictEqual(
    imported.experience[0].positions[0].achievements.map((item) => item.statement),
    ["Role achievement", "Role achievement"],
  );
  const achievementIds = imported.experience[0].positions[0].achievements.map((item) => item.id);
  assert.strictEqual(new Set(achievementIds).size, 2);
  assert.deepStrictEqual(validateSemantic(imported), []);
  assert.match(warnings[0], /Skipped 1 bullet/);
}

function testOllamaImportMetadata() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ocf-ollama-test-"));
  const resumePath = path.join(tempDir, "current-resume.txt");
  try {
    fs.writeFileSync(resumePath, "Example Person\n");
    const prompt = buildPrompt({
      mode: "authoring",
      output: "provisional-master",
      resume: resumePath,
    });
    assert.match(prompt, /current-resume\.txt/);
    assert.match(prompt, new RegExp(new Date().toISOString().slice(0, 10)));
    assert.doesNotMatch(prompt, /2026-05-28/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
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

  const cycle = {
    talkingPoints: [
      { id: "one", statement: "One", supersededById: "two" },
      { id: "two", statement: "Two", supersededById: "one" },
    ],
  };
  assert.strictEqual(validateSemantic(cycle).filter((item) => /supersession cycle/.test(item.message)).length, 1);

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

function testValidatorCli() {
  const repoRoot = path.resolve(__dirname, "../..");
  const validator = path.join(repoRoot, "reference/validator/validate.js");
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ocf-validator-test-"));
  const malformedPath = path.join(tempDir, "malformed.json");
  const validPath = path.join(tempDir, "valid.json");
  const unknownPath = path.join(tempDir, "unknown-and-dangling.json");

  try {
    fs.writeFileSync(malformedPath, "{not json\n");
    fs.writeFileSync(validPath, JSON.stringify({
      $schema: "https://opencareerformat.org/v0.3/schema.json",
      schemaVersion: "0.3",
      person: { name: { renderAs: "Example Person" } },
    }));
    fs.writeFileSync(unknownPath, JSON.stringify({
      $schema: "https://opencareerformat.org/v0.3/schema.json",
      schemaVersion: "0.3",
      person: { name: { renderAs: "Example Person" } },
      talkingPoints: [{ id: "point", statement: "Point", supportingItemIds: ["missing"] }],
      futureField: true,
    }));

    const batch = spawnSync(process.execPath, [validator, malformedPath, validPath], { encoding: "utf8" });
    assert.strictEqual(batch.status, 1, batch.stderr);
    assert.match(batch.stdout, /malformed\.json: FAIL/);
    assert.match(batch.stdout, /valid\.json: PASS/);
    assert.doesNotMatch(batch.stderr, /SyntaxError/);

    const warnUnknown = spawnSync(
      process.execPath,
      [validator, "--warn-unknown", unknownPath],
      { encoding: "utf8" },
    );
    assert.strictEqual(warnUnknown.status, 1, warnUnknown.stderr);
    assert.match(warnUnknown.stdout, /Unknown-property warnings/);
    assert.match(warnUnknown.stdout, /missing any-id/);

    const filter = path.join(repoRoot, "reference/cli/filter-private.js");
    const refused = spawnSync(process.execPath, [filter, unknownPath], { encoding: "utf8" });
    assert.strictEqual(refused.status, 1, refused.stderr);
    assert.match(refused.stderr, /Refusing to filter/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function testStandaloneValidator() {
  const repoRoot = path.resolve(__dirname, "../..");
  const examples = [
    "spec/examples/maria-reyes/maria-reyes-revision-6.ocf.json",
    "spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json",
  ];
  for (const example of examples) {
    const document = JSON.parse(fs.readFileSync(path.join(repoRoot, example), "utf8"));
    assert.strictEqual(validateStandalone(document), true, JSON.stringify(validateStandalone.errors));
  }

  const invalidCases = [
    { schemaVersion: "0.3", person: {} },
    { schemaVersion: "0.3", person: { name: { renderAs: "Example" } }, futureField: true },
    { schemaVersion: "0.3", person: { name: { renderAs: "Example" } }, meta: { lastModified: "2026-02-30" } },
    { schemaVersion: "0.3", person: { name: { renderAs: "Example" }, photo: { value: "not a URI" } } },
  ];
  for (const document of invalidCases) {
    assert.strictEqual(validateStandalone(document), false, JSON.stringify(document));
    assert.ok(validateStandalone.errors.length > 0);
  }
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

function testPythonCli() {
  const repoRoot = path.resolve(__dirname, "../..");
  const script = path.join(repoRoot, "reference/cli/ocf.py");
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ocf-python-cli-test-"));
  const fixture = path.join(tempDir, "fixture.ocf.json");
  const environment = { ...process.env, NODE: process.execPath };

  try {
    fs.writeFileSync(fixture, JSON.stringify({
      $schema: "https://opencareerformat.org/v0.3/schema.json",
      schemaVersion: "0.3",
      meta: { id: "python-cli-fixture", fileRole: "candidate-master" },
      person: {
        name: { renderAs: "Example Person" },
        contacts: [{ kind: "email", value: "private@example.com" }],
      },
    }));

    const summary = spawnSync("python3", [script, fixture], { encoding: "utf8", env: environment });
    assert.strictEqual(summary.status, 0, summary.error?.message || summary.stderr);
    assert.match(summary.stdout, /name: Example Person/);

    const validation = spawnSync("python3", [script, "validate", fixture], { encoding: "utf8", env: environment });
    assert.strictEqual(validation.status, 0, validation.error?.message || validation.stderr);
    assert.match(validation.stdout, /PASS/);

    const filter = spawnSync("python3", [script, "--filter", "private", fixture], { encoding: "utf8", env: environment });
    assert.strictEqual(filter.status, 0, filter.error?.message || filter.stderr);
    const filtered = JSON.parse(filter.stdout);
    assert.deepStrictEqual(filtered.person.contacts, []);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
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
