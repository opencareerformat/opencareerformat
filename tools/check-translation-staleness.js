#!/usr/bin/env node

const fs = require("fs");
const { execFileSync } = require("child_process");

const localizedDocs = [
  {
    localized: "README.es.md",
    source: "README.md",
    stamp: /Fuente canónica:\s+\[`README\.md`\]\(README\.md\), commit `([0-9a-f]+)`/,
    kind: "translation",
  },
  {
    localized: "index.es.html",
    source: "index.html",
    stamp: /Fuente canónica:\s+<a href="\/">index\.html<\/a>, commit <code>([0-9a-f]+)<\/code>/,
    kind: "translation",
  },
  {
    localized: "prompts/application-bootstrap.es.md",
    source: "prompts/application-bootstrap.md",
    stamp: /canonicalPromptCommit:\s*([0-9a-f]+)/,
    kind: "wrapper",
  },
  {
    localized: "spec/examples/worked-example-walkthrough.es.md",
    source: "spec/examples/worked-example-walkthrough.md",
    stamp: /Fuente canónica:\s+\[`worked-example-walkthrough\.md`\]\(worked-example-walkthrough\.md\), commit `([0-9a-f]+)`/,
    kind: "translation",
  },
];

const failures = [];

for (const item of localizedDocs) {
  if (!fs.existsSync(item.localized)) {
    failures.push(`${item.localized}: missing localized file`);
    continue;
  }
  if (!fs.existsSync(item.source)) {
    failures.push(`${item.localized}: missing canonical source ${item.source}`);
    continue;
  }

  const text = fs.readFileSync(item.localized, "utf8");
  const match = text.match(item.stamp);
  if (!match) {
    failures.push(`${item.localized}: missing canonical source commit stamp`);
    continue;
  }

  const stampedCommit = match[1];
  const resolvedStampedCommit = resolveCommit(stampedCommit);
  if (!resolvedStampedCommit) {
    failures.push(`${item.localized}: stamped commit ${stampedCommit} is not present in git history`);
    continue;
  }

  const sourceCommit = latestCommitForPath(item.source);
  const localizedCommit = latestCommitForPath(item.localized);
  const sourceChangedInWorktree = hasUncommittedChanges(item.source);
  const localizedChangedInWorktree = hasUncommittedChanges(item.localized);
  if (!sourceCommit) {
    failures.push(`${item.localized}: no git history found for source ${item.source}`);
    continue;
  }
  if (!localizedCommit) {
    failures.push(`${item.localized}: no git history found for localized file`);
    continue;
  }

  if (sourceChangedInWorktree) {
    failures.push(
      `${item.localized}: ${item.source} has uncommitted changes; commit the canonical source first, then review the localized file against that committed version`,
    );
    continue;
  }

  if (resolvedStampedCommit !== sourceCommit) {
    failures.push(
      `${item.localized}: stamped source commit ${stampedCommit} does not match latest ${item.source} commit ${shortCommit(sourceCommit)}`,
    );
    continue;
  }

  if (!localizedChangedInWorktree && !isAncestor(sourceCommit, localizedCommit)) {
    const noun = item.kind === "wrapper" ? "localized wrapper" : "translation";
    failures.push(
      `${item.localized}: ${item.source} changed in ${sourceCommit} after the ${noun}'s latest update ${localizedCommit}`,
    );
  }
}

if (failures.length > 0) {
  console.error("localized doc staleness check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("localized docs staleness: PASS");

function latestCommitForPath(filePath) {
  return git(["log", "-1", "--format=%H", "--", filePath]).trim();
}

function resolveCommit(commit) {
  try {
    return git(["rev-parse", `${commit}^{commit}`]).trim();
  } catch {
    return null;
  }
}

function isAncestor(ancestor, descendant) {
  try {
    git(["merge-base", "--is-ancestor", ancestor, descendant]);
    return true;
  } catch {
    return false;
  }
}

function hasUncommittedChanges(filePath) {
  return git(["diff", "--name-only", "HEAD", "--", filePath]).trim().length > 0;
}

function shortCommit(commit) {
  return commit.slice(0, 7);
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}
