#!/usr/bin/env node

const {
  collectAchievements,
  contactProfiles,
  dateRangeEnd,
  dateRangeStart,
  firstPrimaryOrVisible,
  formatPartialDate,
  organizationName,
  organizationUrl,
  personLocation,
  readOcf,
  selectedTitle,
  visibleItems,
  writeOutput,
} = require("./lib/ocf");

function toJsonResume(doc) {
  const person = doc.person || {};
  const basics = {
    name: person.name?.renderAs,
    label: person.headline,
    image: person.photo?.visibility === "public" ? person.photo.uri : undefined,
    email: firstPrimaryOrVisible(person.contacts, "email"),
    phone: firstPrimaryOrVisible(person.contacts, "phone"),
    url: firstPrimaryOrVisible(person.contacts, "url"),
    summary: person.summary,
    location: personLocation(person),
    profiles: contactProfiles(person),
  };

  const work = [];
  for (const entry of visibleItems(doc.experience)) {
    const parentName = organizationName(doc, entry);
    const parentUrl = organizationUrl(doc, entry);
    for (const position of visibleItems(entry.positions)) {
      work.push({
        name: parentName,
        position: selectedTitle(position),
        url: position.url || parentUrl,
        startDate: dateRangeStart(position.dateRange, entry.dateRange),
        endDate: dateRangeEnd(position.dateRange, entry.dateRange),
        summary: position.summary || entry.description,
        highlights: collectAchievements(position),
      });
    }
  }

  const education = visibleItems(doc.education).map((item) => ({
    institution: item.institution,
    url: item.url,
    area: item.field,
    studyType: item.degree,
    startDate: dateRangeStart(item.dateRange),
    endDate: dateRangeEnd(item.dateRange),
    score: item.gpa,
    courses: item.notableCourses,
  }));

  const certificates = visibleItems(doc.certifications).map((item) => ({
    name: item.name,
    date: dateRangeStart(item.dateRange),
    issuer: typeof item.issuer === "string" ? item.issuer : item.issuer?.name,
    url: item.url,
  }));

  const skills = visibleItems(doc.skills).map((item) => ({
    name: item.name,
    level: item.proficiency,
    keywords: [item.category, ...(item.aliases || [])].filter(Boolean),
  }));

  const projects = visibleItems(doc.projects).map((item) => ({
    name: item.name,
    description: item.description,
    highlights: collectAchievements(item),
    keywords: item.audiences,
    startDate: dateRangeStart(item.dateRange),
    endDate: dateRangeEnd(item.dateRange),
    url: item.links?.find((link) => link.url)?.url,
    roles: item.role ? [item.role] : undefined,
    entity: item.client,
  }));

  const publications = visibleItems(doc.publications).map((item) => ({
    name: item.title,
    publisher: item.publisher || item.venue,
    releaseDate: formatPartialDate(item.date),
    url: item.url,
    summary: item.abstract,
  }));

  const awards = visibleItems(doc.awards).map((item) => ({
    title: item.title,
    date: formatPartialDate(item.date),
    awarder: item.awarder,
    summary: item.summary || item.description,
  }));

  const languages = visibleItems(doc.languages).map((item) => ({
    language: item.language,
    fluency: item.proficiency,
  }));

  const interests = visibleItems(doc.interests).map((item) => ({
    name: item.name,
    keywords: item.keywords,
  }));

  return prune({
    basics,
    work,
    education,
    certificates,
    skills,
    projects,
    publications,
    awards,
    languages,
    interests,
  });
}

function prune(value) {
  if (Array.isArray(value)) {
    return value.map(prune).filter((item) => {
      if (item == null) return false;
      if (Array.isArray(item)) return item.length > 0;
      if (typeof item === "object") return Object.keys(item).length > 0;
      return true;
    });
  }
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
  if (!inputPath) {
    console.error("Usage: node reference/exporters/json-resume.js <ocf.json> [output.json]");
    process.exit(2);
  }

  const doc = readOcf(inputPath);
  const exported = toJsonResume(doc);
  writeOutput(outputPath, `${JSON.stringify(exported, null, 2)}\n`);
  printExportSummary(doc, exported, outputPath || "stdout");
}

function printExportSummary(doc, exported, outputPath) {
  const workHighlights = (exported.work || []).reduce((count, item) => count + (item.highlights || []).length, 0);
  console.error("OCF reference JSON Resume exporter summary");
  console.error("This is a bare-bones proof-of-concept exporter, not a production resume renderer.");
  console.error(`Wrote JSON Resume output: ${outputPath}`);
  console.error(`Work entries exported: ${(exported.work || []).length}`);
  console.error(`Work highlights exported: ${workHighlights}`);
  console.error(`Skills exported: ${(exported.skills || []).length}`);
  console.error(`Projects exported: ${(exported.projects || []).length}`);
  console.error(`Private OCF items are not exported by this reference tool.`);
  if (doc.meta?.fileRole !== "export-ready") {
    console.error(`Input fileRole is ${doc.meta?.fileRole || "unspecified"}; review curation before treating this as final output.`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { toJsonResume };
