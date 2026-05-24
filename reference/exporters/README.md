# Reference Exporters

These are small, dependency-free example exporters. They demonstrate the mapping guidance in `mappings/`; they are not intended to be production renderers.

Exporters should normally consume a derived OCF rather than the private master. The sample commands below use the fictional examples so the scripts are easy to try.

## JSON Resume

```bash
node reference/exporters/json-resume.js spec/examples/sample-resume.ocf.json
node reference/exporters/json-resume.js spec/examples/sample-resume.ocf.json /tmp/sample-resume.resume.json
```

The exporter maps visible OCF content into the established JSON Resume shape: `basics`, `work`, `education`, `certificates`, `skills`, `projects`, `publications`, `awards`, `languages`, and `interests`.

## LinkedIn Paste Bundle

```bash
node reference/exporters/linkedin.js spec/examples/sample-resume.ocf.json
node reference/exporters/linkedin.js spec/examples/sample-resume.ocf.json /tmp/sample-linkedin.md
```

The exporter produces a Markdown paste bundle organized around LinkedIn editing areas: headline, about, contact info, experience, education, licenses and certifications, skills, projects, publications, awards, languages, and volunteer experience.

## Boundaries

- These scripts skip `private` items.
- They do not call external services.
- They do not write back to the OCF.
- They do not prove the exported wording is appropriate for a real use.
- The user must review every exported word before sending, posting, or importing it elsewhere.
