#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "../..");
const SAMPLE_RESUME = "spec/examples/maria-reyes/source-resume.txt";
const CURRENT_SCHEMA = JSON.parse(fs.readFileSync(path.join(ROOT, "spec/schema.json"), "utf8"));
const CURRENT_SCHEMA_VERSION = CURRENT_SCHEMA.properties?.schemaVersion?.const;
const CURRENT_SCHEMA_URL = CURRENT_SCHEMA.$id || "https://opencareerformat.org/schema.json";
const VALID_OUTPUTS = new Set(["transcript", "provisional-master"]);

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.sampleResume && !options.resume) {
    options.resume = path.join(ROOT, SAMPLE_RESUME);
  }

  if (!isValidOptions(options)) {
    printUsage();
    process.exit(2);
  }

  const prompt = buildPrompt(options);
  const response = await callOllama(options.model, prompt, options);
  const output = formatOutput(options, response);

  fs.mkdirSync(path.dirname(options.out), { recursive: true });
  fs.writeFileSync(options.out, output);
  printSummary(options, prompt, response);
}

function buildPrompt(options) {
  if (options.output === "provisional-master") {
    return buildImportedStarterPrompt(options);
  }

  const promptPath = options.mode === "curation" ? "prompts/curation.md" : "prompts/authoring.md";
  const sections = [
    section("OCF LLM Site Map", readRepoFile("llms.txt")),
    section("OCF Starter/Core Schema", readRepoFile("schema-core.json")),
    section("OCF Prompt", readRepoFile(promptPath)),
  ];

  if (options.ocf) sections.push(section("Existing OCF File", readUserFile(options.ocf)));
  if (options.resume) sections.push(section("Resume or Source Material", readUserFile(options.resume)));
  if (options.job) sections.push(section("Target Job Description or Purpose", readUserFile(options.job)));
  if (options.note) sections.push(section("User Note", options.note));

  sections.push(section("Task", taskForMode(options)));

  return sections.join("\n\n");
}

function buildImportedStarterPrompt(options) {
  const sections = [
    section("OCF Validator Contract", importedStarterContract(options)),
  ];

  if (options.resume) sections.push(section("Resume or Source Material", readUserFile(options.resume)));
  if (options.job) sections.push(section("Target Job Description or Purpose", readUserFile(options.job)));
  if (options.note) sections.push(section("User Note", options.note));

  sections.push(section("Task", taskForMode(options)));

  return sections.join("\n\n");
}

function importedStarterContract(options) {
  const imported = importContext(options);
  return [
    `Return one JSON object that passes the full current OCF validator (schemaVersion ${CURRENT_SCHEMA_VERSION}).`,
    "Top-level keys to use: $schema, schemaVersion, meta, person, sourceArtifacts, skills, experience, education, certifications, openQuestions.",
    "Do not include any other top-level keys. In particular, do not include openAnswers.",
    "",
    "Required top-level metadata:",
    `{ "$schema": "${CURRENT_SCHEMA_URL}", "schemaVersion": "${CURRENT_SCHEMA_VERSION}" }`,
    `meta must include: fileRole "candidate-master", lastModified "${imported.date}", language "en-US", source {"kind":"imported"}. Do not include meta.variant or meta.canonical.`,
    "",
    "person shape:",
    'person.name must be an object like {"renderAs":"Maria E. Reyes","given":"Maria","family":"Reyes"}.',
    "person may include headline, summary, contacts, and locations.",
    'contacts must be an array of objects with kind, value, and explicit visibility. Valid kind values: email, phone, url, linkedin, github, social, other.',
    'locations must be an array like [{"city":"San Antonio","region":"TX","country":"US","visibility":"shared"}].',
    "Do not use person.email, person.phone, person.linkedin, person.github, person.website, person.city, person.country, person.url, or string person.name.",
    "",
    "sourceArtifacts shape:",
    `Use exactly one source artifact: {"id":"source-resume","kind":"resume","label":${JSON.stringify(imported.fileName)},"capturedDate":${JSON.stringify(imported.capturedDate)},"fileName":${JSON.stringify(imported.fileName)},"rawIncluded":false,"visibility":"private"}.`,
    "",
    "skills shape:",
    'skills must be an array of objects like [{"name":"Incident Response","visibility":"shared"}]. Do not use an object keyed by skill name.',
    "",
    "date rules:",
    'A partial date is {"year":2023,"month":3}, {"year":2023}, or {"present":true}.',
    'Never output "end": {}. If an end date is unknown, omit end. If the source says Present, use "end":{"present":true}. If the source gives an end date, include year and month.',
    "",
    "experience shape:",
    'experience must be an array. Each item needs name, kind, dateRange, positions, visibility. Valid kind values include "employment" and "military".',
    "Each position needs title, dateRange, visibility, and may include summary and achievements. Repeat the parent dateRange on the position.",
    'Each achievement needs id, statement, kind "accomplishment", visibility "shared".',
    "",
    "education and certifications:",
    "education items use institution, degree, field, dateRange, visibility.",
    'certification items use name, type "certification", issuer, visibility. Omit dateRange if the source gives no date.',
    "",
    "openQuestions shape:",
    'openQuestions must be an array of objects with question and visibility "private". Do not use text instead of question.',
    "",
    "Final self-check before returning JSON:",
    "The root object must not contain contacts, locations, openings, openAnswers, or any key not listed in the top-level keys line.",
    "contacts and locations belong inside person only.",
    "Every achievement object must contain a non-empty statement. If you do not have a statement, omit that achievement object.",
    'Every dateRange.start and dateRange.end that appears must be an object, never a string and never {}.',
  ].join("\n");
}

function taskForMode(options) {
  if (options.output === "provisional-master") {
    const imported = importContext(options);
    return [
      "Convert the attached resume/source material into a validator-ready provisional OCF master with imported items marked for review.",
      "Return only one JSON object. Do not wrap it in Markdown. Do not include commentary before or after the JSON.",
      "The output will be written exactly as you return it and checked with the full OCF validator. Do not rely on a later tool to repair fields.",
      "Use only fields listed in this task or in the starter/core schema. Do not nest skills, experience, education, certifications, sourceArtifacts, or openQuestions under person.",
      `Set "$schema" to "${CURRENT_SCHEMA_URL}".`,
      `Set "schemaVersion" to "${CURRENT_SCHEMA_VERSION}".`,
      `Set "meta.fileRole" to "candidate-master", "meta.source.kind" to "imported", "meta.language" to "en-US", and "meta.lastModified" to "${imported.date}".`,
      "Do not include meta.variant or meta.canonical.",
      `Include sourceArtifacts as an array with one object: id "source-resume", kind "resume", label ${JSON.stringify(imported.fileName)}, capturedDate ${JSON.stringify(imported.capturedDate)}, fileName ${JSON.stringify(imported.fileName)}, rawIncluded false, visibility "private".`,
      "person may contain only valid person fields. Contacts must be objects with required kind and value. Contact kind must be one of email, phone, url, linkedin, github, social, other.",
      "Prefer conservative extraction over guessing. Do not invent facts. Put uncertainty in openQuestions.",
      'skills must be top-level. Each skill needs at least {"name": "..."} and may include visibility "shared".',
      'experience must be top-level. Each experience entry needs name, kind, dateRange, positions, and visibility. kind must be one of employment, self-employment, consulting, gig, seasonal, military, government, homemaker, caregiver, career-break, retirement, other. Use "military" for Army roles and "employment" for private-sector roles.',
      "Each position needs title, dateRange, visibility, and may include summary and achievements. If a position covers the same dates as its experience entry, repeat the same dateRange on the position.",
      'Each achievement needs id, statement, kind "accomplishment", and visibility "shared".',
      "education must be top-level. Use institution, degree, field, dateRange, visibility.",
      'certifications must be top-level. Each certification needs name, type "certification", issuer, and visibility. Omit dateRange if dates are unknown.',
      'openQuestions must be top-level. Each open question needs id, question, context if useful, reviewStatus "needs-review", and visibility private.',
      "Use partial dates as objects such as {\"year\": 2023, \"month\": 3} and use {\"present\": true} for current end dates.",
      "Do not use ISO timestamps, sourceArtifacts.name, sourceArtifacts.date, sourceArtifacts.kind values other than resume, or openQuestions.text.",
      'Keep imported claims reviewable by using reviewStatus "unreviewed" or "needs-review" on durable mined items.',
    ].join("\n");
  }

  if (options.mode === "curation") {
    return [
      "Use the curation prompt above.",
      "Before drafting any external-facing content, read relevant cautions, open questions, goals, aiInstructions.text, reflections, and narrative variants if they are present.",
      "Produce a concise OCF-oriented curation pass: target fit, missing evidence, risky claims, proposed questions, proposed OCF updates, and draft output only if enough evidence exists.",
      "Do not invent facts. Mark uncertainty as questions.",
    ].join("\n");
  }

  return [
    "Use the authoring prompt above.",
    "Treat the attached material as source artifacts for a provisional master unless an OCF file is provided.",
    "Produce a concise OCF-oriented intake pass: reusable career facts, achievements, skills, narrative variants, cautions, open questions, target fit, missing evidence, and suggested OCF updates.",
    "Do not invent facts. Mark uncertainty as questions.",
  ].join("\n");
}

function importContext(options) {
  const date = new Date().toISOString().slice(0, 10);
  const [year, month, day] = date.split("-").map(Number);
  return {
    date,
    capturedDate: { year, month, day },
    fileName: path.basename(options.resume || "source-resume.txt"),
  };
}

function formatOutput(options, response) {
  if (options.output === "transcript") {
    return `${response.trim()}\n`;
  }

  const doc = extractJsonObject(response);
  return `${JSON.stringify(doc, null, 2)}\n`;
}

function extractJsonObject(response) {
  const trimmed = response.trim();
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    // Continue with common LLM response wrappers.
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch (_) {
      // Continue with balanced-object extraction.
    }
  }

  const candidate = firstBalancedJsonObject(trimmed);
  if (!candidate) {
    throw new Error("Ollama response did not contain a JSON object.");
  }
  return JSON.parse(candidate);
}

function firstBalancedJsonObject(text) {
  const start = text.indexOf("{");
  if (start === -1) return "";

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }

  return "";
}

function section(title, body) {
  return `# ${title}\n\n${body.trim()}`;
}

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function readUserFile(filePath) {
  return fs.readFileSync(path.resolve(filePath), "utf8");
}

function callOllama(model, prompt, options = {}) {
  const args = ["run", "--nowordwrap"];

  if (options.output === "provisional-master") {
    args.push("--format", "json");
  }

  args.push(model, prompt);

  const command = resolveOllamaCommand();

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, OLLAMA_NOHISTORY: "1" },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      reject(new Error(`Could not run ${command}: ${error.message}`));
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Ollama command exited with code ${code}: ${stderr.trim() || stdout.trim()}`));
        return;
      }
      resolve(stdout);
    });
  });
}

function resolveOllamaCommand() {
  if (process.env.OLLAMA_BIN) return process.env.OLLAMA_BIN;
  if (fs.existsSync("/usr/local/bin/ollama")) return "/usr/local/bin/ollama";
  return "ollama";
}

function printSummary(options, prompt, response) {
  console.error("OCF Ollama local LLM summary");
  console.error("This is a bare-bones proof-of-concept script, not a production importer, curator, or validator.");
  console.error(`Mode: ${options.mode}`);
  console.error(`Output: ${options.output}`);
  console.error(`Targets the current OCF schemaVersion (${CURRENT_SCHEMA_VERSION}) for JSON output.`);
  console.error(`Model: ${options.model}`);
  console.error(`Prompt characters sent: ${prompt.length}`);
  console.error(`Response characters received: ${response.length}`);
  console.error(`Wrote ${options.output === "transcript" ? "response" : "provisional OCF"}: ${options.out}`);
  if (options.output === "provisional-master") {
    console.error(`Validate with: node reference/validator/validate.js ${options.out}`);
  } else {
    console.error("If the response includes OCF JSON, save it separately and run: node reference/validator/validate.js <file>");
  }
}

function parseArgs(args) {
  const options = {
    mode: "authoring",
    output: "transcript",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--mode") options.mode = args[++index];
    else if (arg === "--model") options.model = args[++index];
    else if (arg === "--resume") options.resume = args[++index];
    else if (arg === "--sample-resume") options.sampleResume = true;
    else if (arg === "--job") options.job = args[++index];
    else if (arg === "--ocf") options.ocf = args[++index];
    else if (arg === "--out") options.out = args[++index];
    else if (arg === "--output" || arg === "--format") options.output = args[++index];
    else if (arg === "--note") options.note = args[++index];
    else if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function isValidOptions(options) {
  if (!options.out || !options.model) return false;
  if (!["authoring", "curation"].includes(options.mode)) return false;
  if (!VALID_OUTPUTS.has(options.output)) return false;
  if (options.output === "provisional-master") {
    return options.mode === "authoring" && Boolean(options.resume);
  }
  return true;
}

function printUsage() {
  console.error("Usage:");
  console.error("  node reference/ollama/ocf-local-llm.js --mode authoring --model <ollama-model> --resume <source.txt> [--job <job.txt>] --out <response.md>");
  console.error("  node reference/ollama/ocf-local-llm.js --mode authoring --output provisional-master --model <ollama-model> --resume <source.txt> --out <draft.ocf.json>");
  console.error("  node reference/ollama/ocf-local-llm.js --mode authoring --output provisional-master --model <ollama-model> --sample-resume --out <draft.ocf.json>");
  console.error("  node reference/ollama/ocf-local-llm.js --mode curation --model <ollama-model> --ocf <master.ocf.json> [--job <job.txt>] --out <response.md>");
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  buildPrompt,
  extractJsonObject,
  firstBalancedJsonObject,
  formatOutput,
  parseArgs,
  resolveOllamaCommand,
};
