#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const markdown = fs.readFileSync(path.join(repoRoot, "spec/examples/maria-reyes/inside-the-ocf.md"), "utf8");
const initialSample = JSON.parse(fs.readFileSync(path.join(repoRoot, "spec/examples/maria-reyes/maria-reyes-revision-1.ocf.json"), "utf8"));
const previousSample = JSON.parse(fs.readFileSync(path.join(repoRoot, "spec/examples/maria-reyes/maria-reyes-revision-6.ocf.json"), "utf8"));
const sample = JSON.parse(fs.readFileSync(path.join(repoRoot, "spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json"), "utf8"));

const jsonBlocks = [...markdown.matchAll(/```json\n([\s\S]*?)\n```/g)].map((match) => JSON.parse(match[1]));

const position = sample.experience
  .find((entry) => entry.name === "Meridian Health Systems")
  .positions.find((item) => item.title === "Director of Cybersecurity");
const achievement = position.achievements.find((item) => item.id === "mhs-ransomware-2024");
const story = position.reflections.find((item) => item.kind === "never-on-resume-story");
const talkingPoint = sample.talkingPoints.find((item) => item.id === "authority-from-demonstrated-work");
const positioningVariants = sample.positioningVariants;
const caution = sample.cautions.find((item) => item.claim === "claimed as an AI / ML security specialist");
const army = sample.experience.find((entry) => entry.name === "United States Army");
const armyCyberPosition = army.positions.find((item) => item.occupationalCode?.code === "17C");
const armyCyberLead = armyCyberPosition.achievements.find((item) =>
  item.narrativeVariants?.some((variant) => variant.id === "army-cyber-lead-civilian"),
);
const armyRankProgression = army.spanning.find((item) => item.id === "army-rank-progression");

const initialPosition = initialSample.experience
  .find((entry) => entry.name === "Meridian Health Systems")
  .positions.find((item) => item.title === "Director of Cybersecurity");
const initialAchievement = initialPosition.achievements.find((item) => item.id === "mhs-ransomware-2024");
const initialAchievementSnippet = jsonBlocks.find((block) =>
  block.id === "mhs-ransomware-2024" && block.reviewStatus === "unreviewed"
);
assert(initialAchievementSnippet, "missing revision 1 achievement snippet");
for (const key of Object.keys(initialAchievementSnippet)) {
  assertEqual(initialAchievementSnippet[key], initialAchievement[key], `revision 1 achievement ${key} drifted`);
}

const initialQuestion = initialSample.openQuestions.find((item) => item.id === "open-question-vulnerability-management-ownership");
const initialQuestionSnippet = jsonBlocks.find((block) => block.id === initialQuestion.id);
assert(initialQuestionSnippet, "missing revision 1 open-question snippet");
for (const key of Object.keys(initialQuestionSnippet)) {
  assertEqual(initialQuestionSnippet[key], initialQuestion[key], `revision 1 open question ${key} drifted`);
}

const canonicalSnippets = jsonBlocks.filter((block) => block.person?.summary && Array.isArray(block.competencies));
assertEqual(canonicalSnippets.length, 2, "expected revision 6 and revision 7 canonical-field snippets");
for (const [snippet, document, version] of [
  [canonicalSnippets[0], previousSample, "6"],
  [canonicalSnippets[1], sample, "7"],
]) {
  const competency = document.competencies.find((item) => item.label === "Leadership & Cross-Functional Communication");
  assertEqual(snippet.person.summary, document.person.summary, `revision ${version} summary drifted`);
  assertEqual(snippet.competencies[0].label, competency.label, `revision ${version} competency label drifted`);
  assertEqual(snippet.competencies[0].description, competency.description, `revision ${version} competency description drifted`);
}

const fedrampSnippet = jsonBlocks.find((block) => block.id === "mhs-fedramp-security-operations-workstream");
const fedrampAchievement = position.achievements.find((item) => item.id === "mhs-fedramp-security-operations-workstream");
assertEqual(fedrampSnippet, fedrampAchievement, "FedRAMP achievement snippet drifted");

const fedrampCautionSnippet = jsonBlocks.find((block) => block.id === "caution-led-entire-fedramp-authorization");
const fedrampCaution = sample.cautions.find((item) => item.id === "caution-led-entire-fedramp-authorization");
assertEqual(fedrampCautionSnippet, fedrampCaution, "FedRAMP caution snippet drifted");

const sourceArtifactSnippet = jsonBlocks.find((block) => Array.isArray(block.sourceArtifacts));
assert(sourceArtifactSnippet, "missing Conversation Seven source-artifact snippet");
for (const artifact of sourceArtifactSnippet.sourceArtifacts) {
  const actual = sample.sourceArtifacts.find((item) => item.id === artifact.id);
  assert(actual, `missing actual source artifact ${artifact.id}`);
  assertEqual(artifact, actual, `source artifact ${artifact.id} drifted`);
}

for (const version of ["1", "6", "7"]) {
  const metaSnippet = jsonBlocks.find((block) => block.meta?.version === version);
  const document = version === "1" ? initialSample : version === "6" ? previousSample : sample;
  assert(metaSnippet, `missing revision ${version} metadata snippet`);
  for (const key of Object.keys(metaSnippet.meta)) {
    assertEqual(metaSnippet.meta[key], document.meta[key], `revision ${version} meta.${key} drifted`);
  }
}

const achievementSnippet = jsonBlocks.find((block) =>
  block.id === "mhs-ransomware-2024" && block.provenance?.source === "interview-derived"
);
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
const cautionSnippet = jsonBlocks.find((block) => Array.isArray(block.cautions));
assert(cautionSnippet, "missing top-level caution snippet");
assertEqual(cautionSnippet.cautions[0].claim, caution.claim, "caution claim drifted");
assertEqual(cautionSnippet.cautions[0].reason, caution.reason, "caution reason drifted");

const armyProgressionSnippet = jsonBlocks.find((block) => block.id === "army-rank-progression");
assert(armyProgressionSnippet, "missing Army progression snippet");
for (const key of ["id", "kind", "statement", "visibility"]) {
  assertEqual(armyProgressionSnippet[key], armyRankProgression[key], `Army progression ${key} drifted`);
}
for (const fact of armyProgressionSnippet.supportingFacts) {
  const actual = armyRankProgression.supportingFacts.find((item) => item.id === fact.id);
  assert(actual, `missing actual Army progression supporting fact ${fact.id}`);
  assertEqual(fact, actual, `Army progression supporting fact ${fact.id} drifted`);
}
assertEqual(armyProgressionSnippet.provenance, armyRankProgression.provenance, "Army progression provenance drifted");

const armyVariantSnippet = jsonBlocks.find((block) =>
  block.narrativeVariants?.some((variant) => variant.id === "army-cyber-lead-civilian"),
);
assert(armyVariantSnippet, "missing Army narrative variants snippet");
assertEqual(
  armyVariantSnippet.narrativeVariants,
  armyCyberLead.narrativeVariants,
  "Army narrative variants snippet drifted",
);

const storySnippet = jsonBlocks.find((block) => block.kind === "never-on-resume-story");
assert(storySnippet, "missing story snippet");
for (const key of ["kind", "text", "visibility"]) {
  assertEqual(storySnippet[key], story[key], `story ${key} drifted`);
}
for (const key of ["source", "date", "sessionTopic", "operation"]) {
  assertEqual(storySnippet.provenance[key], story.provenance[key], `story provenance ${key} drifted`);
}

const talkingPointSnippet = jsonBlocks.find((block) => Array.isArray(block.talkingPoints));
assert(talkingPointSnippet, "missing talking point snippet");
const snippetTalkingPoint = talkingPointSnippet.talkingPoints[0];
for (const key of ["id", "label", "statement", "visibility"]) {
  assertEqual(snippetTalkingPoint[key], talkingPoint[key], `talking point ${key} drifted`);
}
assertEqual(snippetTalkingPoint.reviewStatus, talkingPoint.reviewStatus, "talking point reviewStatus drifted");
assertEqual(snippetTalkingPoint.uses, talkingPoint.uses, "talking point uses drifted");
assertEqual(snippetTalkingPoint.supportingItemIds, talkingPoint.supportingItemIds, "talking point supportingItemIds drifted");
assertEqual(
  snippetTalkingPoint.supportingEvidence,
  talkingPoint.supportingEvidence,
  "talking point supportingEvidence drifted",
);
assertEqual(
  snippetTalkingPoint.evidenceSummary,
  talkingPoint.evidenceSummary,
  "talking point evidenceSummary drifted",
);
for (const key of ["source", "operation"]) {
  assertEqual(
    snippetTalkingPoint.provenance[key],
    talkingPoint.provenance[key],
    `talking point provenance ${key} drifted`,
  );
}

const positioningSnippet = jsonBlocks.find((block) => Array.isArray(block.positioningVariants));
assert(positioningSnippet, "missing positioning variants snippet");
assertEqual(
  positioningSnippet.positioningVariants.length,
  positioningVariants.length,
  "positioning variants snippet length drifted",
);
for (const variant of positioningSnippet.positioningVariants) {
  const actual = positioningVariants.find((item) => item.id === variant.id);
  assert(actual, `missing actual positioning variant ${variant.id}`);
  for (const key of Object.keys(variant)) {
    assertEqual(variant[key], actual[key], `positioning variant ${variant.id}.${key} drifted`);
  }
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
