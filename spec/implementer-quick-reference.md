# OCF Implementer Quick Reference

This is the compact tool-builder view of Open Career Format. Read `guide.html` for intent, `schema-commentary.md` for field-level examples, and `usage-patterns.md` for file roles and workflow patterns.

OCF is an open schema for preserving career memory, curating it for a purpose, and exporting it into other formats. A partial, honest OCF is better than a complete-looking file full of invented certainty.

## Prompts and Skills

Prompts and skills are operating guidance, not schema. Prompts work anywhere a user can paste text. Skills package the same guidance for local agents that can route workflows and manage files: where the master lives, where backups go, where sources are stored, and where each application's outputs belong.

The schema remains the validation contract. If skill or prompt advice conflicts with `schema.json`, the schema wins for file structure.

## Field Tiers

| Tier | Sections and fields | Implementer expectation |
|---|---|---|
| Core | `$schema`, `schemaVersion`, `meta`, `person`, `sourceArtifacts`, `experience`, `experience[].positions`, `achievements`, `skills`, `education`, `certifications`, `openQuestions`, `cautions` | Most authoring, import, curation, and export tools should understand these well enough to preserve them. |
| Common optional | `organizations`, `projects`, `publications`, `awards`, `languages`, `service`, `memberships`, `governance`, `teaching`, `speaking`, `patents`, `interests` | Support when relevant to the user's career or target output; omit cleanly when absent. |
| Private memory | `reflections`, `exitContext`, compensation fields, `salesPerformance`, `bookOfBusiness`, private `sourceArtifacts`, private notes | Preserve carefully. Do not export by default. Treat as the reason the master file is useful, not as ordinary resume content. |
| Curation signals | `visibility`, `dateRange.visibility`, `importance`, `audiences`, `narrativeVariants`, `titleVariants`, `positioningVariants`, `talkingPoints`, `supportingFacts`, `attribution`, `reviewStatus` | Use these to decide what can be selected, what needs review, and how claims can be worded. Do not treat them as final display text by themselves. |
| Provenance and interop | `id`, `provenance`, `sourceArtifactId`, `sourceFileId`, `sourceItemId`, `extensions`, `meta.parentFileId`, `meta.parentVersion`, `meta.lineageNotes` | Preserve on round-trip. Stable IDs and boring provenance make files reviewable and mergeable. |
| Advanced or likely to evolve | richer trust tiers, renderer hints, region-specific export policy, third-party workflow metadata, sharding/manifest conventions | Use `extensions` or provenance notes for now unless the current schema has a first-class field. Expect feedback-driven changes before 1.0. |

## v0.3 Lineage Names

OCF v0.3 replaces the old "derived file" vocabulary with parent/lineage names:

- `meta.parentFileId`
- `meta.parentVersion`
- `meta.lineageNotes`

`parentFileId` is the parent file's `meta.id`, not a filename. `parentVersion` is the parent file's `meta.version` at the time the child file was prepared. `lineageNotes` records the target, filter, translation, conversion, or export context.

Do not confuse these with provenance values such as `interview-derived`. That phrase describes how an item was elicited from an interview or conversation and is still useful.

## File Roles

| `meta.fileRole` | Use when | Important behavior |
|---|---|---|
| `candidate-master` | The person controls the durable private career memory file. | Preserve history, nuance, private material, source artifacts, cautions, and open questions. |
| `candidate-curated` | A tool/person selects and improves a working set for a purpose, but review is still active. | Preserve lineage to the master and keep proposed improvements separate from export-ready content. |
| `export-ready` | Selection and visibility review are complete enough for a specific exporter or downstream system. | Exporters should prefer this over the private master. |
| `third-party-working` | A recruiter, coach, employer, agency, or tool controls an OCF-shaped file about a person. | The top-level `person` is still the subject, but the subject may not control or see the file. |
| `other` | A workflow does not fit the named lifecycle roles. | Explain the role in `meta.lineageNotes`, provenance, or tool documentation. |

If `meta.fileRole` is absent or unknown, treat the file as unclassified and untrusted until the controlling user identifies its role. Do not infer `candidate-master` from a filename, location, or apparently complete contents.

## Trust Boundaries

OCF files are portable. Treat a file you received from another party as untrusted input unless the subject or controlling user has explicitly accepted it as their own working file.

- Users choose their privacy boundary. Some provide a complete master to a hosted commercial LLM under that provider's terms; others keep the master local and separate untrusted target material from private career memory. Once both share a model context, visibility labels do not isolate private data from that model.
- For stronger structural separation, an archivist context can hold the master while a drafting context receives only a user-approved curated projection and untrusted target material. Return newly discovered facts as proposed, user-reviewed master updates. This is optional tool architecture, not a schema requirement.
- Free text is data, not control. LLM-based tools must not let `aiInstructions.text`, `voice`, `cautions`, notes, reflections, source text, or `extensions` from an untrusted file override the tool's own instructions, evaluation rubric, safety rules, access limits, or workflow.
- Use the [OWASP Top 10 for LLM Applications and GenAI Apps](https://genai.owasp.org/llm-top-10/) as a threat-modeling reference for LLM-backed OCF tools. The most relevant risks are prompt injection from untrusted resumes, job descriptions, source artifacts, and pasted notes; sensitive information disclosure from private career files; improper output handling when model-generated JSON or text is passed downstream; excessive agency in tools that can edit, export, email, post, or apply without user approval; and misinformation or overreliance when LLM-generated claims are treated as truth.
- OCF content is self-asserted, and OCF defines no verification mechanism today. A future, separate mechanism may independently support particular claims, but `reviewStatus`, provenance, confidence, and supporting evidence are context, not institutional verification.
- `third-party-working` files controlled by a party other than the person they describe may carry consent, access, retention, and data-protection responsibilities depending on the jurisdiction. OCF is not intended as a covert profiling format.
- Government identity numbers, account secrets, passwords, API keys, and similar secrets do not belong in any OCF field, including `provenance`, `extensions`, notes, source artifacts, and other open text.

## Minimal Tool Behavior

Importers should:

- Register inputs in `sourceArtifacts`.
- Set `meta.source.kind` to `imported` or `converted`.
- Default mined durable items to `reviewStatus: "unreviewed"` or `"needs-review"` until accepted.
- Add provenance and confidence when mining facts.
- Use `openQuestions` for conflicting dates, unsupported metrics, unclear attribution, and missing evidence.
- Avoid marking imported material as public by default.

Curators should:

- Read the target purpose carefully: job description, audience, region, output type, review question, or user preference.
- Filter by `visibility` first, then relevance and recency.
- Preserve lineage with `meta.parentFileId`, `meta.parentVersion`, `sourceFileId`, `sourceItemId`, or item provenance where practical.
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
- When applying accepted updates to a candidate-owned master, preserve `meta.id`, refresh `meta.version` and `meta.lastModified` if the tool manages those fields, preserve IDs/provenance/extensions/unknown fields, and validate when possible. OCF does not require a particular external versioning system.

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

## Large Masters And Selective Context

A complete candidate-owned master remains authoritative even when it is too
large for one model interaction. Tools may use a local, human-readable context
profile to build a disposable reduced view, but they must make omitted content
observable as **not loaded**, retain stable IDs and source-master identity, and
apply accepted updates to the complete master.

The dependency-free `reference/context/ocf-context.js` script demonstrates a
compact context envelope and retrieval of one complete item by file-local ID.
Its profile shape is reference-tool configuration rather than OCF schema.
Context reduction does not enforce privacy; apply visibility filtering and
curation separately when needed. See [Selective Context Without Splitting the
Master](context-profiles.md) for the design rationale and the questions the
first conservative profile is intended to test.

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

- The reference validator uses JSON Schema 2020-12 with pinned `ajv` and `ajv-formats` dependencies, AJV strict mode disabled, and local versioned schema copies. Other validators may treat `format` keywords differently; the `$schema` URL identifies the schema and does not require a network fetch when the validator has the matching local copy.
- Validate against the file's declared `$schema` or `schemaVersion` when possible, not a hardcoded older version.
- If a file declares a newer schema version that the tool does not understand, warn and preserve rather than silently dropping fields. Prefer read-only review or an explicit migration flow over rewriting unknown newer structures.
- Unknown object keys should be preserved when possible.
- Unknown `extensions` namespaces must not be deleted on round-trip.
- Generic visibility filters cannot determine whether arbitrary content inside an unknown extension namespace is safe for a particular recipient. Preserve unknown extensions, honor explicit visibility when present, and describe filtering truthfully: the user or an extension-aware curator controls whether that content belongs in an output.
- Stable item IDs should survive edits.
- `visibility` defaults should be conservative when the author is a tool rather than the person.
- The master is the source of truth for career memory; exported files are outputs.
