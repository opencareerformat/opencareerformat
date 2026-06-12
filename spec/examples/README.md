# OCF Example Files

Canonical example OCF files used by the validator and by tool authors as references.

| File | Description |
|------|-------------|
| [`worked-example-walkthrough.md`](worked-example-walkthrough.md) | Narrative walkthrough of the example lifecycle: source resume, imported starter, richer candidate master, target curation, export, and updates flowing back. |
| [`sample-resume.md`](sample-resume.md) | Explanation and history for the Maria E. Reyes sample set: how the source resume became a richer OCF, what review passes added, and what readers should notice. |
| `sample-resume-source.txt` | Fictional source resume used as the starting material for `sample-resume.ocf.json` and the reference importer example. |
| `sample-resume.ocf.json` | A fictional but richly-built example covering most of the schema surface — Maria E. Reyes, a cybersecurity leader with military background. Includes a worked demonstration of the conversational-mining pattern (`mhs-ransomware-2024`), a military progression pattern where rank/MOS details matter differently by audience, and a "stays in master but typically curated out" item (`mhs-mssp-transition`) so readers can inspect those patterns directly. |
| `sample-job-description.txt` | Fictional target job description used by the reference curator examples. |
| `repeated-organization-variants.json` | A compact fictional example showing a reusable `organizations` record referenced by two separate tenures, a `sourceArtifacts` registry for old resumes / pasted chat data, bullet-level `narrativeVariants`, and position-level `titleVariants` with required basis. |
| `sales-compensation-private.json` | A compact fictional example showing private compensation history and sales quota records alongside shareable quota-attainment achievements and a public podcast appearance. |
| `open-source-project.json` | A compact fictional example showing independent open-source work as a top-level `projects` entry with a GitHub repository link, public achievements, skills, and renderer grouping. |

All files in this directory validate against `../schema.json` and are exercised by `reference/validator/validate.js`. They are fictional; do not infer real persons or events.

For the minimal first-time user flow, use `prompts/application-bootstrap.md`: read the resume and job description, ask whether an OCF exists, produce the requested application help, ask one story question, and save an imported-starter OCF or proposed update set for next time.
