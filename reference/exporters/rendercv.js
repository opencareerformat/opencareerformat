#!/usr/bin/env node

const {
  collectAchievements,
  countUnresolvedVariants,
  organizationName,
  readOcf,
  visibleItems,
  writeOutput,
  filterByVisibility,
} = require("./lib/ocf");

const SUPPORTED_SOCIAL_NETWORKS = new Map([
  ["bluesky", "Bluesky"],
  ["github", "GitHub"],
  ["gitlab", "GitLab"],
  ["google scholar", "Google Scholar"],
  ["instagram", "Instagram"],
  ["leetcode", "Leetcode"],
  ["linkedin", "LinkedIn"],
  ["mastodon", "Mastodon"],
  ["orcid", "ORCID"],
  ["reddit", "Reddit"],
  ["researchgate", "ResearchGate"],
  ["stackoverflow", "StackOverflow"],
  ["telegram", "Telegram"],
  ["whatsapp", "WhatsApp"],
  ["x", "X"],
  ["x/twitter", "X"],
  ["youtube", "YouTube"],
]);

function toRenderCv(source) {
  const report = { errors: [], warnings: [], counts: {} };
  checkExportReadiness(source, report);

  const doc = filterByVisibility(source, "shared");
  reportLosses(source, doc, report);
  checkRendererMarkup(doc, report);
  const person = doc.person || {};
  const cv = prune({
    name: person.name?.renderAs,
    headline: person.headline,
    location: renderLocation(visibleItems(person.locations)[0]),
    ...mapContacts(person.contacts, report),
    sections: mapSections(doc, report),
  });

  if (!cv.name) report.errors.push("person.name.renderAs is required for RenderCV output.");
  if (!cv.sections || Object.keys(cv.sections).length === 0) {
    report.errors.push("No supported, visible resume sections were available to export.");
  }

  report.counts.sections = Object.keys(cv.sections || {}).length;
  return { document: { cv }, report };
}

function reportLosses(source, doc, report) {
  const privateBranches = countVisibility(source, "private");
  if (privateBranches) {
    report.warnings.push(`Excluded ${privateBranches} private ${privateBranches === 1 ? "branch" : "branches"} from the RenderCV handoff.`);
  }

  const unsupportedTopLevel = [
    "competencies",
    "governance",
    "interests",
    "mediaAppearances",
    "memberships",
    "patents",
    "references",
    "speaking",
    "teaching",
  ].filter((key) => Array.isArray(doc[key]) ? doc[key].length : doc[key] != null);
  if (unsupportedTopLevel.length) {
    report.warnings.push(`Visible OCF sections without a v1 RenderCV mapping: ${unsupportedTopLevel.join(", ")}.`);
  }

  const unsupportedPerson = ["clearances", "workAuthorization", "photo"]
    .filter((key) => Array.isArray(doc.person?.[key]) ? doc.person[key].length : doc.person?.[key] != null);
  if (unsupportedPerson.length) {
    report.warnings.push(`Visible person fields without a v1 RenderCV mapping: ${unsupportedPerson.join(", ")}.`);
  }
}

function checkRendererMarkup(value, report, path = "$") {
  if (typeof value === "string") {
    if (/#[A-Za-z_][A-Za-z0-9_-]*\[/.test(value) || value.includes("$$")) {
      report.errors.push(`Renderer control syntax found at ${path}; OCF display text must not contain raw Typst commands or math delimiters.`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkRendererMarkup(item, report, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) checkRendererMarkup(item, report, `${path}.${key}`);
}

function countVisibility(value, visibility) {
  if (Array.isArray(value)) return value.reduce((count, item) => count + countVisibility(item, visibility), 0);
  if (!value || typeof value !== "object") return 0;
  if (value.visibility === visibility) return 1;
  return Object.values(value).reduce((count, item) => count + countVisibility(item, visibility), 0);
}

function checkExportReadiness(doc, report) {
  if (doc.meta?.fileRole !== "export-ready") {
    report.errors.push(`Input fileRole is ${doc.meta?.fileRole || "unspecified"}; expected export-ready after the curation conversation.`);
  }
  const questions = (doc.openQuestions || []).filter((item) => !["do-not-use", "superseded"].includes(item.reviewStatus));
  if (questions.length) {
    report.errors.push(`Input still contains ${questions.length} unresolved open ${questions.length === 1 ? "question" : "questions"}.`);
  }
  const variants = countUnresolvedVariants(doc);
  if (variants) {
    report.errors.push(`Input still contains ${variants} title/narrative ${variants === 1 ? "variant" : "variants"}; resolve final display wording during curation.`);
  }
}

function mapContacts(contacts, report) {
  const visible = visibleItems(contacts).filter((contact) => contact.value);
  const byKind = (kind) => visible.filter((contact) => contact.kind === kind).map((contact) => contact.value);
  const emails = byKind("email");
  const phones = byKind("phone");
  const websites = visible.filter((contact) => contact.kind === "url");
  const socialNetworks = [];
  const customConnections = [];

  for (const contact of visible) {
    if (!["linkedin", "github", "social"].includes(contact.kind)) continue;
    const label = contact.kind === "social" ? contact.label : contact.kind;
    const network = SUPPORTED_SOCIAL_NETWORKS.get(String(label || "").toLowerCase());
    const username = network && socialUsername(network, contact.value);
    if (network && username) {
      socialNetworks.push({ network, username });
    } else {
      customConnections.push(prune({ placeholder: contact.label || titleCase(contact.kind), url: contact.value }));
      report.warnings.push(`Mapped unsupported social contact ${contact.label || contact.kind} as a custom RenderCV connection.`);
    }
  }

  for (const contact of websites.slice(1)) {
    customConnections.push(prune({ placeholder: contact.label || "Website", url: contact.value }));
  }

  return prune({
    email: oneOrMany(emails),
    phone: oneOrMany(phones),
    website: websites[0]?.value,
    social_networks: socialNetworks,
    custom_connections: customConnections,
  });
}

function mapSections(doc, report) {
  const sections = {};
  const person = doc.person || {};

  if (person.summary) sections.Summary = [person.summary];

  const experience = [];
  for (const entry of visibleItems(doc.experience)) {
    const company = organizationName(doc, entry);
    for (const position of visibleItems(entry.positions)) {
      if (!company || !position.title) {
        report.errors.push(`An experience position is missing ${!company ? "company" : "title"}; resolve it before export.`);
        continue;
      }
      experience.push(prune({
        company,
        position: position.title,
        ...mapDateRange(position.dateRange || entry.dateRange),
        location: renderLocation(visibleItems(position.locations)[0] || visibleItems(entry.locations)[0]),
        summary: position.summary || entry.description,
        highlights: collectAchievements(position),
      }));
    }
    if (!(entry.positions || []).length && (entry.description || entry.dateRange)) {
      report.warnings.push(`Skipped experience entry ${entry.name}; RenderCV ExperienceEntry requires a position title.`);
    }
  }
  if (experience.length) sections.Experience = experience;
  report.counts.experience = experience.length;
  report.counts.achievements = experience.reduce((count, item) => count + (item.highlights || []).length, 0);

  const skills = groupSkills(visibleItems(doc.skills));
  if (skills.length) sections.Skills = skills;
  report.counts.skills = visibleItems(doc.skills).length;

  const education = [];
  for (const item of visibleItems(doc.education)) {
    if (!item.institution || !item.field) {
      report.errors.push(`Education entry ${item.institution || item.degree || "(unnamed)"} needs both institution and field for RenderCV.`);
      continue;
    }
    education.push(prune({
      institution: item.institution,
      area: item.field,
      degree: item.degree,
      ...mapDateRange(item.dateRange),
      location: renderLocation(item.location),
      highlights: educationHighlights(item),
    }));
  }
  if (education.length) sections.Education = education;
  report.counts.education = education.length;

  addNormalSection(sections, "Certifications", visibleItems(doc.certifications).map((item) => prune({
    name: item.name,
    date: dateValue(item.dateRange?.start),
    summary: issuerName(item.issuer),
    highlights: item.status ? [`Status: ${titleCase(item.status)}`] : undefined,
  })), report);

  addNormalSection(sections, "Projects", visibleItems(doc.projects).map((item) => prune({
    name: item.name,
    ...mapDateRange(item.dateRange),
    location: renderLocation(item.location),
    summary: item.description,
    highlights: collectAchievements(item),
  })), report);

  const publications = [];
  for (const item of visibleItems(doc.publications)) {
    if (!item.title || !(item.authors || []).length) {
      report.errors.push(`Publication ${item.title || "(untitled)"} needs a title and authors for RenderCV.`);
      continue;
    }
    publications.push(prune({
      title: item.title,
      authors: item.authors,
      doi: identifierAsDoi(item.identifier),
      url: item.url,
      journal: item.venue || item.publisher,
      date: dateValue(item.date),
      summary: item.abstract,
    }));
  }
  if (publications.length) sections.Publications = publications;
  report.counts.publications = publications.length;

  addNormalSection(sections, "Awards", visibleItems(doc.awards).map((item) => prune({
    name: item.title,
    date: dateValue(item.date) || dateRangeText(item.dateRange),
    summary: [item.awarder, item.description].filter(Boolean).join(" — "),
    highlights: [item.rank, item.basis].filter(Boolean),
  })), report);

  const languages = visibleItems(doc.languages).map((item) => ({
    label: item.language,
    details: titleCase(item.proficiency || (item.native ? "native" : "")),
  })).filter((item) => item.label && item.details);
  if (languages.length) sections.Languages = languages;

  addNormalSection(sections, "Service", visibleItems(doc.service).map((item) => prune({
    name: item.organization,
    ...mapDateRange(item.dateRange),
    summary: [item.role, item.description].filter(Boolean).join(" — "),
    highlights: collectAchievements(item),
  })), report);

  return sections;
}

function addNormalSection(sections, name, items, report) {
  const valid = [];
  for (const item of items) {
    if (!item.name) {
      report.errors.push(`${name} contains an unnamed entry that RenderCV cannot export.`);
    } else {
      valid.push(item);
    }
  }
  if (valid.length) sections[name] = valid;
  report.counts[name.toLowerCase()] = valid.length;
}

function groupSkills(skills) {
  const grouped = new Map();
  for (const skill of skills) {
    if (!skill.name) continue;
    const label = titleCase(skill.category || "Skills");
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label).push(skill.name);
  }
  return [...grouped].map(([label, names]) => ({ label, details: names.join(", ") }));
}

function educationHighlights(item) {
  const highlights = [];
  if (item.gpa != null) highlights.push(`GPA: ${item.gpa}${item.gpaScale ? `/${item.gpaScale}` : ""}`);
  for (const course of item.notableCourses || []) highlights.push(course);
  return highlights;
}

function mapDateRange(range) {
  if (!range) return {};
  return prune({
    start_date: dateValue(range.start),
    end_date: dateValue(range.end),
  });
}

function dateValue(date) {
  if (!date) return undefined;
  if (date.present) return "present";
  if (!date.year) return undefined;
  if (date.month && date.day) return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
  if (date.month) return `${date.year}-${pad(date.month)}`;
  return date.year;
}

function dateRangeText(range) {
  if (!range) return undefined;
  const start = dateValue(range.start);
  const end = dateValue(range.end);
  return [start, end].filter((value) => value != null).join(" – ") || undefined;
}

function renderLocation(location) {
  if (!location) return undefined;
  if (location.renderAs) return location.renderAs;
  return [location.city, location.region, location.country].filter(Boolean).join(", ") || undefined;
}

function socialUsername(network, value) {
  if (!value) return undefined;
  if (!/^https?:\/\//i.test(value)) return value.replace(/^@/, "");
  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    if (network === "LinkedIn" && parts[0] === "in") return parts[1];
    if (network === "Bluesky" && parts[0] === "profile") return parts[1];
    return parts.at(-1)?.replace(/^@/, "");
  } catch {
    return undefined;
  }
}

function identifierAsDoi(identifier) {
  if (!identifier) return undefined;
  return /^10\.\d{4,9}\//.test(identifier) ? identifier : undefined;
}

function issuerName(issuer) {
  if (!issuer) return undefined;
  return typeof issuer === "string" ? issuer : issuer.name;
}

function oneOrMany(values) {
  if (!values.length) return undefined;
  return values.length === 1 ? values[0] : values;
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function prune(value) {
  if (Array.isArray(value)) {
    return value.map(prune).filter((item) => item != null && (!(Array.isArray(item)) || item.length));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .map(([key, item]) => [key, prune(item)])
      .filter(([, item]) => item != null && item !== "" && (!Array.isArray(item) || item.length) && (typeof item !== "object" || Array.isArray(item) || Object.keys(item).length)));
  }
  return value;
}

function toYaml(value) {
  return `${yamlLines(value, 0).join("\n")}\n`;
}

function yamlLines(value, depth) {
  const indent = " ".repeat(depth);
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (isScalar(item)) return [`${indent}- ${yamlScalar(item)}`];
      return [`${indent}-`, ...yamlLines(item, depth + 2)];
    });
  }
  return Object.entries(value).flatMap(([key, item]) => {
    const renderedKey = yamlKey(key);
    if (isScalar(item)) return [`${indent}${renderedKey}: ${yamlScalar(item)}`];
    return [`${indent}${renderedKey}:`, ...yamlLines(item, depth + 2)];
  });
}

function isScalar(value) {
  return value == null || typeof value !== "object";
}

function yamlScalar(value) {
  if (value == null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  return String(value);
}

function yamlKey(value) {
  return /^[A-Za-z_][A-Za-z0-9_ -]*$/.test(value) ? value : JSON.stringify(value);
}

function printReport(report, outputPath) {
  console.error("OCF reference RenderCV exporter summary");
  console.error(`Output: ${outputPath}`);
  for (const [name, count] of Object.entries(report.counts)) console.error(`${titleCase(name)}: ${count}`);
  for (const warning of report.warnings) console.error(`Warning: ${warning}`);
  for (const error of report.errors) console.error(`Error: ${error}`);
}

function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    console.error("Usage: node reference/exporters/rendercv.js <export-ready.ocf.json> <output.yaml>");
    process.exit(2);
  }

  const result = toRenderCv(readOcf(inputPath));
  printReport(result.report, outputPath);
  if (result.report.errors.length) {
    console.error("No RenderCV YAML was written. Return to curation and resolve the errors above.");
    process.exit(1);
  }
  writeOutput(outputPath, toYaml(result.document));
}

if (require.main === module) main();

module.exports = { toRenderCv, toYaml };
