#!/usr/bin/env node

const {
  collectAchievements,
  contactProfiles,
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
    image: person.photoVisibility === "public" ? person.photo : undefined,
    email: firstPrimaryOrVisible(person.contacts, "email") || person.email,
    phone: firstPrimaryOrVisible(person.contacts, "phone") || person.phone,
    url: person.website,
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
        startDate: formatPartialDate(position.dateRange?.start || entry.dateRange?.start),
        endDate: position.dateRange?.end?.present || entry.dateRange?.end?.present
          ? undefined
          : formatPartialDate(position.dateRange?.end || entry.dateRange?.end),
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
    startDate: formatPartialDate(item.dateRange?.start),
    endDate: formatPartialDate(item.dateRange?.end),
    score: item.gpa,
    courses: item.notableCourses,
  }));

  const certificates = visibleItems(doc.certifications).map((item) => ({
    name: item.name,
    date: formatPartialDate(item.dateRange?.start),
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
    startDate: formatPartialDate(item.dateRange?.start),
    endDate: formatPartialDate(item.dateRange?.end),
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
}

if (require.main === module) {
  main();
}

module.exports = { toJsonResume };
