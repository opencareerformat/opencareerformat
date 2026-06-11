#!/usr/bin/env node

const fs = require("fs");

const markdown = fs.readFileSync("spec/examples/worked-example-walkthrough.md", "utf8");
const sample = JSON.parse(fs.readFileSync("spec/examples/sample-resume.ocf.json", "utf8"));

const jsonBlocks = [...markdown.matchAll(/```json\n([\s\S]*?)\n```/g)].map((match) => JSON.parse(match[1]));

const position = sample.experience
  .find((entry) => entry.name === "Meridian Health Systems")
  .positions.find((item) => item.title === "Director of Cybersecurity");
const achievement = position.achievements.find((item) => item.id === "mhs-ransomware-2024");
const story = position.reflections.find((item) => item.kind === "never-on-resume-story");
const talkingPoint = sample.extensions["user.local"].candidateTalkingPoints.find(
  (item) => item.id === "authority-from-demonstrated-work",
);
const caution = sample.cautions.find((item) => item.claim === "claimed as an AI / ML security specialist");

const achievementSnippet = jsonBlocks.find((block) => block.id === "mhs-ransomware-2024");
assert(achievementSnippet, "missing achievement snippet");
assertEqual(achievementSnippet.statement, achievement.statement, "achievement statement drifted");
assertEqual(achievementSnippet.metrics, achievement.metrics, "achievement metrics drifted");
assertEqual(achievementSnippet.provenance.source, achievement.provenance.source, "achievement provenance source drifted");
assertEqual(
  achievementSnippet.provenance.sessionTopic,
  achievement.provenance.sessionTopic,
  "achievement provenance sessionTopic drifted",
);

const fanoutSnippet = jsonBlocks.find((block) => Array.isArray(block.skills));
assert(fanoutSnippet, "missing fanout snippet");
assertEqual(fanoutSnippet.skills, achievement.skills, "skill fanout drifted");
for (const variant of fanoutSnippet.narrativeVariants) {
  const actual = achievement.narrativeVariants.find((item) => item.id === variant.id);
  assert(actual, `missing actual narrative variant ${variant.id}`);
  for (const key of Object.keys(variant)) {
    assertEqual(variant[key], actual[key], `narrative variant ${variant.id}.${key} drifted`);
  }
}
assertEqual(fanoutSnippet.cautions[0].claim, caution.claim, "caution claim drifted");
assertEqual(fanoutSnippet.cautions[0].reason, caution.reason, "caution reason drifted");

const storySnippet = jsonBlocks.find((block) => block.kind === "never-on-resume-story");
assert(storySnippet, "missing story snippet");
for (const key of ["kind", "text", "visibility"]) {
  assertEqual(storySnippet[key], story[key], `story ${key} drifted`);
}
for (const key of ["source", "date", "sessionTopic", "operation"]) {
  assertEqual(storySnippet.provenance[key], story.provenance[key], `story provenance ${key} drifted`);
}

const talkingPointSnippet = jsonBlocks.find((block) => block.extensions?.["user.local"]);
assert(talkingPointSnippet, "missing talking point snippet");
const snippetTalkingPoint = talkingPointSnippet.extensions["user.local"].candidateTalkingPoints[0];
for (const key of ["id", "label", "statement", "visibility"]) {
  assertEqual(snippetTalkingPoint[key], talkingPoint[key], `talking point ${key} drifted`);
}
assertEqual(snippetTalkingPoint.supportingItemIds, talkingPoint.supportingItemIds, "talking point supportingItemIds drifted");
for (const key of ["source", "reviewStatus", "operation"]) {
  assertEqual(
    snippetTalkingPoint.provenance[key],
    talkingPoint.provenance[key],
    `talking point provenance ${key} drifted`,
  );
}

console.log("worked example snippets: PASS");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`${message}\nactual: ${actualJson}\nexpected: ${expectedJson}`);
  }
}
