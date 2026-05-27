# Ollama Local LLM Proof of Concept

This directory contains a minimal example of using a local Ollama model with OCF prompts and schemas.

It is intentionally bare bones. It proves that an OCF workflow can run without sending the resume, job description, or OCF file to a hosted LLM provider. It is not a production importer, curator, coach, or exporter.

OCF is tool- and model-neutral. Ollama is shown here because a local model is a useful answer to one common privacy concern: "I want help from an LLM, but I do not want this career material leaving my computer." Other local runtimes could follow the same pattern.

## Prerequisites

- Ollama installed and running locally.
- A local model pulled, such as `llama3.1:8b`, `qwen2.5:14b`, or another model your laptop can run.

Example:

```bash
ollama pull llama3.1:8b
```

## Author From Source Material

Use this when the user has source material but no master OCF yet:

```bash
node reference/ollama/ocf-local-llm.js \
  --mode authoring \
  --model llama3.1:8b \
  --resume spec/examples/sample-resume-source.txt \
  --job spec/examples/sample-job-description.txt \
  --out /tmp/ocf-local-authoring-response.md
```

The script reads:

- `llms.txt`
- `schema-core.json`
- `prompts/authoring.md`
- the resume/source material you provide
- the job description if provided

It asks the local model to produce an OCF-oriented intake pass and proposed next steps. The output is a Markdown transcript, not a validated OCF file.

## Curate From an Existing OCF

Use this when the user already has an OCF and wants help with a target:

```bash
node reference/ollama/ocf-local-llm.js \
  --mode curation \
  --model llama3.1:8b \
  --ocf spec/examples/sample-resume.ocf.json \
  --job spec/examples/sample-job-description.txt \
  --out /tmp/ocf-local-curation-response.md
```

The script reads:

- `llms.txt`
- `schema-core.json`
- `prompts/curation.md`
- the OCF file you provide
- the job description if provided

## Privacy Boundary

This script only calls `http://127.0.0.1:11434/api/generate`. It does not call hosted LLM APIs.

That does not make the workflow magically risk-free. The input files, generated output, shell history, editor temp files, model logs, backups, and the laptop itself are still your responsibility. Treat OCF files like other sensitive personal documents.

## Validate Separately

If a local model produces JSON that claims to be OCF, save it and validate it separately:

```bash
node reference/validator/validate.js /tmp/model-output.ocf.json
```

Validation checks structure only. It does not verify truth, attribution, privacy, or whether the content should be shared.
