# OCF Example Files

Canonical example OCF files used by the validator and by tool authors as references.

| File | Description |
|------|-------------|
| `sample-resume.json` | A fictional but richly-built example covering most of the schema surface — Maria C. Reyes, a cybersecurity leader with military background. Includes a worked demonstration of the conversational-mining pattern (`mhs-ransomware-2024`) and a "stays in master but typically curated out" item (`mhs-mssp-transition`) so readers can inspect both patterns directly. |
| `repeated-organization-variants.json` | A compact fictional example showing a reusable `organizations` record referenced by two separate tenures, a `sourceArtifacts` registry for old resumes / pasted chat data, bullet-level `narrativeVariants`, and position-level `titleVariants` with required basis. |

All files in this directory validate against `../schema.json` and are exercised by `reference/validator/validate.js`. They are fictional; do not infer real persons or events.
