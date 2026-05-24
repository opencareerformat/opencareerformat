#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function curateForJob(doc, jobText, options = {}) {
  if (!doc.meta?.id) {
    throw new Error("Cannot derive OCF: input master is missing meta.id.");
  }

  const visibilityMode = options.visibilityMode || "shared";
  const terms = importantTerms(jobText);
  const now = new Date().toISOString().slice(0, 10);
  const selectedExperience = selectExperience(doc, terms, visibilityMode);
  const selectedSkills = scoreItems(doc.skills || [], terms, (skill) => [skill.name, skill.category, ...(skill.audiences || [])].join(" "), visibilityMode)
    .slice(0, 10)
    .map(({ item }) => item);
  const selectedCertifications = scoreItems(doc.certifications || [], terms, (cert) => [cert.name, issuerName(cert.issuer)].join(" "), visibilityMode)
    .slice(0, 6)
    .map(({ item }) => item);
  const visibilityNote = visibilityMode === "public" ? "removed private and shared items" : "removed private items";

  return filterVisibility(prune({
    $schema: doc.$schema,
    schemaVersion: doc.schemaVersion,
    meta: {
      id: crypto.randomUUID(),
      version: `derived-${now}`,
      canonical: false,
      variant: "role-targeted",
      lastModified: now,
      language: doc.meta?.language,
      source: {
        kind: "derived",
      },
      derivedFrom: doc.meta.id,
      derivationNotes: `Proof-of-concept curator: keyword scored the target context, ${visibilityNote}, and kept a small subset of matching experience, skills, and certifications. This derived OCF is intentionally incomplete and should not overwrite the master.`,
    },
    person: filterVisibility(doc.person, visibilityMode),
    experience: selectedExperience,
    skills: selectedSkills,
    certifications: selectedCertifications,
    education: filterVisibility(doc.education, visibilityMode),
    projects: filterVisibility(doc.projects, visibilityMode),
    publications: filterVisibility(doc.publications, visibilityMode),
    patents: filterVisibility(doc.patents, visibilityMode),
    speaking: filterVisibility(doc.speaking, visibilityMode),
    teaching: filterVisibility(doc.teaching, visibilityMode),
    governance: filterVisibility(doc.governance, visibilityMode),
    memberships: filterVisibility(doc.memberships, visibilityMode),
    service: filterVisibility(doc.service, visibilityMode),
    awards: filterVisibility(doc.awards, visibilityMode),
    languages: filterVisibility(doc.languages, visibilityMode),
    interests: filterVisibility(doc.interests, visibilityMode),
    funding: filterVisibility(doc.funding, visibilityMode),
  }), visibilityMode);
}

function selectExperience(doc, terms, visibilityMode) {
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
  }, visibilityMode)
    .slice(0, 3)
    .map(({ item: entry }) => {
      const positions = scoreItems(entry.positions || [], terms, (position) => {
        return [
          position.title,
          position.summary,
          ...(position.audiences || []),
          ...(position.achievements || []).map((achievement) => achievement.statement),
        ].join(" ");
      }, visibilityMode)
        .slice(0, 2)
        .map(({ item: position }) => ({
          ...filterVisibility(position, visibilityMode),
          achievements: scoreItems(position.achievements || [], terms, (achievement) => {
            return [achievement.statement, achievement.longform, ...(achievement.audiences || [])].join(" ");
          }, visibilityMode)
            .slice(0, 4)
            .map(({ item }) => filterVisibility(item, visibilityMode)),
        }));

      return {
        ...filterVisibility(entry, visibilityMode),
        positions,
        spanning: undefined,
        reflections: undefined,
      };
    });
}

function scoreItems(items, terms, textForItem, visibilityMode = "shared") {
  return items
    .filter((item) => item && isVisibilityAllowed(item, visibilityMode, { defaultShared: true }))
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

function filterVisibility(value, visibilityMode) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => isVisibilityAllowed(item, visibilityMode, { defaultShared: true }))
      .map((item) => filterVisibility(item, visibilityMode));
  }
  if (value && typeof value === "object") {
    if (!isVisibilityAllowed(value, visibilityMode)) return undefined;
    return prune(Object.fromEntries(Object.entries(value).map(([key, item]) => [key, filterVisibility(item, visibilityMode)])));
  }
  return value;
}

function isVisibilityAllowed(item, visibilityMode, options = {}) {
  if (!item || typeof item !== "object") return true;
  const hasVisibility = Object.prototype.hasOwnProperty.call(item, "visibility");
  if (!hasVisibility && !options.defaultShared) return true;
  const visibility = hasVisibility ? item.visibility : "shared";
  if (visibilityMode === "public") return visibility === "public";
  return visibility !== "private";
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
  const { inputPath, jobPath, outputPath, visibilityMode } = parseArgs(process.argv.slice(2));
  if (!inputPath || !jobPath || !outputPath) {
    console.error("Usage: node reference/curators/job-description.js [--public-only] <master.ocf.json> <job-description.txt> <derived.ocf.json>");
    process.exit(2);
  }

  const doc = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const jobText = fs.readFileSync(jobPath, "utf8");
  const derived = curateForJob(doc, jobText, { visibilityMode });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(derived, null, 2)}\n`);
}

function parseArgs(args) {
  let visibilityMode = "shared";
  const paths = [];

  for (const arg of args) {
    if (arg === "--public-only") {
      visibilityMode = "public";
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

module.exports = { curateForJob };
