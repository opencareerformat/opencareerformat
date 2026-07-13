# Reference Tools

This directory contains small proof-of-concept tools around OCF:

- `importers/` create draft OCF files from source artifacts.
- `curators/` create curated or export-ready OCF working sets for a target context.
- `exporters/` translate export-ready OCF files into neighboring formats or paste bundles.
- `validator/` validates OCF JSON against `spec/schema.json`.
- `cli/` provides a minimal Python helper for summary output, validation delegation, and private-item filtering.
- `context/` builds disposable context views from local profiles and retrieves full items by stable ID.
- `ollama/` demonstrates a local-only LLM workflow using Ollama.

These tools are examples. They demonstrate the data flow, not a production hiring product.

The validator is different from the other reference scripts: it checks OCF files against the full current JSON Schema, verifies local referential integrity, and prints the schema version it loaded. Its first CI use is expected to be validating the repository's example OCF files against the current schema whenever the repo changes. The importer, curator, and exporters are intentionally partial examples and should not be mistaken for full schema coverage.

The importer and curator are deliberately deterministic and shallow so the pipeline can run without API keys, network access, or model behavior. They could be substantially improved by using an LLM for extraction, follow-up questions, conflict detection, audience-specific wording, and job-description matching. That would improve the tool, not change the OCF schema.

OCF is tool- and model-neutral. The Ollama example is included because local LLMs are one practical way to reduce oversharing with hosted services while still using OCF prompts and structured career memory. It is an example workflow, not a requirement or endorsement of one model provider.

## Reference Tool Maturity

These tools are intentionally bare bones. They prove the concept and make the data flow inspectable; they are not complete applications.

| Tool | Current maturity | What it demonstrates | Known limits |
|---|---|---|---|
| `validator/` | Full-schema structure check | Validates OCF JSON against the full current schema and checks local IDs and references. | Checks file integrity only; does not judge whether claims are true, well-curated, or appropriate to export. |
| `cli/ocf.py` | Minimal proof of concept | Prints key fields, delegates validation to the reference validator, and emits a schema-aware private-filtered JSON document. | Not a full editor; private filtering is not anonymization and does not judge whether remaining content is safe to share. |
| `context/ocf-context.js` | Context-loading proof of concept | Builds a non-authoritative context envelope, records withheld paths, and retrieves a complete item by local stable ID. | Context reduction is not privacy filtering; the profile format is local reference configuration, not OCF schema. |
| `importers/resume-text-to-ocf.js` | Skeleton proof of concept | Turns a very regular plain-text resume into a current-schema provisional OCF master with provenance and a review question. | Not a robust resume parser; does not handle PDFs, tables, complex layouts, conflict detection, or follow-up questions. |
| `curators/job-description.js` | Skeleton proof of concept | Scores a master OCF against target text, filters visibility, and writes a curated working file; currently smoke-tested against the current examples. | Keyword scoring only; no real judgment, no user interview, no nuanced fit analysis. |
| `exporters/json-resume.js` | Minimal mapper | Converts visible canonical OCF content into JSON Resume shape. | Does not choose among unresolved variants; loses OCF-only concepts such as cautions, open questions, provenance detail, and private memory. |
| `exporters/linkedin.js` | Minimal paste-bundle mapper | Produces Markdown from visible canonical OCF content, organized around LinkedIn editing areas. | Does not choose among unresolved variants or call LinkedIn APIs; users must review and paste manually. |
| `ollama/ocf-local-llm.js` | Local LLM proof of concept | Sends OCF prompts, schema-core, and user-provided files to a local Ollama model; can write either a transcript or a provisional-master JSON draft. | Requires local Ollama and a model; model-authored JSON still needs validator checks and human review. |

## End-to-End Demo

Import a plain-text resume into a provisional current-schema OCF master:

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

Run a local LLM intake pass with Ollama:

```bash
node reference/ollama/ocf-local-llm.js --mode authoring --model llama3.1:8b --resume spec/examples/sample-resume-source.txt --job spec/examples/sample-job-description.txt --out /tmp/ocf-local-authoring-response.md
```

Use the bundled sample resume to ask Ollama for a validator-ready provisional master:

```bash
node reference/ollama/ocf-local-llm.js --mode authoring --output provisional-master --model qwen2.5:14b --sample-resume --out /tmp/ocf-local-sample.imported.ocf.json
node reference/validator/validate.js /tmp/ocf-local-sample.imported.ocf.json
```

The importer intentionally creates only a skeleton. The curator intentionally creates only a partial curated OCF. The point is to prove the pipeline: source artifact -> provisional master -> curated working file -> downstream export.
