#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { filterByVisibility, resolvedVisibility } = require("../lib/visibility");

const CURRENT_SCHEMA = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../spec/schema.json"), "utf8"));
const CURRENT_SCHEMA_VERSION = CURRENT_SCHEMA.properties?.schemaVersion?.const;

function curateForJob(doc, jobText, options = {}) {
  if (!doc.meta?.id) {
    throw new Error("Cannot curate OCF: input master is missing meta.id.");
  }

  const sourceMeta = doc.meta;
  const visibilityMode = options.visibilityMode || "shared";
  // The curated child carries parent lineage, so opaque references may still
  // resolve in the parent even when the referenced private item is not copied.
  doc = filterByVisibility(doc, visibilityMode, { preserveFilteredReferences: true });
  const terms = importantTerms(jobText);
  const now = new Date().toISOString().slice(0, 10);
  const selectedExperience = selectExperience(doc, terms);
  const selectedSkills = scoreItems(doc.skills || [], terms, (skill) => [skill.name, skill.category, ...(skill.audiences || [])].join(" "))
    .slice(0, 10)
    .map(({ item }) => item);
  const selectedCertifications = scoreItems(doc.certifications || [], terms, (cert) => [cert.name, issuerName(cert.issuer)].join(" "))
    .slice(0, 6)
    .map(({ item }) => item);
  const visibilityNote = visibilityMode === "public" ? "removed private and shared items" : "removed private items";

  const curated = prune({
    $schema: doc.$schema,
    schemaVersion: doc.schemaVersion,
    meta: {
      id: crypto.randomUUID(),
      version: `curated-${now}`,
      fileRole: "candidate-curated",
      targetRole: options.targetRole,
      targetCompany: options.targetCompany,
      lastModified: now,
      language: sourceMeta.language,
      source: {
        kind: "authored",
      },
      parentFileId: sourceMeta.id,
      parentVersion: sourceMeta.version,
      lineageNotes: `Proof-of-concept curator: keyword scored the target context, ${visibilityNote}, and kept a small subset of matching experience, skills, and certifications. This curated OCF is intentionally incomplete and should not overwrite the master.`,
    },
    person: doc.person,
    experience: selectedExperience,
    skills: selectedSkills,
    certifications: selectedCertifications,
    education: doc.education,
    projects: doc.projects,
    publications: doc.publications,
    patents: doc.patents,
    speaking: doc.speaking,
    teaching: doc.teaching,
    governance: doc.governance,
    memberships: doc.memberships,
    service: doc.service,
    awards: doc.awards,
    languages: doc.languages,
    interests: doc.interests,
  });

  const organizations = referencedOrganizations(doc.organizations, curated);
  if (Object.keys(organizations).length) curated.organizations = organizations;

  return curated;
}

function referencedOrganizations(registry = {}, document) {
  const refs = new Set();
  collectOrganizationRefs(document, refs);
  return Object.fromEntries([...refs].filter((ref) => registry[ref]).map((ref) => [ref, registry[ref]]));
}

function collectOrganizationRefs(value, refs) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectOrganizationRefs(item, refs));
    return;
  }
  if (!value || typeof value !== "object") return;
  if (typeof value.organizationRef === "string") refs.add(value.organizationRef);
  Object.values(value).forEach((item) => collectOrganizationRefs(item, refs));
}

function selectExperience(doc, terms) {
  return scoreItems(doc.experience || [], terms, (entry) => {
    return [
      entry.name,
      entry.kind,
      entry.description,
      ...(entry.positions || []).flatMap((position) => [
        position.title,
        position.summary,
        ...(position.audiences || []),
        ...(position.achievements || []).map((achievement) => achievement.statement),
      ]),
    ].join(" ");
  })
    .slice(0, 3)
    .map(({ item: entry }) => {
      const positions = scoreItems(entry.positions || [], terms, (position) => {
        return [
          position.title,
          position.summary,
          ...(position.audiences || []),
          ...(position.achievements || []).map((achievement) => achievement.statement),
        ].join(" ");
      })
        .slice(0, 2)
        .map(({ item: position }) => ({
          ...position,
          achievements: scoreItems(position.achievements || [], terms, (achievement) => {
            return [achievement.statement, achievement.longform, ...(achievement.audiences || [])].join(" ");
          })
            .slice(0, 4)
            .map(({ item }) => item),
        }));

      return {
        ...entry,
        positions,
        spanning: undefined,
        reflections: undefined,
      };
    });
}

function scoreItems(items, terms, textForItem) {
  return items
    .filter(Boolean)
    .map((item) => {
      const haystack = normalize(textForItem(item));
      const termScore = terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
      const importance = typeof item.importance === "number" ? item.importance / 10 : 0;
      return { item, score: termScore + importance };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
}

function importantTerms(text) {
  const stop = new Set([
    "and",
    "are",
    "for",
    "from",
    "have",
    "into",
    "our",
    "such",
    "that",
    "the",
    "this",
    "with",
    "you",
    "your",
  ]);
  return [...new Set(normalize(text).split(/\s+/).filter((term) => term.length > 2 && !stop.has(term)))];
}

function countCollection(doc, key) {
  return Array.isArray(doc?.[key]) ? doc[key].length : 0;
}

function countPositions(doc) {
  return (doc.experience || []).reduce((count, entry) => count + (entry.positions || []).length, 0);
}

function countAchievements(doc) {
  return (doc.experience || []).reduce((count, entry) => {
    return count + (entry.positions || []).reduce((inner, position) => inner + (position.achievements || []).length, 0);
  }, 0);
}

function countExcludedVisibilityBranches(value, mode, segments = []) {
  if (Array.isArray(value)) {
    return value.reduce((counts, item) => addBranchCounts(
      counts,
      countExcludedVisibilityBranches(item, mode, [...segments, "*"]),
    ), emptyBranchCounts());
  }
  if (value && typeof value === "object") {
    const visibility = resolvedVisibility(value, segments);
    if (visibility === "private") return { private: 1, shared: 0 };
    if (mode === "public" && visibility === "shared") return { private: 0, shared: 1 };
    return Object.entries(value).reduce(
      (counts, [key, item]) => addBranchCounts(
        counts,
        countExcludedVisibilityBranches(item, mode, [...segments, key]),
      ),
      emptyBranchCounts(),
    );
  }
  return emptyBranchCounts();
}

function emptyBranchCounts() {
  return { private: 0, shared: 0 };
}

function addBranchCounts(left, right) {
  return {
    private: left.private + right.private,
    shared: left.shared + right.shared,
  };
}

function summarizeCuration(source, curated, visibilityMode) {
  const excluded = countExcludedVisibilityBranches(source, visibilityMode);
  return {
    visibilityMode,
    privateBranchesExcluded: excluded.private,
    sharedBranchesExcluded: excluded.shared,
    sourceExperienceEntries: countCollection(source, "experience"),
    keptExperienceEntries: countCollection(curated, "experience"),
    sourcePositions: countPositions(source),
    keptPositions: countPositions(curated),
    sourceAchievements: countAchievements(source),
    keptAchievements: countAchievements(curated),
    keptSkills: countCollection(curated, "skills"),
    keptCertifications: countCollection(curated, "certifications"),
  };
}

function printCurationSummary(summary, outputPath) {
  console.error("OCF reference curator summary");
  console.error("This is a bare-bones proof-of-concept curator, not a production relevance engine.");
  console.error(`Tested against the current OCF examples (schemaVersion ${CURRENT_SCHEMA_VERSION}); output preserves the input schemaVersion.`);
  console.error(`Wrote curated OCF: ${outputPath}`);
  console.error(`Visibility mode: ${summary.visibilityMode}`);
  console.error(`Private branches excluded: ${summary.privateBranchesExcluded}`);
  if (summary.visibilityMode === "public") console.error(`Shared branches excluded: ${summary.sharedBranchesExcluded}`);
  console.error(`Experience entries kept: ${summary.keptExperienceEntries}/${summary.sourceExperienceEntries}`);
  console.error(`Positions kept: ${summary.keptPositions}/${summary.sourcePositions}`);
  console.error(`Achievements kept: ${summary.keptAchievements}/${summary.sourceAchievements}`);
  console.error(`Skills kept: ${summary.keptSkills}`);
  console.error(`Certifications kept: ${summary.keptCertifications}`);
  console.error("Review the curated file before using it as export-ready input.");
}

function issuerName(issuer) {
  if (!issuer) return "";
  return typeof issuer === "string" ? issuer : issuer.name;
}

function normalize(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function prune(value) {
  if (Array.isArray(value)) return value.map(prune).filter((item) => item != null);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, prune(item)])
        .filter(([, item]) => {
          if (item == null || item === "") return false;
          if (Array.isArray(item)) return item.length > 0;
          if (typeof item === "object") return Object.keys(item).length > 0;
          return true;
        })
    );
  }
  return value;
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    console.error("Usage: node reference/curators/job-description.js [--public-only] <master.ocf.json> <job-description.txt> <curated.ocf.json>");
    process.exit(2);
  }
  const { inputPath, jobPath, outputPath, visibilityMode } = parsed;
  if (!inputPath || !jobPath || !outputPath) {
    console.error("Usage: node reference/curators/job-description.js [--public-only] <master.ocf.json> <job-description.txt> <curated.ocf.json>");
    process.exit(2);
  }

  const doc = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const jobText = fs.readFileSync(jobPath, "utf8");
  const curated = curateForJob(doc, jobText, { visibilityMode });
  const summary = summarizeCuration(doc, curated, visibilityMode);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(curated, null, 2)}\n`);
  printCurationSummary(summary, outputPath);
}

function parseArgs(args) {
  let visibilityMode = "shared";
  const paths = [];

  for (const arg of args) {
    if (arg === "--public-only") {
      visibilityMode = "public";
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      paths.push(arg);
    }
  }

  const [inputPath, jobPath, outputPath] = paths;
  return { inputPath, jobPath, outputPath, visibilityMode };
}

if (require.main === module) {
  main();
}

module.exports = { curateForJob, summarizeCuration, parseArgs };
