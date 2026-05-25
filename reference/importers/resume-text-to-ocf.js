#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function importResumeText(text, sourceFileName = "resume.txt") {
  const sections = splitSections(text);
  const header = sections.__header || [];
  const now = new Date().toISOString().slice(0, 10);
  const sourceArtifactId = `source-${slug(path.basename(sourceFileName, path.extname(sourceFileName))) || "resume"}`;

  const doc = {
    $schema: "https://opencareerformat.org/v0.2/schema.json",
    schemaVersion: "0.2",
    meta: {
      id: crypto.randomUUID(),
      version: `imported-${now}`,
      canonical: false,
      fileRole: "imported-starter",
      lastModified: now,
      language: "en-US",
      source: { kind: "imported" },
    },
    sourceArtifacts: [
      {
        id: sourceArtifactId,
        kind: "resume",
        label: path.basename(sourceFileName),
        capturedDate: parseIsoDate(now),
        fileName: path.basename(sourceFileName),
        rawIncluded: false,
        visibility: "private",
      },
    ],
    person: parsePerson(header),
    skills: parseSkills(sections.SKILLS || [], sourceArtifactId),
    experience: parseExperience(sections.EXPERIENCE || [], sourceArtifactId),
    education: parseEducation(sections.EDUCATION || [], sourceArtifactId),
    certifications: parseCertifications(sections.CERTIFICATIONS || [], sourceArtifactId),
    openQuestions: [
      {
        question: "Review imported dates, titles, metrics, and claims before treating this draft as the master OCF.",
        context: "This proof-of-concept importer creates a skeleton from resume text and cannot verify facts.",
        visibility: "private",
        provenance: provenance(sourceArtifactId, "import-warning", 0.4),
      },
    ],
  };

  if (sections.SUMMARY?.length) {
    doc.person.summary = sections.SUMMARY.join(" ").trim();
  }

  return prune(doc);
}

function splitSections(text) {
  const known = new Set(["SUMMARY", "SKILLS", "EXPERIENCE", "EDUCATION", "CERTIFICATIONS"]);
  const sections = { __header: [] };
  let current = "__header";

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (known.has(line.toUpperCase())) {
      current = line.toUpperCase();
      sections[current] = [];
      continue;
    }
    sections[current].push(line);
  }

  return sections;
}

function parsePerson(header) {
  const [name, headline, locationLine, contactLine] = header;
  const contacts = [];

  for (const part of (contactLine || "").split("|").map((item) => item.trim()).filter(Boolean)) {
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(part)) {
      contacts.push({ kind: "email", value: part, primary: true });
    } else if (/linkedin\.com/i.test(part)) {
      contacts.push({ kind: "linkedin", value: part });
    } else if (/github\.com/i.test(part)) {
      contacts.push({ kind: "github", value: part });
    } else if (/^https?:\/\//i.test(part)) {
      contacts.push({ kind: "social", label: inferSocialLabel(part), value: part });
    } else if (/[0-9]/.test(part)) {
      contacts.push({ kind: "phone", value: part });
    }
  }

  return prune({
    name: { renderAs: name || "Unknown Person" },
    headline,
    contacts,
    locations: locationLine ? [parseLocation(locationLine)] : undefined,
  });
}

function parseLocation(line) {
  const parts = line.split(",").map((part) => part.trim());
  return prune({ city: parts[0], region: parts[1], country: parts[2] });
}

function parseSkills(lines, sourceArtifactId) {
  return lines
    .join(" ")
    .split(";")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      visibility: "shared",
    }));
}

function parseExperience(lines, sourceArtifactId) {
  const entries = [];
  let current;
  let currentAchievementLines = [];

  const flushAchievementLines = () => {
    if (!current || !currentAchievementLines.length) return;
    current.positions[0].achievements = currentAchievementLines.map((statement) => ({
      id: slug(`${current.name}-${current.positions[0].title}-${statement}`).slice(0, 80),
      statement: stripBullet(statement),
      kind: "accomplishment",
      visibility: "shared",
      provenance: provenance(sourceArtifactId, "imported-achievement", 0.7),
    }));
    currentAchievementLines = [];
  };

  for (const line of lines) {
    if (line.includes("|")) {
      flushAchievementLines();
      const [organization, title, dateText] = line.split("|").map((part) => part.trim());
      current = {
        id: slug(`${organization}-${dateText}`),
        kind: "employment",
        name: organization,
        dateRange: parseDateRange(dateText),
        positions: [
          {
            id: slug(`${organization}-${title}-${dateText}`),
            title,
            dateRange: parseDateRange(dateText),
            visibility: "shared",
            achievements: [],
            provenance: provenance(sourceArtifactId, "imported-position", 0.7),
          },
        ],
        visibility: "shared",
        provenance: provenance(sourceArtifactId, "imported-experience-entry", 0.7),
      };
      entries.push(current);
    } else if (line.startsWith("-")) {
      currentAchievementLines.push(line);
    } else if (current) {
      current.positions[0].summary = [current.positions[0].summary, line].filter(Boolean).join(" ");
    }
  }
  flushAchievementLines();

  return entries;
}

function parseEducation(lines, sourceArtifactId) {
  return lines
    .filter((line) => line.includes("|"))
    .map((line) => {
      const [institution, degree, field, dateText] = line.split("|").map((part) => part.trim());
      return prune({
        institution,
        degree,
        field,
        dateRange: parseDateRange(dateText),
        visibility: "shared",
      });
    });
}

function parseCertifications(lines, sourceArtifactId) {
  return lines
    .filter((line) => line.includes("|"))
    .map((line) => {
      const [name, issuer] = line.split("|").map((part) => part.trim());
      return prune({
        name,
        issuer,
        visibility: "shared",
      });
    });
}

function parseDateRange(text = "") {
  const [startText, endText] = text.split(/\s+-\s+/).map((part) => part.trim());
  return prune({
    start: parsePartialDate(startText) || {},
    end: /present/i.test(endText || "") ? { present: true } : parsePartialDate(endText),
  });
}

function parsePartialDate(text = "") {
  const match = text.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!match) return undefined;
  return prune({
    year: Number(match[1]),
    month: match[2] ? Number(match[2]) : undefined,
    day: match[3] ? Number(match[3]) : undefined,
  });
}

function parseIsoDate(text) {
  const [year, month, day] = text.split("-").map(Number);
  return { year, month, day };
}

function stripBullet(line) {
  return line.replace(/^-\s*/, "").replace(/\.$/, "");
}

function inferSocialLabel(url) {
  if (/bsky\.app/i.test(url)) return "Bluesky";
  if (/mastodon|hachyderm|fosstodon/i.test(url)) return "Mastodon";
  if (/x\.com|twitter\.com/i.test(url)) return "X/Twitter";
  return "Social";
}

function provenance(sourceArtifactId, operation, confidence) {
  return {
    source: "imported",
    tool: "reference/importers/resume-text-to-ocf.js",
    date: new Date().toISOString().slice(0, 10),
    sourceArtifactId,
    operation,
    confidence,
  };
}

function slug(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    console.error("Usage: node reference/importers/resume-text-to-ocf.js <resume.txt> <draft.ocf.json>");
    process.exit(2);
  }

  const text = fs.readFileSync(inputPath, "utf8");
  const doc = importResumeText(text, inputPath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(doc, null, 2)}\n`);
  printImportSummary(doc, outputPath);
}

function printImportSummary(doc, outputPath) {
  const positions = (doc.experience || []).reduce((count, entry) => count + (entry.positions || []).length, 0);
  const achievements = (doc.experience || []).reduce((count, entry) => {
    return count + (entry.positions || []).reduce((inner, position) => inner + (position.achievements || []).length, 0);
  }, 0);

  console.error("OCF reference importer summary");
  console.error("This is a bare-bones proof-of-concept importer, not a production resume parser.");
  console.error(`Wrote imported starter: ${outputPath}`);
  console.error(`Source artifacts: ${(doc.sourceArtifacts || []).length}`);
  console.error(`Experience entries: ${(doc.experience || []).length}`);
  console.error(`Positions: ${positions}`);
  console.error(`Achievements: ${achievements}`);
  console.error(`Skills: ${(doc.skills || []).length}`);
  console.error(`Education entries: ${(doc.education || []).length}`);
  console.error(`Certifications: ${(doc.certifications || []).length}`);
  console.error(`Open questions: ${(doc.openQuestions || []).length}`);
  console.error("Review and validate this file before treating any imported claim as durable career memory.");
}

if (require.main === module) {
  main();
}

module.exports = { importResumeText };
