# Reference Tools

This directory contains small proof-of-concept tools around OCF:

- `importers/` create draft OCF files from source artifacts.
- `curators/` derive smaller OCF files for a target context.
- `exporters/` translate derived OCF files into neighboring formats or paste bundles.
- `validator/` validates OCF JSON against `spec/schema.json`.
- `editor/` is a local reference editor.

These tools are examples. They demonstrate the data flow, not a production hiring product.

The importer and curator are deliberately deterministic and shallow so the pipeline can run without API keys, network access, or model behavior. They could be substantially improved by using an LLM for extraction, follow-up questions, conflict detection, audience-specific wording, and job-description matching. That would improve the tool, not change the OCF schema.

## End-to-End Demo

Import a plain-text resume into a draft master OCF:

```bash
node reference/importers/resume-text-to-ocf.js spec/examples/sample-resume-source.txt /tmp/draft-master.ocf.json
node reference/validator/validate.js /tmp/draft-master.ocf.json
```

Curate the richer fictional sample OCF for a healthcare cybersecurity director job:

```bash
node reference/curators/job-description.js spec/examples/sample-resume.ocf.json spec/examples/sample-job-description.txt /tmp/derived.ocf.json
node reference/validator/validate.js /tmp/derived.ocf.json
```

Export the derived OCF:

```bash
node reference/exporters/json-resume.js /tmp/derived.ocf.json /tmp/derived.resume.json
node reference/exporters/linkedin.js /tmp/derived.ocf.json /tmp/derived-linkedin.md
```

The importer intentionally creates only a skeleton. The curator intentionally creates only a partial derived OCF. The point is to prove the pipeline: source artifact -> draft master OCF -> derived OCF -> downstream export.
