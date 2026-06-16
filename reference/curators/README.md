# Reference Curators

Curators turn a master OCF into a curated working file or export-ready input for a target context. These proof-of-concept curators are intentionally incomplete: they demonstrate the data flow, not a production-quality tailoring strategy.

This deterministic curator is intentionally shallow. An LLM-backed curator could read the target context more accurately, explain tradeoffs, preserve better narrative variants, ask follow-up questions, and produce a stronger curated file. The deterministic version exists so the repo has a runnable proof without requiring an API key.

`job-description.js` expects current-schema OCF input and is smoke-tested against the current examples. It preserves the input file's declared `schemaVersion` in the curated output; it is not a schema migration tool.

## Job Description Curator

```bash
node reference/curators/job-description.js spec/examples/sample-resume.ocf.json spec/examples/sample-job-description.txt /tmp/sample.candidate-curated.ocf.json
```

For a stricter public-only demonstration, strip both private and shared items:

```bash
node reference/curators/job-description.js --public-only spec/examples/sample-resume.ocf.json spec/examples/sample-job-description.txt /tmp/public-only.ocf.json
```

The curator:

- reads a master OCF and a job description
- requires the input master to have `meta.id`
- removes private items by default, or private and shared items with `--public-only`
- keyword-scores experience, positions, achievements, skills, and certifications
- keeps a small matching subset
- assigns a fresh curated file `meta.id` and points `meta.parentFileId` back to the master
- records curation notes in `meta.lineageNotes`

It should not produce a perfect downstream OCF. A real curator would ask questions, handle audience strategy, preserve more context, explain tradeoffs, and let the user accept or reject selections.
