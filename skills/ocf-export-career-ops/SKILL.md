---
name: ocf-export-career-ops
description: Use when a user wants to create or update a Career-Ops workspace from an Open Career Format file, export OCF career memory into Career-Ops user-layer files, seed cv.md/profile/story-bank files, or provide job-search overlay settings that OCF should not store.
---

# OCF Export Career-Ops

Status: current<br>
Last updated: 2026-07-13<br>
Compatible schema versions: OCF 0.3

Create or update a local Career-Ops workspace from an OCF file. This is a filesystem workflow, not a schema change.

Career-Ops is a local job-search workspace. OCF is durable career memory. The integration should let the user bring OCF evidence into Career-Ops without making either project absorb the other.

## Choose The Integration Path

When this work is running inside Career-Ops and `career-ops-plugin-ocf` is installed, use that plugin's pinned skill and utilities. The plugin owns the Career-Ops-native connector contract, its supported OCF compatibility slice, and its tested Career-Ops file shapes.

Use this OCF-native skill for a direct one-way bootstrap when the plugin is unavailable or the user explicitly wants to export from an OCF workspace into Career-Ops files. If the primary goal is to improve the OCF file itself, use OCF-native authoring, curation, and validation workflows first; Career-Ops can read the reviewed OCF later.

Do not combine live OCF guidance with an installed plugin's pinned behavior during an ordinary Career-Ops run. Updating that behavior is plugin development and should produce a tested plugin release.

## Boundaries

- Do not write transient job-search preferences back to the OCF master unless the user explicitly asks.
- Do not treat Career-Ops pipeline files, reports, scores, or generated PDFs as OCF career facts.
- Do not overwrite existing Career-Ops user-layer files without confirmation.
- Do not export `private` OCF content unless the user explicitly approves it for this Career-Ops workspace.
- Prefer an export-ready or candidate-curated OCF file. A candidate master may be used, but the export must still filter visibility and should be described as a broad working view, not a sent resume.

## Inputs

Establish:

1. OCF source file: preferably `candidate-curated` or `export-ready`; otherwise the user's master with visibility filtering.
2. Career-Ops workspace: existing folder or new folder.
3. Search track: what type of role this Career-Ops workspace is aiming for.
4. Search overlay: operational preferences Career-Ops needs now but OCF usually should not preserve as durable career facts.

Ask early:

> What type of role should this Career-Ops workspace aim for?

Examples: customer success leadership, cybersecurity director, solutions consulting, product operations, federal roles, healthcare security, startup operator, or another track. If the user has multiple tracks, create or recommend separate Career-Ops workspaces or clearly separate output folders rather than blending them into one ambiguous `cv.md`.

Use the role track when choosing OCF variants. Prefer `positioningVariants`, `narrativeVariants`, `titleVariants`, and `talkingPoints` whose audience, target role, use, or notes fit the track. Do not collapse competing variants into one generic wording. If two variants both fit different plausible tracks, ask which one this Career-Ops workspace should optimize for.

If the OCF workspace is known from `ocf-setup`, suggest a sibling folder:

```text
career/
  ocf/
  sources/
  outputs/
  career-ops/
```

If the user prefers to keep Career-Ops under a specific application output folder, that is acceptable, but default to a sibling workspace because Career-Ops is an ongoing job-search workspace, not one exported resume.

## Inspect The Target Workspace

Before writing, inspect the Career-Ops workspace lightly:

- examples or templates supplied by Career-Ops;
- existing user-layer files such as `cv.md`, `config/profile.yml`, `modes/_profile.md`, `interview-prep/story-bank.md`, `article-digest.md`, `writing-samples/`, and `jds/`;
- any README, data contract, or setup notes that describe expected file shape.

Do not copy Career-Ops templates into OCF. Use the local workspace's examples/templates as the target contract. If the installed Career-Ops version expects a different filename or shape than this skill names, adapt to the local workspace and tell the user what changed.

## What To Write

Generate or update only Career-Ops user-layer files.

Common targets:

- `cv.md`: a broad Career-Ops CV source, not a two-page human resume. Include every visible role, skill, and achievement that plausibly matches the search track. Keep it factual and reviewable.
- `config/profile.yml`: identity and current search overlay. Populate durable OCF facts where available; ask for transient operational preferences when Career-Ops needs them.
- `modes/_profile.md`: track-specific positioning, voice, cautions, talking points, and operating guidance.
- `interview-prep/story-bank.md`: visible or explicitly approved reflections and interview-oriented talking points.
- `article-digest.md`: high-evidence proof points, metrics, and supporting facts.
- `jds/`: only selected job descriptions relevant to this Career-Ops workspace. Do not turn OCF into a bulk JD archive.

If a file already exists, summarize the intended change and ask before overwriting. Prefer creating a dated backup or a proposed file next to it when the user has not confirmed replacement.

## Search Overlay Questions

OCF does not normally store some Career-Ops configuration values because they are transient, sensitive, or specific to the current search. Ask only what the target Career-Ops workspace needs now, after the role track is clear.

Possible overlay fields:

- expected compensation range;
- remote, hybrid, on-site, relocation, and travel preferences;
- target locations or excluded locations;
- preferred or excluded industries;
- role level, function, company stage, or work style preferences;
- dealbreakers and must-haves;
- job-search urgency or availability.

Phrase these as workflow questions, not OCF updates:

> Career-Ops can use expected compensation to filter or score roles. Do you want that in this Career-Ops workspace config, or should I leave it blank?

If the user wants a transient preference saved back to OCF, propose it separately as a reviewed goal/preference update with visibility and provenance.

## Export Shape

Default to a broad Career-Ops source file, not a concise resume:

- include more relevant visible evidence than a human resume would;
- include older but still relevant roles when they match the search;
- prefer audience-specific variants that fit the role track;
- preserve enough context for Career-Ops to evaluate and tailor later;
- exclude private material by default;
- avoid unsupported claims, invented metrics, or inflated verbs.

If the user asks for a normal resume instead, route to OCF curation/export rather than this skill.

## Workflow

1. Locate the OCF file and Career-Ops workspace.
2. Inspect local Career-Ops examples/templates and existing user-layer files.
3. Read the OCF file and relevant mapping guidance in `mappings/career-ops.md` if available.
4. Ask what type of role this Career-Ops workspace should aim for, unless the user has already made the track clear.
5. Confirm whether to use a broad Career-Ops CV source or a narrower curated view for that track.
6. Ask for missing search overlay fields or choose placeholders when the user prefers not to answer.
7. Draft the target files.
8. Show a file-by-file summary before writing.
9. Write only after confirmation; preserve or back up existing user-layer files.
10. Summarize what came from OCF, what came from the track/overlay answers, and what was left blank.

## Final Response Checklist

Report:

- OCF source file used;
- Career-Ops workspace path;
- target role track;
- user-layer files created or updated;
- overlay fields supplied by the user;
- placeholders left for the user to fill;
- any Career-Ops expected files the skill did not know how to populate;
- confirmation that OCF master content was not modified unless the user explicitly asked.
