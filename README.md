# Open Career Format (OCF)

<p align="center">
  <img src="spec/assets/ocf-logo.png" alt="Open Career Format logo" width="160">
</p>

A candidate-owned, portable file format for an entire career. One master file, maintained over years, from which any number of targeted resumes, cover letters, public profiles, or exports to other systems can be curated and exported.

OCF is designed for two kinds of use. Most people will use the structure directly in conversation: upload or open an OCF with an LLM, coach, advisor, or reviewer so the conversation has concrete career memory to work from. The curation and export language gives that conversation a mental model: first decide what parts of the person's career history should be used, reviewed, ranked, filtered, and/or improved; then export the type of content in the format the person needs.

If you are using an LLM, point it at the guide and the current schema: <https://opencareerformat.org/schema.json>. Versioned schemas remain available at paths such as <https://opencareerformat.org/v0.2/schema.json> for files that need a pinned schema.

The second use is tool integration. The structure of OCF is meant to capture the complexity of a career in ways that a computer can understand and help reformat or improve for different needs. How software will leverage this beyond the reference implementations is outside the scope of the format.

OCF is currently at **v0.2** and should be treated as pre-1.0 beta. The canonical guide lives at <https://opencareerformat.org/>; the current schema URL is <https://opencareerformat.org/schema.json>. The current alias may change as feedback comes in. Tools that need stability should pin to a versioned schema URL such as <https://opencareerformat.org/v0.2/schema.json>. Breaking changes may occur before 1.0 and will be documented in the changelog.

## Repository Layout

This repository deliberately separates three different kinds of artifact:

```
spec/             # THE OPEN SCHEMA — what gets versioned, cited, and adopted.
  schema.json     # The JSON Schema definition for OCF files.
  guide.html      # The human-readable specification, written for the curious reader.
  schema-commentary.md # Non-normative annotated schema commentary with examples.
  usage-patterns.md # File roles: candidate-owned master, imported starter, third-party working files, etc.
  authoring-prompt.md # Optional prompt for LLMs creating or updating a master OCF.
  examples/       # Canonical example OCF files.
  llm-prompt.md   # Recommended instruction set for LLM-based tools that consume OCF conversationally.
  curation-prompt.md # Optional prompt for curation tools that improve OCF or prepare export-ready input.

schema.json       # Current schema alias, suitable for new files and tools that want "latest".
schema-core.json  # Starter/core authoring shape for LLMs and first-time OCF creation.
llms.txt          # LLM/tool site map pointing to the guide, schemas, and prompts.

mappings/         # CROSS-FORMAT DOCS — prose-only specifications for how OCF
                  # maps to / from neighbouring formats (JSON Resume, LER-RS,
                  # Schema.org, LinkedIn export). No code, just specifications.

reference/        # REFERENCE IMPLEMENTATIONS — code that is NOT part of the
                  # schema but proves it works end-to-end.
  validator/      # A small Node-based JSON Schema validator.
  curators/       # Master OCF → proposed improvements and/or export-ready input.
  exporters/      # Export-ready input → files (PDF, HTML, JSON Resume, LER-RS, ...).
  importers/      # other-format → OCF converters.
  editor/         # A Next.js editor for authoring OCF files.
```

The split is intentional. Anyone who wants to use OCF can read `spec/` and ignore the rest. Anyone building their own tool leveraging OCF can ignore as much of `reference/` as they'd like. Anyone bridging OCF to another format goes to `mappings/` for the mapping notes and `reference/exporters/` for one possible implementation.

## What OCF Is

OCF is a structured, JSON-based format designed around explicit file roles and a three-stage pipeline.

File roles matter. A **candidate-owned master** is the primary personal use case: the person's private, durable career memory. A **candidate-curated** or **export-ready** file is reduced for a specific audience or output. An **imported starter** is a provisional first pass from resumes, LinkedIn exports, notes, or conversations. A **third-party working OCF** can be created by a recruiter, coach, agency, employer, or tool about a person; it may be useful in that workflow, but it is not the candidate's private master and should not be treated as canonical for the person without review. In every case, the top-level `person` is the subject whose career is described; the controller of the file and the editor of individual items may be different. See [`spec/usage-patterns.md`](spec/usage-patterns.md).

1. **Master file** — your complete career record. Everything goes in: every role, every achievement, every certification, every note. You maintain one master file over years. This can be created by hand, by a tool, or by importing an old resume.
2. **Curation** — the judgment loop. A curator reads the master OCF, applies rules and preferences, filters what should not be used, asks questions where evidence is missing or inconsistent, and ranks what matters for the purpose. Curation can produce proposed improvements to the master, export-ready input, or both.
3. **Export** — what someone else sees or another system consumes. Exporters turn export-ready input into files: human-readable artifacts such as PDF, DOCX, HTML, or cover-letter text, and machine-readable exports such as JSON Resume, LER-RS, Schema.org JSON-LD, or LinkedIn paste bundles.

These stages are useful even when no dedicated OCF application exists. In an LLM conversation, "curation" is the instruction to filter, question, rank, and propose improvements instead of simply drafting plausible prose. "Export" is the instruction to turn the curated working set into the requested artifact, whether that is a resume draft, interview-prep notes, a profile section, or a structured file.

The master OCF is a private archive for an individual, not a file to hand to an employer, colleague, recruiter, ATS, or public website. You should store it the way you store other personal files like financial documents. You may choose to share it with a trusted career coach, advisor, attorney, or tool, but that is a high-trust disclosure. Curated/export-ready files and exported outputs are the shareable layer, and even those will usually contain personally identifiable information because resumes do.

See [`spec/guide.html`](spec/guide.html) for the full design walkthrough, including the rationale behind organizations versus experience entries, visibility controls, narrative depth, vendor extensions, provenance, curation, and exports.

Important caveat: validation checks structure, not truth or shareability. A valid OCF can still contain false claims, private material, stale facts, or content that should not be sent to a particular recipient. See the guide section "Caveats and Operating Practices" before sharing a master or curated file.

You do not need a complete career archive before OCF becomes useful. A small master with person information, one experience entry, one position, and a few achievements is enough to validate, prepare a first output, and improve through later conversations.

## What OCF Is Not

OCF deliberately does not specify how content is elicited (the interviewing layer), how export files are produced (the export layer), or how content is scored against opportunities (the matching layer). Those are tool concerns. By staying focused on *what gets persisted*, OCF stays small enough that an individual can understand their own file and that developers/vendors can compete on tooling without forking the format.


## OCF as Input to a Conversation

The most accessible way to use OCF is to bring it into a conversation: with a human coach, advisor, mentor, trusted reviewer, or an LLM. The point is the same either way: the conversation has structured context about what you have done, what changed, what mattered, and what evidence you can draw on. The recommended pattern is bidirectional — the conversation uses OCF as substrate AND proposes updates to the master file at the end. Over time, every meaningful interaction leaves the file richer rather than starting from scratch.

OCF publishes a recommended LLM prompt at [`spec/llm-prompt.md`](spec/llm-prompt.md). Tools may use it verbatim, adapt it, or replace it. See the guide section *"OCF as Input to a Conversation (Human or LLM)"* for the full discussion.

You can use OCF today without a dedicated app or MCP server. Upload prior resumes or career artifacts to an LLM that can read attachments and say:

> Using the three copies of my resume I just uploaded to you, and the current OCF schema at https://opencareerformat.org/schema.json, please walk me through the OCF process to create my master OCF. Treat prior resumes as source artifacts, preserve useful audience-specific wording as narrative variants, and propose uncertain claims as open questions instead of inventing facts. After each major step, ask whether I want to save, version, or git commit the latest accepted version.

Later, when you have a master OCF, upload it with a job description you are interested in and say:

> Given my OCF, which I just uploaded, and this job description, let's do resume prep and interview prep. First identify the best matching evidence in my OCF, then suggest any master updates, then produce a targeted resume draft and interview talking points. Respect visibility, separate facts from display wording, and remind me what I need to verify before using any output. After each major step, ask whether I want to save, version, or git commit the latest accepted version.

We strongly encourage you to ask your tool to use git, cloud document history, encrypted backups, or another versioning system of your choice for the master OCF. The format is designed to accumulate over years; versioning makes it possible to recover from bad imports, compare changes, and avoid losing work when a chat session ends.

Downstream tools should use descriptive dated filenames for generated artifacts, such as `curated/acme-ciso-2026-05-21.ocf.json` or `exports/acme-ciso-resume-2026-05-21.pdf`, so users can tell which file belongs to which target, when it was created, and what version actually went out the door.

Tools that write back to the master should preserve fields they do not own, including IDs, provenance, source artifact references, and vendor extensions. A curated/export-ready file may intentionally omit content, but it should remain labeled as non-master and should not be used to overwrite the master accidentally.

## Feedback and Suggestions

The OCF schema should improve from real use. If an LLM, career coach, developer tool, or ordinary resume workflow makes you ask "why can't OCF handle this?", please send that use case back to the project.

- For ideas, missing capabilities, or user stories, open the suggestion form: <https://github.com/opencareerformat/opencareerformat/issues/new/choose>
- For open-ended questions, use GitHub Discussions: <https://github.com/opencareerformat/opencareerformat/discussions>
- For thanks, examples of OCF helping, or lightweight feedback, Discussions are also welcome.

You do not need to be a developer. A concrete user story is useful on its own: "I wanted to store both my English and Spanish versions of the same achievement and have tools preserve both."

## Validating an OCF File

```bash
cd reference/validator
npm install        # one-time, installs ajv and ajv-formats
node validate.js   # validates every file in spec/examples/ against spec/schema.json
```

Or from the repo root:

```bash
node reference/validator/validate.js
```

## License

OCF is dual-licensed. The specification (everything in `spec/` and `mappings/`) is licensed under [Creative Commons Attribution 4.0 International](LICENSE-spec) (CC BY 4.0). The reference implementations (everything in `reference/`) are licensed under the [MIT License](LICENSE-code). See [LICENSING.md](LICENSING.md) for the umbrella explainer.

## Status

OCF is currently a research-stage, pre-1.0 beta open schema. The format is small enough to experiment with, but actual use depends on the tooling ecosystem maturing around it. Contributions, critiques, and exporter implementations are welcome.
