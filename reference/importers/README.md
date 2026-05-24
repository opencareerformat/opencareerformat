# Reference Importers

These are intentionally small proof-of-concept importers. They create draft OCF skeletons from source material; they do not complete the larger master-building process.

This deterministic importer is intentionally modest. An LLM-backed importer could extract richer structure, preserve audience-specific variants, detect conflicts across old resumes, and generate better `openQuestions`. The deterministic version exists so the repo has a runnable proof without requiring an API key.

## Resume Text Importer

```bash
node reference/importers/resume-text-to-ocf.js spec/examples/sample-resume-source.txt /tmp/draft-master.ocf.json
```

The importer expects simple resume text with headings such as `SUMMARY`, `SKILLS`, `EXPERIENCE`, `EDUCATION`, and `CERTIFICATIONS`. It creates:

- `person`
- `sourceArtifacts`
- `skills`
- `experience` with positions and achievements
- `education`
- `certifications`
- an `openQuestions` review reminder
- basic provenance on imported items

It does not infer deep reflections, variants, private notes, or a complete career archive. Review the draft, ask follow-up questions, and enrich it before treating it as a master OCF.

## LLM-Assisted Path

You can also use any LLM chat that accepts file attachments:

> Using this resume text and the current OCF schema at https://opencareerformat.org/schema.json, please walk me through the OCF process to create my master OCF. Treat this resume as a source artifact, preserve useful audience-specific wording as narrative variants, and propose uncertain claims as open questions instead of inventing facts.
