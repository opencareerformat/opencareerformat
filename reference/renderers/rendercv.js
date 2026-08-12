#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ALL_FORMATS = ["pdf", "typst", "markdown", "html", "png"];

function buildRenderArgs(inputPath, outputDir, options = {}) {
  const formats = new Set(options.formats || ALL_FORMATS);
  const stem = options.stem || path.basename(inputPath).replace(/\.(?:ya?ml)$/i, "");
  const args = ["render", path.resolve(inputPath), "--quiet"];

  const pathOptions = {
    pdf: ["--pdf-path", `${stem}.pdf`],
    typst: ["--typst-path", `${stem}.typ`],
    markdown: ["--markdown-path", `${stem}.md`],
    html: ["--html-path", `${stem}.html`],
    png: ["--png-path", `${stem}.png`],
  };
  const skipOptions = {
    pdf: "--dont-generate-pdf",
    typst: "--dont-generate-typst",
    markdown: "--dont-generate-markdown",
    html: "--dont-generate-html",
    png: "--dont-generate-png",
  };

  for (const format of ALL_FORMATS) {
    if (formats.has(format)) {
      const [flag, filename] = pathOptions[format];
      args.push(flag, path.resolve(outputDir, filename));
    } else {
      args.push(skipOptions[format]);
    }
  }
  if (options.theme) args.push("--design.theme", options.theme);
  return args;
}

function renderLocally(inputPath, outputDir, options = {}) {
  const binary = options.binary || process.env.RENDERCV_BIN || "rendercv";
  const args = buildRenderArgs(inputPath, outputDir, options);
  fs.mkdirSync(outputDir, { recursive: true });
  return spawnSync(binary, args, {
    encoding: "utf8",
    shell: false,
    stdio: options.capture ? "pipe" : "inherit",
  });
}

function parseArgs(args) {
  const positional = [];
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--theme") {
      options.theme = requiredValue(args, ++index, arg);
    } else if (arg === "--formats") {
      options.formats = requiredValue(args, ++index, arg).split(",").map((item) => item.trim()).filter(Boolean);
    } else if (arg === "--stem") {
      options.stem = requiredValue(args, ++index, arg);
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }
  if (positional.length !== 2) throw new Error("Expected an input YAML path and output directory.");
  if (options.formats && options.formats.length === 0) throw new Error("--formats requires at least one output format.");
  const invalid = (options.formats || []).filter((format) => !ALL_FORMATS.includes(format));
  if (invalid.length) throw new Error(`Unknown output format: ${invalid.join(", ")}`);
  if (options.stem && !/^[A-Za-z0-9._-]+$/.test(options.stem)) {
    throw new Error("--stem may contain only letters, numbers, dots, underscores, and hyphens.");
  }
  return { inputPath: positional[0], outputDir: positional[1], ...options };
}

function requiredValue(args, index, option) {
  const value = args[index];
  if (!value || value.startsWith("--")) throw new Error(`${option} requires a value.`);
  return value;
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    console.error("Usage: node reference/renderers/rendercv.js <input.yaml> <output-dir> [--theme classic] [--formats pdf,html,png] [--stem resume]");
    process.exit(2);
  }

  const result = renderLocally(options.inputPath, options.outputDir, options);
  if (result.error?.code === "ENOENT") {
    console.error("RenderCV is not installed or not on PATH. Install it locally, or set RENDERCV_BIN to its executable path.");
    process.exit(127);
  }
  if (result.error) {
    console.error(`Unable to run RenderCV: ${result.error.message}`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

if (require.main === module) main();

module.exports = { ALL_FORMATS, buildRenderArgs, parseArgs, renderLocally };
