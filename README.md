# Open Career Format (OCF)

[Other languages](spec/language-and-translation.md#documentation-language-gateways)

<p align="center">
  <img src="spec/assets/ocf-logo.png" alt="Open Career Format logo" width="160">
</p>

A candidate-owned, portable file format for preserving career history and curating targeted resumes, cover letters, public profiles, and exports to other systems.

## Use OCF

- **Put your career history into OCF:** start at [opencareerformat.org](https://opencareerformat.org/). Environments that support skills can use the [OCF Start skill](skills/ocf-start/SKILL.md); ordinary chat windows can use the [application bootstrap prompt](prompts/application-bootstrap.md).
- **Integrate OCF into your product:** start with the [current schema](schema.json), [OCF Schema Field Guide](spec/schema-field-guide.md), [implementer quick reference](spec/implementer-quick-reference.md), and [reference implementations](reference/README.md).

## See OCF Used

Follow [Maria Reyes through repeated conversations](spec/examples/maria-reyes/conversation.md) that create, reuse, and improve the same career-memory file. Continue [Inside Maria's OCF](spec/examples/maria-reyes/inside-the-ocf.md) to inspect the resulting JSON, then read the [OCF Design Guide](spec/design-guide.md) and [OCF Schema Field Guide](spec/schema-field-guide.md).

This repository contains the schema, prompts, skills, mappings, examples, and reference implementations behind OCF.

OCF is currently at **v0.3** and should be treated as pre-1.0 beta. The current schema URL is <https://opencareerformat.org/schema.json>; this alias may change as feedback comes in. Tools that need stability should pin to a versioned schema URL such as <https://opencareerformat.org/v0.3/schema.json>. Breaking changes may occur before 1.0 and will be documented in the changelog.

OCF is not hiding changes behind the website. Git history shows what changed and when. For most docs, prompts, skills, and guidance, use the latest version. For the schema, use the latest version unless you need to pin a specific schema version for validation or compatibility. Version-pinned teaching examples, such as the Maria Reyes OCF 0.3 set, remain valid against the schema they declare and are not automatically migrated to each new release.

## Repository Layout

This repository deliberately separates three different kinds of artifact:

```
spec/             # THE OPEN SCHEMA — what gets versioned, cited, and adopted.
  schema.json     # The JSON Schema definition for OCF files.
  design-guide.md # Concepts, structure, boundaries, and design rationale.
  schema-field-guide.md # Detailed field conventions, examples, and pitfalls.
  implementer-quick-reference.md # Compact field tiers and tool behavior guidance.
  usage-patterns.md # File roles: candidate-owned master, curated/export-ready files, third-party working files, etc.
  v0.3-planning.md # Decision record for the v0.3 schema.
  v0.4-planning.md # Early, non-normative planning notes for possible future work.
  examples/       # Canonical example OCF files.

schema.json       # Current schema alias, suitable for new files and tools that want "latest".
schema-core.json  # Generated starter/core projection for LLMs and first-time OCF creation.
llms.txt          # LLM/tool site map pointing to the guide, schemas, skills, and prompts.

prompts/          # OPTIONAL OPERATING GUIDANCE — LLM/coach/curator prompts that can evolve separately.
  application-bootstrap.md # Single-fetch first-session prompt for resume + job-description help.
  authoring.md    # Prompt for creating or updating a master OCF or proposed update set.
  coaching.md     # Prompt for discovering story, voice, goals, boundaries, and reflection.
  curation.md     # Prompt for target-specific filtering, questioning, ranking, and improvement.
  llm-operating.md # Baseline instruction set for conversational OCF use.

skills/           # OPTIONAL AGENT WORKFLOWS — packaged skills for Codex,
                  # Claude Code, Cursor, and similar tools.
  ocf-start/      # Front-door router: what do you have, and what are you trying to do?
  ocf-setup/      # Local career folder setup for the master file, backups, sources, and outputs.
  ocf-export-career-ops/ # Export OCF career memory into a Career-Ops workspace.

mappings/         # CROSS-FORMAT DOCS — prose-only specifications for how OCF
                  # maps to / from neighbouring formats (JSON Resume, LER-RS,
                  # Schema.org, LinkedIn export). No code, just specifications.

reference/        # REFERENCE IMPLEMENTATIONS — code that is NOT part of the
                  # schema but proves it works end-to-end.
  validator/      # A small Node-based JSON Schema validator.
  context/        # Local context-profile views and item retrieval for large masters.
  curators/       # Master OCF -> proposed improvements and/or export-ready input.
  exporters/      # Export-ready input -> files (PDF, HTML, JSON Resume, LER-RS, ...).
  importers/      # other-format -> OCF converters.

tools/            # REPOSITORY MAINTENANCE — schema/doc generators and consistency checks.
```

The split is intentional. Anyone who wants to use OCF can read `spec/` and ignore the rest. Anyone building their own tool leveraging OCF can ignore as much of `reference/` as they'd like. Anyone bridging OCF to another format goes to `mappings/` for the mapping notes and `reference/exporters/` for one possible implementation.

## Project Boundaries

OCF is a candidate-owned career-memory format. It defines what can be preserved and exchanged while leaving interviewing, matching, rendering, and application workflow to tools built around it. The [OCF Design Guide](spec/design-guide.md) explains the design and non-goals; [usage patterns](spec/usage-patterns.md) define master, curated, export-ready, and third-party file roles.

Validation checks structure, not truth or shareability. A valid OCF can still contain false, stale, or private material. The person remains responsible for reviewing every word and deciding what leaves their private file; see [SECURITY.md](SECURITY.md) and the guide's caveats before sharing anything.

## Conventions for Tools

The reference prompts ([`prompts/README.md`](prompts/README.md)) carry the full operating guidance. Three conventions matter enough to repeat here:

- **Encourage versioning.** The master OCF accumulates over years. Tools should encourage git, cloud document history, encrypted backups, or another versioning system, so users can recover from bad imports and compare changes.
- **Use descriptive dated filenames for generated artifacts**, such as `curated/acme-ciso-2026-05-21.ocf.json` or `exports/acme-ciso-resume-2026-05-21.pdf`, so users can tell which file belongs to which target and what version went out the door. Do not name a throwaway or unaccepted import artifact as a master file.
- **Preserve fields you do not own.** Tools that write back to the master should preserve IDs, provenance, source artifact references, and vendor extensions. A curated/export-ready file may intentionally omit content, but it should remain labeled as non-master and should never overwrite the master accidentally.

## Feedback and Contributions

If the schema cannot express something your tool, mapping, or workflow needs, [open an issue](https://github.com/opencareerformat/opencareerformat/issues/new/choose) with the concrete use case: what you were trying to preserve, curate, export, or exchange, and why the existing shape failed. See [CONTRIBUTING.md](CONTRIBUTING.md) for how proposals are received and decided, including what tends to land and what gets declined. For open-ended questions, use [Discussions](https://github.com/opencareerformat/opencareerformat/discussions).

## Validating an OCF File

```bash
cd reference/validator
npm ci             # one-time, installs the pinned validator dependencies
node validate.js   # recursively validates spec/examples/ against each file's declared schema version
```

Or from the repo root:

```bash
node reference/validator/validate.js
```

Validation checks structure only. OCF files often contain private career data; prefer local validation over third-party validators.

## License

OCF is dual-licensed. The specification, mappings, prompts, skills, examples, and project documentation are licensed under [Creative Commons Attribution 4.0 International](LICENSE-spec) (CC BY 4.0). The reference implementations (everything in `reference/`) are licensed under the [MIT License](LICENSE-code). See [LICENSING.md](LICENSING.md) for the umbrella explainer.

## Status

OCF is currently a research-stage, pre-1.0 beta open schema. The format is small enough to experiment with, but actual use depends on the tooling ecosystem maturing around it. Contributions, critiques, and exporter implementations are welcome.
