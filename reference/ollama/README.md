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

Use this when the user has source material but no master OCF yet and wants a reviewable transcript:

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

It asks the local model to produce an OCF-oriented intake pass and proposed next steps. The default output is a Markdown transcript, not a validated OCF file.

## Emit an Imported Starter

Use `--output imported-starter` when you want the local model to return OCF JSON that can be passed directly to the validator:

```bash
node reference/ollama/ocf-local-llm.js \
  --mode authoring \
  --output imported-starter \
  --model qwen2.5:14b \
  --sample-resume \
  --out /tmp/ocf-local-sample.imported.ocf.json

node reference/validator/validate.js /tmp/ocf-local-sample.imported.ocf.json
```

`--sample-resume` uses `spec/examples/sample-resume-source.txt`. For another resume or source text, use `--resume <source.txt>` instead:

```bash
node reference/ollama/ocf-local-llm.js \
  --mode authoring \
  --output imported-starter \
  --model qwen2.5:14b \
  --resume spec/examples/sample-resume-source.txt \
  --out /tmp/ocf-local-imported.ocf.json
```

In this mode the script gives Ollama a compact full-validator contract, asks for strict JSON, extracts the first JSON object if the model wraps it, writes pretty-printed JSON, and prints the validator command. It does not repair schema mistakes in the generated object. Validation is still a separate step, and a passing file still needs human review for truth, privacy, and judgment.

Model choice matters. In local testing, `qwen2.5:14b` produced validator-ready JSON for the bundled sample resume with this prompt. Smaller models may return valid JSON that still fails the full OCF schema; treat that as a prompt/model capability result, not something this script silently fixes.

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

This script invokes the local `ollama` command, using `/usr/local/bin/ollama` when present or `OLLAMA_BIN` when set. It does not call hosted LLM APIs.

That does not make the workflow magically risk-free. The input files, generated output, shell history, editor temp files, model logs, backups, and the laptop itself are still your responsibility. Treat OCF files like other sensitive personal documents.

## Validate Separately

If a local model produces JSON that claims to be OCF, save it and validate it separately:

```bash
node reference/validator/validate.js /tmp/model-output.ocf.json
```

Validation checks structure only. It does not verify truth, attribution, privacy, or whether the content should be shared.
