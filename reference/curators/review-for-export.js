#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const { filterByVisibility } = require("../lib/visibility");
const validateStandalone = require("../validator/standalone.cjs");
const { validateSemantic } = require("../validator/semantic");

const REVIEWABLE_COLLECTIONS = [
  ["skills", "skill", (item) => item.name],
  ["education", "education entry", (item) => [item.degree, item.field, item.institution].filter(Boolean).join(" — ")],
  ["certifications", "certification", (item) => item.name],
  ["projects", "project", (item) => item.name],
  ["publications", "publication", (item) => item.title],
  ["awards", "award", (item) => item.title],
  ["languages", "language", (item) => item.language],
  ["service", "service entry", (item) => [item.role, item.organization].filter(Boolean).join(" — ")],
];

async function reviewForExport(source, ask, options = {}) {
  const inputErrors = validateReviewed(source);
  if (inputErrors.length) throw new Error(`Cannot review invalid OCF input:\n- ${inputErrors.join("\n- ")}`);
  if (!source.meta?.id) throw new Error("Cannot review OCF: input is missing meta.id.");
  if (source.meta.fileRole !== "candidate-curated") {
    throw new Error(`Cannot start export review from fileRole ${source.meta.fileRole || "unspecified"}; expected candidate-curated.`);
  }
  await confirmOpenQuestions(source.openQuestions || [], ask);

  const filtered = filterByVisibility(source, "shared", {
    preserveFilteredReferences: true,
  });
  const today = options.today || new Date().toISOString().slice(0, 10);
  const person = structuredClone(filtered.person || {});

  person.headline = await editText(ask, "Final headline", person.headline, false);
  person.summary = await editText(ask, "Final summary", person.summary, false);
  person.contacts = await reviewContacts(source.person?.contacts || [], ask);
  person.locations = await reviewItems(filtered.person?.locations || [], ask, "location", renderLocation);

  const reviewed = prune({
    $schema: source.$schema,
    schemaVersion: source.schemaVersion,
    meta: {
      id: options.id || crypto.randomUUID(),
      version: options.version || `export-ready-${today}`,
      fileRole: "export-ready",
      targetRole: source.meta.targetRole,
      targetCompany: source.meta.targetCompany,
      targetLocation: source.meta.targetLocation,
      targetUrl: source.meta.targetUrl,
      lastModified: today,
      language: source.meta.language,
      source: { kind: "authored" },
      parentFileId: source.meta.id,
      parentVersion: source.meta.version,
      lineageNotes: options.lineageNotes || "Locally reviewed export-ready child. Contacts, positioning, positions, achievements, variants, and supporting sections were resolved through an explicit question-and-answer session.",
    },
    person,
    experience: await reviewExperience(filtered.experience || [], ask),
  });

  for (const [key, label, describe] of REVIEWABLE_COLLECTIONS) {
    reviewed[key] = await reviewItems(filtered[key] || [], ask, label, describe);
  }
  reviewed.organizations = referencedOrganizations(filtered.organizations, reviewed);

  const final = prune(await resolveVariants(reviewed, ask));
  const confirmed = await yesNo(ask, "Write this reviewed export-ready OCF file?", false);
  if (!confirmed) return null;
  return final;
}

async function confirmOpenQuestions(questions, ask) {
  const active = questions.filter((item) => !["do-not-use", "superseded"].includes(item.reviewStatus));
  for (const item of active) {
    const resolved = await yesNo(ask, `Open question: ${item.question}\nHas this been resolved in the curated content or intentionally excluded?`, false);
    if (!resolved) {
      throw new Error("Export review stopped with an unresolved open question. Update the candidate-curated file, then resume review.");
    }
  }
}

async function reviewContacts(contacts, ask) {
  const selected = [];
  for (const contact of contacts) {
    if (!contact?.value) continue;
    const privacy = contact.visibility || "schema default";
    const include = await yesNo(ask, `Include ${privacy} ${contact.label || contact.kind} contact ${contact.value}?`, false);
    if (include) selected.push({ ...structuredClone(contact), visibility: "shared" });
  }
  return selected;
}

async function reviewExperience(entries, ask) {
  const reviewed = [];
  for (const entry of entries) {
    const positions = [];
    for (const position of entry.positions || []) {
      if (!await yesNo(ask, `Include position ${position.title || "(untitled)"} at ${entry.name}?`, true)) continue;
      const copy = structuredClone(position);
      copy.summary = await editText(ask, `Role summary for ${position.title || entry.name}`, copy.summary, false);
      copy.achievements = [];
      for (const achievement of position.achievements || []) {
        const statement = achievement.statement || achievement.shortStatement || "(no statement)";
        if (!await yesNo(ask, `Include achievement: ${statement}`, true)) continue;
        const selected = await resolveNarrativeVariant(structuredClone(achievement), ask);
        selected.statement = await editText(ask, "Final achievement wording", selected.statement, true);
        copy.achievements.push(selected);
      }
      positions.push(copy);
    }
    if (positions.length) reviewed.push({ ...structuredClone(entry), positions });
  }
  return reviewed;
}

async function reviewItems(items, ask, label, describe) {
  const selected = [];
  for (const item of items) {
    const description = describe(item) || "(unnamed)";
    if (await yesNo(ask, `Include ${label}: ${description}?`, true)) selected.push(structuredClone(item));
  }
  return selected;
}

async function resolveVariants(value, ask) {
  if (Array.isArray(value)) {
    const resolved = [];
    for (const item of value) resolved.push(await resolveVariants(item, ask));
    return resolved;
  }
  if (!value || typeof value !== "object") return value;

  const copy = { ...value };
  if (Array.isArray(copy.titleVariants) && copy.titleVariants.length) {
    const choices = [copy.title, ...copy.titleVariants.map((item) => item.title)].filter(Boolean);
    copy.title = await choose(ask, "Choose final title", choices);
    delete copy.titleVariants;
  }
  if (Array.isArray(copy.narrativeVariants) && copy.narrativeVariants.length) {
    Object.assign(copy, await resolveNarrativeVariant(copy, ask));
  }

  for (const [key, item] of Object.entries(copy)) copy[key] = await resolveVariants(item, ask);
  return copy;
}

async function resolveNarrativeVariant(item, ask) {
  const choices = [
    item.statement ? { label: "Canonical", statement: item.statement } : null,
    ...(item.narrativeVariants || [])
      .filter((variant) => variant.statement)
      .map((variant) => ({ label: variant.label || "Variant", statement: variant.statement })),
  ].filter(Boolean);
  if (choices.length > 1) {
    const selected = await choose(ask, "Choose final achievement wording", choices.map((choice) => `${choice.label}: ${choice.statement}`));
    const index = choices.findIndex((choice) => `${choice.label}: ${choice.statement}` === selected);
    item.statement = choices[index].statement;
  }
  delete item.narrativeVariants;
  return item;
}

async function choose(ask, label, choices) {
  if (!choices.length) return undefined;
  if (choices.length === 1) return choices[0];
  const menu = choices.map((choice, index) => `  ${index + 1}. ${choice}`).join("\n");
  while (true) {
    const answer = String(await ask(`${label}:\n${menu}\nChoose 1-${choices.length} [1]: `)).trim();
    if (!answer) return choices[0];
    const index = Number(answer) - 1;
    if (Number.isInteger(index) && index >= 0 && index < choices.length) return choices[index];
  }
}

async function editText(ask, label, current, required) {
  const display = current ? `\nCurrent: ${current}` : "";
  while (true) {
    const answer = String(await ask(`${label}.${display}\nPress Enter to keep it${required ? "" : ", or type - to omit it"}; otherwise type replacement text: `));
    if (!answer.trim()) {
      if (current || !required) return current;
      continue;
    }
    if (!required && answer.trim() === "-") return undefined;
    return answer.trim();
  }
}

async function yesNo(ask, prompt, defaultYes) {
  const suffix = defaultYes ? " [Y/n]: " : " [y/N]: ";
  while (true) {
    const answer = String(await ask(`${prompt}${suffix}`)).trim().toLowerCase();
    if (!answer) return defaultYes;
    if (["y", "yes"].includes(answer)) return true;
    if (["n", "no"].includes(answer)) return false;
  }
}

function referencedOrganizations(registry = {}, document) {
  const refs = new Set();
  collectOrganizationRefs(document, refs);
  return Object.fromEntries([...refs].filter((ref) => registry?.[ref]).map((ref) => [ref, registry[ref]]));
}

function collectOrganizationRefs(value, refs) {
  if (Array.isArray(value)) return value.forEach((item) => collectOrganizationRefs(item, refs));
  if (!value || typeof value !== "object") return;
  if (typeof value.organizationRef === "string") refs.add(value.organizationRef);
  Object.values(value).forEach((item) => collectOrganizationRefs(item, refs));
}

function renderLocation(location) {
  return location?.renderAs || [location?.city, location?.region, location?.country].filter(Boolean).join(", ");
}

function prune(value) {
  if (Array.isArray(value)) return value.map(prune).filter((item) => item != null);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .map(([key, item]) => [key, prune(item)])
      .filter(([, item]) => item != null && item !== "" && (!Array.isArray(item) || item.length) && (typeof item !== "object" || Array.isArray(item) || Object.keys(item).length)));
  }
  return value;
}

function validateReviewed(doc) {
  const errors = [];
  if (!validateStandalone(doc)) {
    errors.push(...(validateStandalone.errors || []).map((item) => `${item.instancePath || "/"}: ${item.message}`));
  }
  errors.push(...validateSemantic(doc).map((item) => `${item.instancePath || "/"}: ${item.message}`));
  return errors;
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    console.error("Usage: node reference/curators/review-for-export.js <candidate-curated.ocf.json> <export-ready.ocf.json>");
    process.exit(2);
  }
  if (fs.existsSync(outputPath)) {
    console.error(`Refusing to overwrite existing output: ${outputPath}`);
    process.exit(1);
  }

  let source;
  try {
    source = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  } catch (error) {
    console.error(`Unable to read input: ${error.message}`);
    process.exit(1);
  }

  const questioner = createQuestioner();
  let reviewed;
  try {
    reviewed = await reviewForExport(source, questioner.ask);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  } finally {
    questioner.close();
  }
  if (!reviewed) {
    console.error("Review cancelled; no export-ready file was written.");
    process.exit(1);
  }

  const errors = validateReviewed(reviewed);
  if (errors.length) {
    console.error("Reviewed output did not validate:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(reviewed, null, 2)}\n`);
  console.error(`Wrote reviewed export-ready OCF: ${outputPath}`);
}

function createQuestioner() {
  if (!process.stdin.isTTY) {
    const answers = fs.readFileSync(0, "utf8").split(/\r?\n/);
    let index = 0;
    return {
      ask: async (question) => {
        process.stdout.write(question);
        if (index >= answers.length) throw new Error("No more scripted answers are available for the export review.");
        return answers[index++];
      },
      close: () => {},
    };
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return {
    ask: (question) => rl.question(question),
    close: () => rl.close(),
  };
}

if (require.main === module) main();

module.exports = { reviewForExport, validateReviewed };
