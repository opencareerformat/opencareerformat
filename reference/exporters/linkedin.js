#!/usr/bin/env node

const {
  collectAchievements,
  countUnresolvedVariants,
  contactProfiles,
  dateRangeStart,
  firstPrimaryOrVisible,
  formatDateRange,
  formatPartialDate,
  organizationName,
  organizationUrl,
  readOcf,
  selectedTitle,
  visibleItems,
  writeOutput,
  filterByVisibility,
} = require("./lib/ocf");

function toLinkedInBundle(doc) {
  doc = filterByVisibility(doc, "shared");
  const person = doc.person || {};
  const lines = [];

  lines.push("# LinkedIn Paste Bundle");
  lines.push("");
  lines.push("> Review every word before pasting. This is an output draft, not the master OCF.");
  lines.push("");

  addSection(lines, "Headline", [person.headline]);
  addSection(lines, "About", [person.summary]);

  const contactLines = [];
  const email = firstPrimaryOrVisible(person.contacts, "email");
  const phone = firstPrimaryOrVisible(person.contacts, "phone");
  const website = firstPrimaryOrVisible(person.contacts, "url");
  if (email) contactLines.push(`Email: ${email}`);
  if (phone) contactLines.push(`Phone: ${phone}`);
  if (website) contactLines.push(`Website: ${website}`);
  for (const profile of contactProfiles(person)) {
    contactLines.push(`${profile.network}: ${profile.url}`);
  }
  addSection(lines, "Contact Info / Websites", contactLines);

  const experienceLines = [];
  for (const entry of visibleItems(doc.experience)) {
    const org = organizationName(doc, entry);
    const orgUrl = organizationUrl(doc, entry);
    for (const position of visibleItems(entry.positions)) {
      experienceLines.push(`### ${selectedTitle(position)}`);
      experienceLines.push(orgUrl ? `${org} (${orgUrl})` : org);
      const dates = formatDateRange(position.dateRange || entry.dateRange);
      if (dates) experienceLines.push(dates);
      if (position.summary) {
        experienceLines.push("");
        experienceLines.push(position.summary);
      }
      const achievements = collectAchievements(position);
      if (achievements.length) {
        experienceLines.push("");
        for (const item of achievements) {
          experienceLines.push(`- ${item}`);
        }
      }
      experienceLines.push("");
    }
  }
  addSection(lines, "Experience", experienceLines);

  const educationLines = visibleItems(doc.education).map((item) => {
    const dates = formatDateRange(item.dateRange);
    return [item.degree, item.field, item.institution, dates].filter(Boolean).join(" | ");
  });
  addSection(lines, "Education", educationLines);

  const certificationLines = visibleItems(doc.certifications).map((item) => {
    const issuer = typeof item.issuer === "string" ? item.issuer : item.issuer?.name;
    const issued = dateRangeStart(item.dateRange);
    return [item.name, issuer, issued, item.url].filter(Boolean).join(" | ");
  });
  addSection(lines, "Licenses & Certifications", certificationLines);

  const skillLines = visibleItems(doc.skills).map((item) => item.name).filter(Boolean);
  addSection(lines, "Skills", skillLines);

  const projectLines = visibleItems(doc.projects).map((item) => {
    const bits = [item.name, item.role, item.client].filter(Boolean).join(" | ");
    return item.description ? `${bits}\n${item.description}` : bits;
  });
  addSection(lines, "Projects", projectLines);

  const publicationLines = visibleItems(doc.publications).map((item) => {
    const date = formatPartialDate(item.date);
    return [item.title, item.publisher || item.venue, date, item.url].filter(Boolean).join(" | ");
  });
  addSection(lines, "Publications", publicationLines);

  const awardLines = visibleItems(doc.awards).map((item) => {
    const date = formatPartialDate(item.date);
    return [item.title, item.awarder, date].filter(Boolean).join(" | ");
  });
  addSection(lines, "Honors & Awards", awardLines);

  const languageLines = visibleItems(doc.languages).map((item) => {
    return [item.language, item.proficiency].filter(Boolean).join(" | ");
  });
  addSection(lines, "Languages", languageLines);

  const serviceLines = visibleItems(doc.service).map((item) => {
    return [item.organization, item.role, formatDateRange(item.dateRange)].filter(Boolean).join(" | ");
  });
  addSection(lines, "Volunteer Experience", serviceLines);

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function addSection(lines, title, content) {
  const clean = (content || []).filter(Boolean);
  if (!clean.length) return;
  lines.push(`## ${title}`);
  lines.push("");
  for (const item of clean) {
    lines.push(item);
    lines.push("");
  }
}

function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath) {
    console.error("Usage: node reference/exporters/linkedin.js <ocf.json> [output.md]");
    process.exit(2);
  }

  const doc = readOcf(inputPath);
  const bundle = toLinkedInBundle(doc);
  writeOutput(outputPath, bundle);
  printExportSummary(doc, bundle, outputPath || "stdout");
}

function printExportSummary(doc, bundle, outputPath) {
  const sectionCount = (bundle.match(/^## /gm) || []).length;
  const bulletCount = (bundle.match(/^- /gm) || []).length;
  console.error("OCF reference LinkedIn exporter summary");
  console.error("This is a bare-bones proof-of-concept exporter that creates a paste bundle, not a LinkedIn API integration.");
  console.error(`Wrote LinkedIn paste bundle: ${outputPath}`);
  console.error(`Sections exported: ${sectionCount}`);
  console.error(`Bullets exported: ${bulletCount}`);
  console.error(`Private OCF items are not exported by this reference tool.`);
  if (doc.meta?.fileRole !== "export-ready") {
    console.error(`Input fileRole is ${doc.meta?.fileRole || "unspecified"}; review curation before treating this as final output.`);
  }
  const unresolvedVariants = countUnresolvedVariants(doc);
  if (unresolvedVariants) {
    console.error(`Ignored ${unresolvedVariants} unresolved title/narrative variants; exporters use canonical fields from the provided file.`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { toLinkedInBundle };
