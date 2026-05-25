# Reference Tools

This directory contains small proof-of-concept tools around OCF:

- `importers/` create draft OCF files from source artifacts.
- `curators/` create curated or export-ready OCF working sets for a target context.
- `exporters/` translate export-ready OCF files into neighboring formats or paste bundles.
- `validator/` validates OCF JSON against `spec/schema.json`.
- `editor/` is a local reference editor.

These tools are examples. They demonstrate the data flow, not a production hiring product.

The validator is different from the other reference scripts: it checks OCF files against the full current JSON Schema. Its first CI use is expected to be validating the repository's example OCF files against the current schema whenever the repo changes. The importer, curator, exporters, and editor are intentionally partial examples and should not be mistaken for full schema coverage.

The importer and curator are deliberately deterministic and shallow so the pipeline can run without API keys, network access, or model behavior. They could be substantially improved by using an LLM for extraction, follow-up questions, conflict detection, audience-specific wording, and job-description matching. That would improve the tool, not change the OCF schema.

## Reference Tool Maturity

These tools are intentionally bare bones. They prove the concept and make the data flow inspectable; they are not complete applications.

| Tool | Current maturity | What it demonstrates | Known limits |
|---|---|---|---|
| `validator/` | Full-schema structure check | Validates OCF JSON against the full current schema. | Checks structure only; does not judge whether claims are true, well-curated, or appropriate to export. |
| `importers/resume-text-to-ocf.js` | Skeleton proof of concept | Turns a very regular plain-text resume into an `imported-starter` OCF with provenance and an open question. | Not a robust resume parser; does not handle PDFs, tables, complex layouts, conflict detection, or follow-up questions. |
| `curators/job-description.js` | Skeleton proof of concept | Scores a master OCF against target text, filters visibility, and writes a curated working file. | Keyword scoring only; no real judgment, no user interview, no nuanced fit analysis. |
| `exporters/json-resume.js` | Minimal mapper | Converts visible OCF content into JSON Resume shape. | Loses OCF-only concepts such as cautions, open questions, provenance detail, and private memory. |
| `exporters/linkedin.js` | Minimal paste-bundle mapper | Produces Markdown organized around LinkedIn editing areas. | Does not call LinkedIn APIs; users must review and paste manually. |
| `editor/` | Partial local editor | Lets a user open, edit, and save common OCF sections locally. | Covers only part of the schema; unsupported sections may round-trip as JSON but are not fully editable in the UI. |

## End-to-End Demo

Import a plain-text resume into an imported starter OCF:

```bash
node reference/importers/resume-text-to-ocf.js spec/examples/sample-resume-source.txt /tmp/sample.imported.ocf.json
node reference/validator/validate.js /tmp/sample.imported.ocf.json
```

Curate the richer fictional sample OCF for a healthcare cybersecurity director job:

```bash
node reference/curators/job-description.js spec/examples/sample-resume.ocf.json spec/examples/sample-job-description.txt /tmp/sample.candidate-curated.ocf.json
node reference/validator/validate.js /tmp/sample.candidate-curated.ocf.json
```

Export the curated OCF:

```bash
node reference/exporters/json-resume.js /tmp/sample.candidate-curated.ocf.json /tmp/sample.resume.json
node reference/exporters/linkedin.js /tmp/sample.candidate-curated.ocf.json /tmp/sample-linkedin.md
```

The importer intentionally creates only a skeleton. The curator intentionally creates only a partial curated OCF. The point is to prove the pipeline: source artifact -> imported starter -> curated working file -> downstream export.
