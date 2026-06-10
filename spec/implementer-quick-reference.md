# OCF Implementer Quick Reference

This is the compact tool-builder view of Open Career Format. Read `guide.html` for intent, `schema-commentary.md` for field-level examples, and `usage-patterns.md` for file roles and workflow patterns.

OCF is an open schema for preserving career memory, curating it for a purpose, and exporting it into other formats. A partial, honest OCF is better than a complete-looking file full of invented certainty.

## Field Tiers

| Tier | Sections and fields | Implementer expectation |
|---|---|---|
| Core | `$schema`, `schemaVersion`, `meta`, `person`, `sourceArtifacts`, `experience`, `experience[].positions`, `achievements`, `skills`, `education`, `certifications`, `openQuestions`, `cautions` | Most authoring, import, curation, and export tools should understand these well enough to preserve them. |
| Common optional | `organizations`, `projects`, `publications`, `awards`, `languages`, `service`, `memberships`, `governance`, `teaching`, `speaking`, `patents`, `interests` | Support when relevant to the user's career or target output; omit cleanly when absent. |
| Private memory | `reflections`, `exitContext`, compensation fields, `salesPerformance`, `bookOfBusiness`, private `sourceArtifacts`, private notes | Preserve carefully. Do not export by default. Treat as the reason the master file is useful, not as ordinary resume content. |
| Curation signals | `visibility`, `importance`, `audiences`, `narrativeVariants`, `titleVariants`, `supportingFacts`, `attribution`, `dateIsPrivate` | Use these to decide what can be selected, what needs review, and how claims can be worded. Do not treat them as final display text by themselves. |
| Provenance and interop | `id`, `provenance`, `sourceArtifactId`, `sourceFileId`, `sourceItemId`, `extensions`, `meta.derivedFrom`, `meta.derivedFromVersion`, `meta.derivationNotes` | Preserve on round-trip. Stable IDs and boring provenance make files reviewable and mergeable. |
| Advanced or likely to evolve | verification/review lifecycle, richer trust tiers, renderer hints, region-specific export policy, third-party workflow metadata | Use `extensions` or provenance notes for now unless the current schema has a first-class field. Expect feedback-driven changes before 1.0. |

## v0.2 Compatibility Names Replaced In v0.3

OCF v0.2 still contains a few schema names from the earlier "derived file" vocabulary:

- `meta.derivedFrom`
- `meta.derivedFromVersion`
- `meta.derivationNotes`
- `meta.source.kind: "derived"`

Tools should preserve and read these fields for v0.2 compatibility. New documentation should describe the workflow as curation and export-ready preparation, not derivation. v0.3 should replace these fields and enum values with names that match the current language directly.

Do not confuse these with provenance values such as `interview-derived`. That phrase describes how an item was elicited from an interview or conversation and is still useful.

## File Roles

| `meta.fileRole` | Use when | Important behavior |
|---|---|---|
| `candidate-master` | The person controls the durable private career memory file. | Preserve history, nuance, private material, source artifacts, cautions, and open questions. |
| `imported-starter` | A tool creates a provisional first pass from resumes, LinkedIn exports, notes, photos, or transcripts. | Keep it visibly provisional. Do not name it `*.master.ocf.json` until reviewed and accepted. |
| `candidate-curated` | A tool/person selects and improves a working set for a purpose, but review is still active. | Preserve lineage to the master and keep proposed improvements separate from export-ready content. |
| `export-ready` | Selection and visibility review are complete enough for a specific exporter or downstream system. | Exporters should prefer this over the private master. |
| `third-party-working` | A recruiter, coach, employer, agency, or tool controls an OCF-shaped file about a person. | The top-level `person` is still the subject, but the subject may not control or see the file. |

## Minimal Tool Behavior

Importers should:

- Register inputs in `sourceArtifacts`.
- Create `imported-starter` files when the user has not accepted the result as a master.
- Add provenance and confidence when mining facts.
- Use `openQuestions` for conflicting dates, unsupported metrics, unclear attribution, and missing evidence.
- Avoid marking imported material as public by default.

Curators should:

- Read the target purpose carefully: job description, audience, region, output type, review question, or user preference.
- Filter by `visibility` first, then relevance and recency.
- Preserve lineage with `meta.derivedFrom`, `sourceFileId`, `sourceItemId`, or item provenance where practical.
- Produce proposed OCF improvements separately from export-ready content.
- Be explicit about what was removed, skipped, or left unresolved.
- Label reduced files as `candidate-curated` or `export-ready`, not `candidate-master`. A subset may discover improvements for the master, but those should be proposed back with provenance rather than replacing the master.

Exporters should:

- Prefer `export-ready` input.
- Never include `private` items unless the user explicitly chose a private recipient-specific output.
- Treat JSON Resume, LinkedIn, Schema.org, LER-RS, vCard, PDF, and DOCX as lossy targets.
- Emit review warnings when the input is not export-ready or when important OCF concepts cannot be represented.

Editors should:

- Make unsupported schema sections visible as unsupported instead of implying full coverage.
- Preserve unknown fields, `extensions`, IDs, and provenance on round-trip.
- Distinguish untouched imported material from user-reviewed material where possible.

## Local Validation

OCF includes a local reference validator in `reference/validator/`. Prefer local
validation because OCF files often contain private career data.

Install validator dependencies once:

```bash
npm --prefix reference/validator ci
```

Validate one or more files from the repository root:

```bash
node reference/validator/validate.js path/to/file.ocf.json
```

With no file arguments, the validator checks every JSON file in `spec/examples/`
against `spec/schema.json`.

Validation checks structure only. It does not verify whether claims are true,
whether private content is safe to share, or whether a file is appropriate for a
specific export or recipient.

## Naming Conventions

OCF does not force filenames. Human-readable names make workflows easier to inspect.

Examples:

- `david-madeo.master.ocf.json`
- `david-madeo-sona-2026-05-24.imported.ocf.json`
- `sona-head-of-enablement.candidate-curated.ocf.json`
- `sona-head-of-enablement.export-ready.ocf.json`
- `sona-head-of-enablement.resume.json`

Use directory structure if it helps: `imports/`, `curated/`, `exports/`, `archive/`.

## Compatibility Rules

- Unknown object keys should be preserved when possible.
- Unknown `extensions` namespaces must not be deleted on round-trip.
- Stable item IDs should survive edits.
- `visibility` defaults should be conservative when the author is a tool rather than the person.
- The master is the source of truth for career memory; exported files are outputs.
