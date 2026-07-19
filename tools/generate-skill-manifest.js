#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const skillsDir = path.join(root, "skills");
const outputPath = path.join(skillsDir, "manifest.json");

const skills = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(skillsDir, name, "SKILL.md")))
  .sort();

const manifest = {
  manifestVersion: 1,
  skills: {},
};

for (const name of skills) {
  const relativePath = `skills/${name}/SKILL.md`;
  const contents = fs.readFileSync(path.join(root, relativePath));
  const text = contents.toString("utf8");
  const updatedMatch = text.match(/^Last updated:\s*(\d{4}-\d{2}-\d{2})/m);

  if (!updatedMatch) {
    throw new Error(`${relativePath} is missing a YYYY-MM-DD Last updated value`);
  }

  manifest.skills[name] = {
    path: relativePath,
    url: `https://opencareerformat.org/${relativePath}`,
    lastUpdated: updatedMatch[1],
    sha256: crypto.createHash("sha256").update(contents).digest("hex"),
  };
}

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${path.relative(root, outputPath)} (${skills.length} skills)`);
