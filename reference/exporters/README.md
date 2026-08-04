# Reference Exporters

These are small, dependency-free example exporters. They demonstrate the mapping guidance in `mappings/`; they are not intended to be production renderers.

Exporters should normally consume an export-ready OCF file rather than the private master. The sample commands below use the fictional examples so the scripts are easy to try.

## JSON Resume

```bash
node reference/exporters/json-resume.js spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json
node reference/exporters/json-resume.js spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json /tmp/sample-resume.resume.json
```

The exporter maps visible OCF content into the established JSON Resume shape: `basics`, `work`, `education`, `certificates`, `skills`, `projects`, `publications`, `awards`, `languages`, `interests`, and explicitly classified volunteer service. It omits photos because JSON Resume has no OCF visibility semantics and is commonly rendered into broadly viewable HTML. It warns when visible non-volunteer service has no faithful automatic destination.

## LinkedIn Paste Bundle

```bash
node reference/exporters/linkedin.js spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json
node reference/exporters/linkedin.js spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json /tmp/sample-linkedin.md
```

The exporter produces a Markdown paste bundle organized around LinkedIn editing areas: headline, about, contact info, experience, education, licenses and certifications, skills, projects, publications, awards, languages, and explicitly classified volunteer experience. It warns rather than automatically relabeling other visible service as volunteer work.

## Boundaries

- These scripts skip `private` items.
- They do not call external services.
- They do not write back to the OCF.
- They do not prove the exported wording is appropriate for a real use.
- The user must review every exported word before sending, posting, or importing it elsewhere.
