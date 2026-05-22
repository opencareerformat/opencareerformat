# Open Career Format (OCF)

<p align="center">
  <img src="spec/assets/ocf-logo.png" alt="Open Career Format logo" width="160">
</p>

A candidate-owned, portable file format for an entire career. One master file, maintained over years, from which any number of targeted resumes, cover letters, public profiles, or exports to other systems can be derived.

OCF is designed for workflows that import source artifacts such as old resumes, cover letters, and LinkedIn exports; merge them into a growing Master OCF through review and clarifying questions; then derive point-in-time OCF files for specific uses such as rendered PDFs, cover letters, public profiles, or copy-and-paste exports for systems like LinkedIn.

OCF is currently at **v0.1**. The canonical specification lives at <https://opencareerformat.org/>; the versioned schema URL is <https://opencareerformat.org/v0.1/schema.json>.

## Repository Layout

This repository deliberately separates three different kinds of artifact:

```
spec/             # THE STANDARD — what gets versioned, cited, and adopted.
  schema.json     # The JSON Schema definition for OCF files.
  guide.html      # The human-readable specification, written for the curious reader.
  examples/       # Canonical example OCF files.
  llm-prompt.md   # Recommended instruction set for LLM-based tools that consume OCF conversationally.

mappings/         # CROSS-FORMAT DOCS — prose-only specifications for how OCF
                  # maps to / from neighbouring formats (JSON Resume, LER-RS,
                  # Schema.org, LinkedIn export). No code, just specifications.

reference/        # REFERENCE IMPLEMENTATIONS — code that is NOT part of the
                  # standard but proves it works end-to-end.
  validator/      # A small Node-based JSON Schema validator.
  curators/       # Master OCF → Derived OCF (filter, reorder, rewrite for a target).
  renderers/      # Derived OCF → human-readable artifacts (PDF, HTML page, ...).
  exporters/      # Derived OCF → other-format converters (JSON Resume, LER-RS, ...).
  importers/      # other-format → OCF converters.
  editor/         # A Next.js editor for authoring OCF files.
```

The split is intentional. Anyone who wants to adopt OCF can read `spec/` and ignore the rest. Anyone building their own tool leveraging OCF can ignore as much of `reference/` as they'd like. Anyone bridging OCF to another format goes to `mappings/` for the specification and `reference/exporters/` for one possible implementation.

## What OCF Is

OCF is a structured, JSON-based format designed around a three-stage pipeline:

1. **Master file** — your complete career record. Everything goes in: every role, every achievement, every certification, every note. You maintain one master file over years. This can be created by hand, by a tool, or by importing an old resume.
2. **Derived OCF** — a filtered, targeted copy of the master for a specific purpose (a role, a company, a public profile). A derivation tool reads your master and a target, and produces a reduced OCF. This can be read by a person, but it primarily serves as a source file for the next stage of the pipeline.
3. **Rendered output or export** — what someone else sees. Renderers produce human-readable artifacts (PDF, DOCX, HTML). Exporters translate to other ecosystems' schemas (JSON Resume, LER-RS, Schema.org), which can then produce their own outputs.

The master OCF is a private archive for an individual, not a file to hand to an employer, colleague, recruiter, ATS, or public website. You should store it the way you store other personal files like financial documents. You may choose to share it with a trusted career coach, advisor, attorney, or tool, but that is a high-trust disclosure. Derived OCF files and rendered outputs are the shareable layer, and even those will usually contain personally identifiable information because resumes do.

See [`spec/guide.html`](spec/guide.html) for the full design walkthrough, including the rationale behind organizations versus experience entries, visibility controls, narrative depth, vendor extensions, provenance, and the renderer/exporter distinction.

Important caveat: validation checks structure, not truth or shareability. A valid OCF can still contain false claims, private material, stale facts, or content that should not be sent to a particular recipient. See the guide section "Caveats and Operating Practices" before sharing a master or derived file.

You do not need a complete career archive before OCF becomes useful. A small master with person information, one experience entry, one position, and a few achievements is enough to validate, derive a first output, and improve through later conversations.

## What OCF Is Not

OCF deliberately does not specify how content is elicited (the interviewing layer), how it is rendered (the renderer layer), or how it is scored against opportunities (the matching layer). Those are tool concerns. By staying focused on *what gets persisted*, OCF stays small enough that an individual can understand their own file and that developers/vendors can compete on tooling without forking the format.


## OCF as Conversational Input

The most accessible way to use OCF is to share it with an LLM and have a conversation: about a job description, an interview, a career move, anything where it helps for the model to actually know your career. The recommended pattern is bidirectional — the conversation uses OCF as substrate AND proposes updates to the master file at the end. Over time, every meaningful interaction leaves the file richer rather than starting from scratch.

OCF publishes a recommended LLM prompt at [`spec/llm-prompt.md`](spec/llm-prompt.md). Tools may use it verbatim, adapt it, or replace it. See the guide section *"OCF as Input to an AI Conversation"* for the full discussion.

You can use OCF today without a dedicated app or MCP server. Upload prior resumes or career artifacts to an LLM that can read attachments and say:

> Using the three copies of my resume I just uploaded to you, and the schema at https://opencareerformat.org/v0.1/schema.json, please walk me through the OCF process to create my master OCF. Treat prior resumes as source artifacts, preserve useful audience-specific wording as narrative variants, and propose uncertain claims as open questions instead of inventing facts. After each major step, ask whether I want to save, version, or git commit the latest accepted version.

Later, when you have a master OCF, upload it with a job description you are interested in and say:

> Given my OCF, which I just uploaded, and this job description, let's do resume prep and interview prep. First identify the best matching evidence in my OCF, then suggest any master updates, then produce a targeted resume draft and interview talking points. Respect visibility, separate facts from display wording, and remind me what I need to verify before using any output. After each major step, ask whether I want to save, version, or git commit the latest accepted version.

We strongly encourage you to ask your tool to use git, cloud document history, encrypted backups, or another versioning system of your choice for the master OCF. The format is designed to accumulate over years; versioning makes it possible to recover from bad imports, compare changes, and avoid losing work when a chat session ends.

Downstream tools should use descriptive dated filenames for generated artifacts, such as `derived/acme-ciso-2026-05-21.ocf.json` or `rendered/acme-ciso-resume-2026-05-21.pdf`, so users can tell which file belongs to which target, when it was created, and what version actually went out the door.

Tools that write back to the master should preserve fields they do not own, including IDs, provenance, source artifact references, and vendor extensions. A derived OCF may intentionally omit content, but it should remain labeled as derived and should not be used to overwrite the master accidentally.

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

OCF is currently a research-stage open specification. The format is small enough to be a candidate for adoption, but actual adoption depends on the tooling ecosystem maturing around it. Contributions, critiques, and exporter/renderer implementations are welcome.
