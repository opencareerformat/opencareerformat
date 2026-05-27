#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("http");

const ROOT = path.resolve(__dirname, "../..");
const OLLAMA_URL = new URL(process.env.OLLAMA_HOST || "http://127.0.0.1:11434");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.out || !options.model || !["authoring", "curation"].includes(options.mode)) {
    printUsage();
    process.exit(2);
  }

  const prompt = buildPrompt(options);
  const response = await callOllama(options.model, prompt);

  fs.mkdirSync(path.dirname(options.out), { recursive: true });
  fs.writeFileSync(options.out, `${response.trim()}\n`);
  printSummary(options, prompt, response);
}

function buildPrompt(options) {
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

  sections.push(section("Task", taskForMode(options.mode)));

  return sections.join("\n\n");
}

function taskForMode(mode) {
  if (mode === "curation") {
    return [
      "Use the curation prompt above.",
      "Before drafting any external-facing content, read relevant cautions, open questions, goals, aiInstructions, reflections, and narrative variants if they are present.",
      "Produce a concise OCF-oriented curation pass: target fit, missing evidence, risky claims, proposed questions, proposed OCF updates, and draft output only if enough evidence exists.",
      "Do not invent facts. Mark uncertainty as questions.",
    ].join("\n");
  }

  return [
    "Use the authoring prompt above.",
    "Treat the attached material as source artifacts for an imported starter unless an OCF file is provided.",
    "Produce a concise OCF-oriented intake pass: reusable career facts, achievements, skills, narrative variants, cautions, open questions, target fit, missing evidence, and suggested OCF updates.",
    "Do not invent facts. Mark uncertainty as questions.",
  ].join("\n");
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

function callOllama(model, prompt) {
  const body = JSON.stringify({
    model,
    prompt,
    stream: false,
    options: {
      temperature: 0.2,
    },
  });

  const requestUrl = new URL("/api/generate", OLLAMA_URL);

  return new Promise((resolve, reject) => {
    const req = http.request(
      requestUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`Ollama returned HTTP ${res.statusCode}: ${data}`));
            return;
          }
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.response || "");
          } catch (error) {
            reject(new Error(`Could not parse Ollama response: ${error.message}`));
          }
        });
      }
    );

    req.on("error", (error) => {
      reject(new Error(`Could not reach Ollama at ${requestUrl.href}: ${error.message}`));
    });
    req.write(body);
    req.end();
  });
}

function printSummary(options, prompt, response) {
  console.error("OCF Ollama local LLM summary");
  console.error("This is a bare-bones proof-of-concept script, not a production importer, curator, or validator.");
  console.error(`Mode: ${options.mode}`);
  console.error(`Model: ${options.model}`);
  console.error(`Prompt characters sent: ${prompt.length}`);
  console.error(`Response characters received: ${response.length}`);
  console.error(`Wrote response: ${options.out}`);
  console.error("If the response includes OCF JSON, save it separately and run: node reference/validator/validate.js <file>");
}

function parseArgs(args) {
  const options = {
    mode: "authoring",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--mode") options.mode = args[++index];
    else if (arg === "--model") options.model = args[++index];
    else if (arg === "--resume") options.resume = args[++index];
    else if (arg === "--job") options.job = args[++index];
    else if (arg === "--ocf") options.ocf = args[++index];
    else if (arg === "--out") options.out = args[++index];
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

function printUsage() {
  console.error("Usage:");
  console.error("  node reference/ollama/ocf-local-llm.js --mode authoring --model <ollama-model> --resume <source.txt> [--job <job.txt>] --out <response.md>");
  console.error("  node reference/ollama/ocf-local-llm.js --mode curation --model <ollama-model> --ocf <master.ocf.json> [--job <job.txt>] --out <response.md>");
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
