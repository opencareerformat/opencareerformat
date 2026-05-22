#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function curateForJob(doc, jobText) {
  if (!doc.meta?.id) {
    throw new Error("Cannot derive OCF: input master is missing meta.id.");
  }

  const terms = importantTerms(jobText);
  const now = new Date().toISOString().slice(0, 10);
  const selectedExperience = selectExperience(doc, terms);
  const selectedSkills = scoreItems(doc.skills || [], terms, (skill) => [skill.name, skill.category, ...(skill.audiences || [])].join(" "))
    .slice(0, 10)
    .map(({ item }) => item);
  const selectedCertifications = scoreItems(doc.certifications || [], terms, (cert) => [cert.name, issuerName(cert.issuer)].join(" "))
    .slice(0, 6)
    .map(({ item }) => item);

  return withoutPrivate(prune({
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
      derivationNotes: "Proof-of-concept curator: keyword scored the target context, removed private items, and kept a small subset of matching experience, skills, and certifications. This derived OCF is intentionally incomplete and should not overwrite the master.",
    },
    person: withoutPrivate(doc.person),
    experience: selectedExperience,
    skills: selectedSkills,
    certifications: selectedCertifications,
    education: withoutPrivate(doc.education),
    projects: withoutPrivate(doc.projects),
    publications: withoutPrivate(doc.publications),
    patents: withoutPrivate(doc.patents),
    speaking: withoutPrivate(doc.speaking),
    teaching: withoutPrivate(doc.teaching),
    governance: withoutPrivate(doc.governance),
    memberships: withoutPrivate(doc.memberships),
    service: withoutPrivate(doc.service),
    awards: withoutPrivate(doc.awards),
    languages: withoutPrivate(doc.languages),
    interests: withoutPrivate(doc.interests),
    funding: withoutPrivate(doc.funding),
  }));
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
          ...withoutPrivate(position),
          achievements: scoreItems(position.achievements || [], terms, (achievement) => {
            return [achievement.statement, achievement.longform, ...(achievement.audiences || [])].join(" ");
          })
            .slice(0, 4)
            .map(({ item }) => withoutPrivate(item)),
        }));

      return {
        ...withoutPrivate(entry),
        positions,
        spanning: undefined,
        reflections: undefined,
      };
    });
}

function scoreItems(items, terms, textForItem) {
  return items
    .filter((item) => item && item.visibility !== "private")
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

function withoutPrivate(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => item?.visibility !== "private").map(withoutPrivate);
  }
  if (value && typeof value === "object") {
    if (value.visibility === "private") return undefined;
    return prune(Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withoutPrivate(item)])));
  }
  return value;
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
  const [, , inputPath, jobPath, outputPath] = process.argv;
  if (!inputPath || !jobPath || !outputPath) {
    console.error("Usage: node reference/curators/job-description.js <master.ocf.json> <job-description.txt> <derived.ocf.json>");
    process.exit(2);
  }

  const doc = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const jobText = fs.readFileSync(jobPath, "utf8");
  const derived = curateForJob(doc, jobText);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(derived, null, 2)}\n`);
}

if (require.main === module) {
  main();
}

module.exports = { curateForJob };
