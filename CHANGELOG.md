# Changelog

All notable changes to the Open Career Format specification and reference implementations will be documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

OCF follows relaxed semver in the 0.x series — small breaking changes are documented here but possible between minor versions. From v1.0 onward, minor versions are additive only.

## [Unreleased]

## [0.3.0] — 2026-06-15

This is a clean-language schema update. It includes small breaking changes from v0.2; old files should be migrated before validating against v0.3.

### Breaking changes

- Removed `meta.fileRole: "imported-starter"`. A first-pass file that is becoming the user's working career memory should use `meta.fileRole: "candidate-master"` with imported or LLM-mined durable items marked `reviewStatus: "unreviewed"` or `"needs-review"` until accepted.
- Removed overlapping `meta.variant` and `meta.canonical` fields. Use `meta.fileRole` as the single file lifecycle/control field; use `targetRole`, `targetCompany`, `parentFileId`, `parentVersion`, and `lineageNotes` for targeted child files.
- Replaced the earlier derived-file lineage names: `meta.derivedFrom` -> `meta.parentFileId`, `meta.derivedFromVersion` -> `meta.parentVersion`, and `meta.derivationNotes` -> `meta.lineageNotes`.
- Removed lifecycle-like `meta.source.kind` values such as `derived`; use `fileRole` plus `parentFileId`, `parentVersion`, and `lineageNotes` for curation/export lineage. `source.kind` now records origin mechanics such as `authored`, `imported`, `converted`, `merged`, or `translated`.
- Removed legacy scalar subject contact fields: `person.email`, `person.phone`, `person.linkedin`, `person.github`, and `person.website`. Also removed single-contact and LinkedIn scalar shortcuts from references and supervisors. Use the relevant `contacts[]` array with explicit `kind`, `value`, and `visibility` for contact methods.
- Changed `aiInstructions` from a bare string to an object with `text` and `visibility` so generic visibility filters can remove it without field-name inference.
- Replaced companion visibility fields (`legalNameVisibility`, `photoVisibility`, `dateOfBirthVisibility`, `nationalityVisibility`, `maritalStatusVisibility`, `genderVisibility`, and `notesVisibility`) with object-valued fields that carry their own `visibility`.
- Replaced `dateRange.dateIsPrivate` with `dateRange.visibility`, defaulting to `shared`, so date suppression uses the same visibility mechanism as other private-capable objects.

### Added

- Added item-level `reviewStatus` for durable user-facing and user-quoted material. Tools should treat missing `reviewStatus` on imported, inferred, or LLM-mined durable items as `unreviewed`.
- Added top-level `talkingPoints` for reusable, evidence-backed career framings. Existing incubating `extensions.user.local.candidateTalkingPoints` items should migrate here.
- Added top-level `positioningVariants` for target-aware person-level headlines and summaries. `person.headline` remains the default general headline.
- Added `supersededById` alongside item review fields so superseded items can point to their replacement.
- Added optional IDs to more durable array items so tools can make more surgical updates and cross-references.
- Clarified that `supportingItemIds` values must resolve to stable local item IDs, and that tools should validate referential integrity even when JSON Schema cannot.
- Added `co-led` to achievement attribution roles.
- Added `job-description`, `photo`, `video`, and `conversation` source artifact kinds, plus metric visibility.
- Added `location.renderAs` and `person.workAuthorization[].renderAs` so files can preserve resume-ready display strings alongside structured values.
- Added explicit `visibility` to contact objects so generic tools can filter contact methods without inferring privacy from field names.
- Added explicit `visibility` to location objects and the top-level `voice` object.
- Added `v0.3/schema.json` as a version-pinned schema copy.

### Changed

- Aligned `schema-core.json` with the full schema as a strict minimal subset rather than a starter dialect.
- Updated examples, prompts, reference scripts, and generated docs for the current schema shape.
- Removed the experimental Next.js reference editor to reduce dependency and maintenance surface; the reference path is now validator, importer, curator, exporters, local LLM example, and minimal CLI helper.
- Reference importer, curator, validator, and local LLM scripts now read the current schema version from `spec/schema.json` where practical instead of hard-coding release strings.
- Added `spec/usage-patterns.md` and updated the guide, README, prompts, starter/core schema, and examples to clarify that a candidate-owned master is one important OCF use case, not the only possible OCF file role. The top-level `person` is the subject of the OCF; the controller of the file and editors of individual items may be different.
- Added optional `achievement.attribution` to capture the subject's role in an outcome (`owned`, `led`, `co-led`, `drove`, `contributed-to`, `supported`, `advised`, `observed`, `other`) plus optional budget/headcount/upward-reporting context.
- Reframed reflections as a private review and conversation layer, with interview prep as one use case rather than the whole concept.
- Moved active LLM and coaching prompts from `spec/` to top-level `prompts/` paths (`prompts/authoring.md`, `prompts/curation.md`, `prompts/coaching.md`, `prompts/llm-operating.md`, and `prompts/interview-prep-questions.md`). The old `spec/*` prompt paths remain as compatibility stubs.

## [0.1.0] — Initial release

The foundational version of OCF. Sets the shape of the format, the surrounding tooling categories (curators, renderers, exporters, importers), and the conversational use case.

### Schema (`spec/schema.json`)

- Top-level structure: `meta`, `person`, `skills`, `competencies`, `organizations`, `experience` (experience entries → positions → achievements), `education`, `certifications`, `governance`, `teaching`, `speaking`, `memberships`, `service`, `patents`, `publications`, `awards`, `languages`, `references`, `interests`.
- **Visibility model** — every item carries `visibility` (`public` / `shared` / `private`), with sensible defaults per item type.
- **Targeting model** — `importance` (integer, no fixed scale) and `audiences` (freeform string array) drive derivation-time filtering.
- **Achievement depth** — `statement`, `shortStatement`, `longform`, structured `metrics`, `skills`, `links`, with `kind` enumerating accomplishment / responsibility / project / recognition / other.
- **Narrative variants** — audience-specific alternate bullet wording can be preserved on achievements without replacing canonical facts.
- **Title variants** — positions may carry defensible alternate display titles, but each variant requires a basis because changing a title can misrepresent scope or authority.
- **Source artifacts** — old resumes, LinkedIn exports, pasted chat text, and similar inputs can be recorded in `sourceArtifacts` and referenced from provenance.
- **Review lifecycle reserved** — schema comments reserve space for a future `reviewStatus` on imported or AI-mined material without committing to an enum in v0.1.
- **Reflections layer** — open-ended Topgrading-style answers on positions and experience entries. Defaults to private. Parallel to achievements rather than competing with them.
- **Provenance** — open-shape provenance object on items, carrying any metadata a tool wants to record, with recommended boring keys (`source`, `tool`, `date`, `sourceArtifactId`, `confidence`, `sessionTopic`, `operation`, `note`) for interoperability.
- **Facts vs display** — canonical fields store defensible facts, variants preserve audience-specific wording, derivations select/filter, and renderers/exporters handle presentation or schema mapping.
- **Vendor extensions** — namespaced extension surface (keyed by vendor domain name) at file root and on key items.
- **Credential interop** — structured issuer with optional DID for VC interop; `$comment` placeholder for a future structured verification field.
- **Skill taxonomies** — optional array of external taxonomy references (ESCO, O*NET, SFIA, Lightcast) per skill.
- **Position-level extras** — `teamSize` and `directReports` as common Topgrading-style facts.
- **AI-conversation fields** — `goals`, `cautions`, `openQuestions`, `voice`, `aiInstructions` at file level. All optional; all default-private where applicable; all marked with `$comment` indicating v0.1 placeholder status.
- **Strict core objects** — structured OCF objects reject unknown properties so typos fail validation. Open-ended metadata still belongs in `provenance` or vendor-namespaced `extensions`.
- **Privacy guardrails** — OCF is PII by nature, but government identity numbers and account secrets are explicitly out of scope.

### Spec documents

- `spec/guide.html` — full prose specification.
- `spec/llm-prompt.md` — recommended LLM instruction set for tools that consume OCF conversationally.
- `spec/interview-prep-questions.md` — canonical Topgrading-style question set with recommended reflection `kind` strings.
- `spec/examples/sample-resume.ocf.json` — fictional but richly-built example demonstrating most spec features, including the conversational-mining pattern, the "stays in master, typically curated out" pattern, and populated AI-conversation fields.
- `spec/examples/README.md` — describes each example.
- The guide and README include practical prompts for using OCF today with a general LLM before dedicated OCF apps or MCP servers exist.
- The recommended LLM prompt now tells tools to offer save/store/git-commit checkpoints after major steps so accepted work does not remain only in the chat transcript.
- The guide and README strongly encourage users to version the master OCF with git or another versioning system of their choice.
- Added a guide caveats section covering validation limits, deliberate archival of sent derived files, source artifact sensitivity, coach-specific derivatives, deletion versus curation, tool trust levels, review checkpoints, and dated filename recommendations for downstream tools.
- Added adoption guidance for minimum useful OCF files, forward-safe tool behavior, round-trip preservation by master-editing tools, provisional confidence for imported facts, accessibility expectations for rendered outputs, and future name/language variant expansion.
- Added user-facing feedback paths, including a use-case suggestion issue template and LLM guidance to direct non-developers to the suggestion form or Discussions.

### Reference implementations

- `reference/validator/` — Node-based JSON Schema validator. Run from repo root: `node reference/validator/validate.js`.
- `reference/editor/`, `reference/curators/`, `reference/renderers/`, `reference/exporters/`, `reference/importers/` — directories reserved for reference implementations of each tool category.

### Project infrastructure

- `LICENSING.md`, `LICENSE-spec` (CC-BY 4.0), `LICENSE-code` (MIT) — dual-license setup.
- `CONTRIBUTING.md` — the contribution process.
- `CHANGELOG.md` — this file.
- `.github/` issue and PR templates.

### Known gaps and explicit non-goals

The spec deliberately does not specify how content is elicited, how it is rendered, or how it is scored against opportunities. See the Non-Goals section of `spec/guide.html`. A future `verification` field on certifications is anticipated when the credential-VC ecosystem stabilizes; see the `$comment` on the certification definition in `spec/schema.json`.
