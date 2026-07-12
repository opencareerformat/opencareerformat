const fs = require("fs");
const path = require("path");
const { filterByVisibility } = require("../../lib/visibility");

function readOcf(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeOutput(outputPath, content) {
  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content);
    return;
  }
  process.stdout.write(content);
}

function isVisible(item) {
  return !item || item.visibility !== "private";
}

function visibleItems(items) {
  return (items || []).filter(isVisible);
}

function firstPrimaryOrVisible(contacts, kind) {
  const matches = visibleItems(contacts).filter((contact) => contact.kind === kind);
  return (matches.find((contact) => contact.primary) || matches[0])?.value;
}

function formatPartialDate(date) {
  if (!date) return undefined;
  if (date.present) return "Present";
  if (!date.year) return undefined;
  if (date.month && date.day) {
    return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
  }
  if (date.month) return `${date.year}-${String(date.month).padStart(2, "0")}`;
  return String(date.year);
}

function formatDateRange(dateRange) {
  if (!dateRange || !isVisible(dateRange)) return "";
  const start = formatPartialDate(dateRange.start);
  const end = formatPartialDate(dateRange.end);
  if (start && end) return `${start} - ${end}`;
  if (start) return `${start} - Present`;
  if (end) return end;
  return "";
}

function dateRangeStart(...dateRanges) {
  const dateRange = dateRanges.find((item) => item && isVisible(item));
  return formatPartialDate(dateRange?.start);
}

function dateRangeEnd(...dateRanges) {
  const dateRange = dateRanges.find((item) => item && isVisible(item));
  if (!dateRange) return undefined;
  if (dateRange.end?.present) return undefined;
  return formatPartialDate(dateRange.end);
}

function organizationName(doc, entry) {
  if (entry.organizationRef && doc.organizations?.[entry.organizationRef]?.name) {
    return doc.organizations[entry.organizationRef].name;
  }
  return entry.name;
}

function organizationUrl(doc, entry) {
  if (entry.organizationRef && doc.organizations?.[entry.organizationRef]?.url) {
    return doc.organizations[entry.organizationRef].url;
  }
  return entry.url;
}

function selectedTitle(position) {
  return position.title;
}

function selectedAchievementStatement(achievement) {
  return achievement.statement;
}

function collectAchievements(positionOrEntry) {
  return visibleItems(positionOrEntry?.achievements || positionOrEntry?.spanning)
    .map(selectedAchievementStatement)
    .filter(Boolean);
}

function countUnresolvedVariants(value) {
  if (Array.isArray(value)) return value.reduce((count, item) => count + countUnresolvedVariants(item), 0);
  if (!value || typeof value !== "object") return 0;
  return Object.entries(value).reduce((count, [key, item]) => {
    const own = (key === "titleVariants" || key === "narrativeVariants") && Array.isArray(item) ? item.length : 0;
    return count + own + countUnresolvedVariants(item);
  }, 0);
}

function contactProfiles(person = {}) {
  const profiles = [];

  for (const contact of visibleItems(person.contacts)) {
    if (!contact.value) continue;
    if (contact.kind === "linkedin") {
      profiles.push({ network: "LinkedIn", url: contact.value });
    } else if (contact.kind === "github") {
      profiles.push({ network: "GitHub", url: contact.value });
    } else if (contact.kind === "social") {
      profiles.push({ network: contact.label || "Social", url: contact.value });
    } else if (contact.kind === "url" && contact.label) {
      profiles.push({ network: contact.label, url: contact.value });
    }
  }

  return profiles;
}

function personLocation(person = {}) {
  const location = visibleItems(person.locations)[0];
  if (!location) return undefined;
  return {
    city: location.city,
    region: location.region,
    countryCode: location.country,
  };
}

module.exports = {
  collectAchievements,
  countUnresolvedVariants,
  contactProfiles,
  dateRangeEnd,
  dateRangeStart,
  firstPrimaryOrVisible,
  formatDateRange,
  formatPartialDate,
  isVisible,
  organizationName,
  organizationUrl,
  personLocation,
  readOcf,
  selectedAchievementStatement,
  selectedTitle,
  visibleItems,
  writeOutput,
  filterByVisibility,
};
