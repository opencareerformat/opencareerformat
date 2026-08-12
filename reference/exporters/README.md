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

## RenderCV YAML

```bash
node reference/exporters/rendercv.js path/to/resume.export-ready.ocf.json /tmp/resume.rendercv.yaml
```

Unlike the earlier permissive proof exporters, the RenderCV exporter enforces the conversation-to-render boundary. It refuses input that is not labeled `export-ready`, still contains unresolved open questions or title/narrative variants, or lacks fields required by the target RenderCV entry type. It filters private branches, maps the approved content into deterministic YAML, and prints a mapping summary to stderr.

The exporter does not require RenderCV and does not execute it. See [`../renderers/README.md`](../renderers/README.md) for the optional local rendering step and [`../../mappings/rendercv.md`](../../mappings/rendercv.md) for the mapping contract.

## Boundaries

- These scripts skip `private` items.
- They do not call external services.
- They do not write back to the OCF.
- They do not prove the exported wording is appropriate for a real use.
- The user must review every exported word before sending, posting, or importing it elsewhere.
