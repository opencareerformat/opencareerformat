# Reference Curators

Curators turn a master OCF into a derived OCF for a target context. These proof-of-concept curators are intentionally incomplete: they demonstrate the data flow, not a production-quality tailoring strategy.

This deterministic curator is intentionally shallow. An LLM-backed curator could read the target context more accurately, explain tradeoffs, preserve better narrative variants, ask follow-up questions, and produce a stronger derived OCF. The deterministic version exists so the repo has a runnable proof without requiring an API key.

## Job Description Curator

```bash
node reference/curators/job-description.js spec/examples/sample-resume.json spec/examples/sample-job-description.txt /tmp/derived.ocf.json
```

The curator:

- reads a master OCF and a job description
- requires the input master to have `meta.id`
- removes private items
- keyword-scores experience, positions, achievements, skills, and certifications
- keeps a small matching subset
- assigns a fresh derived `meta.id` and points `meta.derivedFrom` back to the master
- sets `meta.canonical: false`
- records derivation notes

It should not produce a perfect downstream OCF. A real curator would ask questions, handle audience strategy, preserve more context, explain tradeoffs, and let the user accept or reject selections.
