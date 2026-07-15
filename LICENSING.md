# Licensing

Open Career Format uses different licenses for different artifact types.

## Specification, Documentation, Prompts, and Examples

The following are licensed under the Creative Commons Attribution 4.0 International license (CC BY 4.0), in [`LICENSE-spec`](LICENSE-spec):

- `spec/`
- `mappings/`
- `prompts/`
- `skills/`
- `schema.json`
- `schema-core.json`
- `llms.txt`
- `v*/schema.json`
- root project documentation such as `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, and `SECURITY.md`
- repository metadata and templates under `.github/`

This side of the project is meant to be read, copied, quoted, adapted, and implemented by people, LLMs, and tools, with attribution.

## Reference Implementations

Code under `reference/` and repository maintenance code under `tools/` are licensed under the MIT License, in [`LICENSE-code`](LICENSE-code).

This includes the validator, importers, curators, exporters, renderers, CLI code, generators, and repository checks. The reference implementations are examples, not the normative schema.

## Why Two Licenses?

OCF has two kinds of material:

- prose, schemas, prompts, skills, examples, mappings, and project documentation that explain the format and its intended use;
- runnable reference code that developers may want to copy into their own tools.

CC BY 4.0 is a better fit for the specification and documentation. MIT is a better fit for code.

If a file combines prose and code snippets, treat the surrounding file according to its location. A code snippet in the spec is explanatory; production code under `reference/` is MIT-licensed.

## Contributions

By contributing to this repository, you agree that your contribution is licensed under the license that applies to the files you modify.

If you are unsure which license applies to a new file, ask in the issue or pull request before adding it.
