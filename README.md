# Open Career Format (OCF)

[English](README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [日本語](README.ja.md)

<p align="center">
  <img src="spec/assets/ocf-logo.png" alt="Open Career Format logo" width="160">
</p>

A candidate-owned, portable file format for preserving career history and curating targeted resumes, cover letters, public profiles, and exports to other systems.

> **Looking for a job?** You don't need this repository. Start at <https://opencareerformat.org/>. If your AI tool supports skills, use the OCF Start skill; if you are in a normal chat window, copy the bootstrap prompt, attach your resume and the job description, and go.

This repository contains the schema, prompts, skills, mappings, and reference implementations behind that site. The rest of this README is for people reading the spec, building tools, or contributing.

OCF is currently at **v0.3** and should be treated as pre-1.0 beta. The current schema URL is <https://opencareerformat.org/schema.json>; this alias may change as feedback comes in. Tools that need stability should pin to a versioned schema URL such as <https://opencareerformat.org/v0.3/schema.json>. Breaking changes may occur before 1.0 and will be documented in the changelog.

OCF is not hiding changes behind the website. Git history shows what changed and when. For most docs, prompts, skills, and guidance, use the latest version. For the schema, use the latest version unless you need to pin a specific schema version for validation or compatibility. Version-pinned teaching examples, such as the Maria Reyes OCF 0.3 set, remain valid against the schema they declare and are not automatically migrated to each new release.

## Start Here

- **If you are an individual using OCF with a resume, job description, or LLM:** start with <https://opencareerformat.org/>.
- **If you are an LLM, or pointing one at this project:** start with <https://opencareerformat.org/llms.txt>.
- **If you are wondering how OCF differs from resumes, LinkedIn, JSON Resume, or LLM resume chats:** read [`spec/ocf-vs-resume-linkedin.md`](spec/ocf-vs-resume-linkedin.md).
- **If you are reading the schema:** start with [`spec/guide.html`](spec/guide.html), then [`spec/schema-commentary.md`](spec/schema-commentary.md).
- **If you are building a tool:** start with [`spec/implementer-quick-reference.md`](spec/implementer-quick-reference.md), [`spec/usage-patterns.md`](spec/usage-patterns.md), and [`schema.json`](schema.json).
- **If you want runnable examples:** start with [`reference/README.md`](reference/README.md).
- **If you want to see an OCF grow through repeated conversations:** start with [`spec/examples/maria-reyes/README.md`](spec/examples/maria-reyes/README.md).
- **If you are mapping OCF to another format:** start with [`mappings/README.md`](mappings/README.md).

## Repository Layout

This repository deliberately separates three different kinds of artifact:

```
spec/             # THE OPEN SCHEMA — what gets versioned, cited, and adopted.
  schema.json     # The JSON Schema definition for OCF files.
  guide.html      # The human-readable specification, written for the curious reader.
  schema-commentary.md # Non-normative annotated schema commentary with examples.
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

## What OCF Is

OCF is a structured, JSON-based format designed around explicit file roles and a three-stage pipeline.

File roles matter. A **candidate-owned master** is the primary personal use case: the person's private, durable career memory. A **candidate-curated** or **export-ready** file is reduced for a specific audience or output. A first pass from resumes, LinkedIn exports, notes, or conversations can become a provisional master, but imported items should stay visibly unreviewed until accepted. A **third-party working OCF** can be created by a recruiter, coach, agency, employer, or tool about a person; it may be useful in that workflow, but it is not the candidate's private master and should not be treated as canonical for the person without review. In every case, the top-level `person` is the subject whose career is described; the controller of the file and the editor of individual items may be different. See [`spec/usage-patterns.md`](spec/usage-patterns.md).

1. **Master file** — your complete career record. Everything goes in: every role, every achievement, every certification, every note. You maintain one master file over years. This can be created by hand, by a tool, or by importing an old resume.
2. **Curation** — the judgment loop. A curator reads the master OCF, applies rules and preferences, filters what should not be used, asks questions where evidence is missing or inconsistent, and ranks what matters for the purpose. Curation can produce proposed improvements to the master, export-ready input, or both.
3. **Export** — what someone else sees or another system consumes. Exporters turn export-ready input into files: human-readable artifacts such as PDF, DOCX, HTML, or cover-letter text, and machine-readable exports such as JSON Resume, LER-RS, Schema.org JSON-LD, or LinkedIn paste bundles.

These stages are useful even when no dedicated OCF application exists. In an LLM conversation, "curation" is the instruction to filter, question, rank, and propose improvements instead of simply drafting plausible prose. "Export" is the instruction to turn the curated working set into the requested artifact, whether that is a resume draft, interview-prep notes, a profile section, or a structured file.

The master OCF is a private archive for an individual, not a file to hand to an employer, colleague, recruiter, ATS, or public website. You should store it the way you store other personal files like financial documents. Curated/export-ready files and exported outputs are the shareable layer, and even those will usually contain personally identifiable information because resumes do.

Important caveat: validation checks structure, not truth or shareability. A valid OCF can still contain false claims, private material, stale facts, or content that should not be sent to a particular recipient. See the guide section "Caveats and Operating Practices" before sharing a master or curated file.

A small master with person information, one experience entry, one position, and a few achievements is enough to validate, prepare a first output, and improve through later conversations. Nobody needs a complete career archive before OCF becomes useful — the [application bootstrap](prompts/application-bootstrap.md) exists so a first session can help with a real application and produce a provisional master or proposed update set as a by-product.

Skills and prompts use the same OCF guidance. The prompt works anywhere you can paste text. The skill adds local file management: where the master lives, where backups go, where sources are stored, and where each application's outputs belong. All still under your control, and fully open and readable. If your agent environment supports reusable skills, [`skills/ocf-start/SKILL.md`](skills/ocf-start/SKILL.md) routes the user to the right prompt or workflow, [`skills/ocf-setup/SKILL.md`](skills/ocf-setup/SKILL.md) helps organize local files, and [`skills/ocf-export-career-ops/SKILL.md`](skills/ocf-export-career-ops/SKILL.md) can seed a Career-Ops workspace from OCF.

See [`spec/guide.html`](spec/guide.html) for the full design walkthrough, including the rationale behind organizations versus experience entries, visibility controls, narrative depth, vendor extensions, provenance, curation, and exports.

## What OCF Is Not

OCF deliberately does not specify how content is elicited (the interviewing layer), how export files are produced (the export layer), or how content is scored against opportunities (the matching layer). Those are tool concerns. By staying focused on *what gets persisted*, OCF stays small enough that an individual can understand their own file and that developers/vendors can compete on tooling without forking the format.

That does not mean the project is indifferent to what good elicitation produces. We hope models, coaches, and tools recover context that conventional resumes leave behind, especially stories, explanations, and reflections preserved in the person's own words. Models can interpret that material, identify patterns in it, ask questions that uncover more gems, and propose uses for it without replacing the source memory with polished AI prose. OCF structures what is worth keeping while leaving tools free to improve how they discover it.

OCF being a file format also does not prohibit small local tools or local configuration. Career-authoritative state belongs in the OCF file; optional operating preferences, such as how much of a large master to load for a particular task, may live in separate local files controlled by the user. Those files must remain readable, replaceable, and unnecessary for interpreting an ordinary OCF file. Hidden, required, hosted, or vendor-controlled state is outside the OCF model.

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
