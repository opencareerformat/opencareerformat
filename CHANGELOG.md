# Changelog

All notable changes to the Open Career Format specification and reference implementations will be documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

OCF follows relaxed semver in the 0.x series — small breaking changes are documented here but possible between minor versions. From v1.0 onward, minor versions are additive only.

## 2026-07-15

### Changed

- Clarified user-selected LLM privacy boundaries, an optional archivist/drafter isolation pattern, OCF's lack of a current verification mechanism, and jurisdiction-dependent responsibilities for third-party working files.
- Replaced synchronized Spanish documentation with static Spanish, French, German, Portuguese, and Japanese language gateways that defer to the current canonical English guidance.
- Clarified that reference visibility filtering cannot determine whether arbitrary unknown extension payloads are safe to share; users and extension-aware curators retain that decision.
- Made the application bootstrap handle missing target or career evidence conservatively, fail honestly when its canonical URL cannot be retrieved, and suggest a stable master filename when returning a complete JSON file.
- Added non-normative v0.4 considerations for date correctness, stable file IDs, selective non-empty requirements, lightweight item identity, simpler certification issuers, and whether lightly proven grant/funding fields should return to extension incubation.
- Corrected Maria Reyes's structured GPA and removed unnecessary fictional thesis and publication material from both frozen OCF revisions.
- Made local core checks detect a stale generated projection, added a bounded Python CLI smoke test, counted schema-default visibility in curator summaries, and documented the reference validator's local schema and dependency assumptions.
- Clarified that a missing or unknown `meta.fileRole` remains unclassified and untrusted until the controlling user identifies the workflow.
- Made visibility filtering fail closed when an object carries an invalid explicit visibility value.
- Made imported generic social links default to shared rather than public, and stopped orphan resume bullets from being assigned to the first role.
- Made unknown employment end dates remain unknown instead of rendering them as Present.
- Made the validator continue after malformed input files and retain semantic checks in `--warn-unknown` mode.
- Added an explicit current-schema-copy consistency check and broadened deterministic reference behavior tests.
- Corrected contributor, licensing, planning, reference-tool, and organization-example documentation drift found during a repository-wide review.

## 2026-07-14

### Changed

- Reorganized the Maria Reyes teaching set around one conversation-first entry page, with complete OCF revisions before and after Conversation Seven, two target job descriptions, selected full transcripts, and separate implementation details.
- Pinned the Maria teaching set to OCF 0.3 so later schema releases do not require rewriting a stable example narrative.
- Made the reference validator discover nested example files and validate each example against its declared local versioned schema.

## 2026-07-13

### Changed

- Clarified the two Career-Ops integration paths: a standalone one-way OCF export and a planned bidirectional installed plugin that uses OCF as the local career-memory backend while preserving Career-Ops ownership of search workflow and runtime state.

## 2026-07-12

### Added

- Added a dependency-free `reference/context/ocf-context.js` proof of concept for local context profiles, explicit withheld-content manifests, and full-item retrieval by stable ID.
- Added a context-profile design note explaining selective loading, explicit omission, local configuration boundaries, and why the first conservative profile is a proof rather than a compression target.
- Generated `schema-core.json` as a strict projection of the full schema, with CI checks that the application-bootstrap starter validates against both shapes.
- Added a compact generated schema index for visibility defaults and local reference semantics; the reference validator now reports duplicate IDs, dangling local references, and supersession cycles.
- Added focused reference behavior tests for private-default filtering, canonical variant export, and semantic references.

- Added initial OCF skills for local-agent workflows: `ocf-start` routes users to the right prompt or workflow, and `ocf-setup` organizes local master, backup, source, and output folders. Skills use the same OCF guidance as prompts; they add file management for agents that can work locally.
- Added `ocf-export-career-ops`, a skill for creating or updating a Career-Ops workspace from OCF while keeping transient job-search preferences out of the OCF master unless the user asks to save them.
- Added an OCF and Career-Ops integration page describing simple file export, deeper curator/exporter possibilities, and the boundary between career memory and job-search workflow state.
- Added story-to-bullet prompt guidance for expanding resume bullets into before-state, stakes, agency, defensible metrics, downstream impact, and audience-appropriate output shapes without pressuring users to invent numbers.

### Changed

- Made the minimal private filter, curator, and exporters honor schema-declared visibility defaults without adding runtime dependencies.
- Made visibility filtering remove references to locally defined items removed by the same filter, preventing private source artifacts or other private targets from leaving dangling pointers.
- Made reference exporters use canonical fields and warn about unresolved title/narrative variants instead of silently choosing the first variant.
- Clarified that optional, local, user-controlled configuration may hold tool operating preferences while career-authoritative state remains in the OCF; added the v0.4 context-profile direction as a precursor to physical sharding.

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

## [0.2.0] — 2026-05-24

### Added

- Added optional `meta.fileRole` to distinguish candidate-owned master files, candidate-curated files, imported starter files, third-party working files, export-ready files, and other OCF workflow contexts.
- Added `spec/usage-patterns.md` and updated the guide, README, prompts, starter/core schema, and examples to clarify that a candidate-owned master is one important OCF use case, not the only possible OCF file role. The top-level `person` is the subject of the OCF; the controller of the file and editors of individual items may be different.
- Added optional `achievement.attribution` to capture the subject's role in an outcome (`owned`, `led`, `drove`, `contributed-to`, `supported`, `advised`, `observed`, `other`) plus optional budget, headcount, and upward-reporting context.

### Changed

- Reframed reflections as a private review and conversation layer, with interview preparation as one use case rather than the whole concept.

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
