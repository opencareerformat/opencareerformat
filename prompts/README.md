# OCF Prompts

These prompts are operational guidance for LLMs, coaches, curators, importers, and other tools that work with Open Career Format. They are not the schema. They may evolve faster than `schema.json`.

The current prompt URLs are intentionally not version-pinned. If you need an older prompt, use Git history. Versioned schema URLs remain available separately under paths such as `https://opencareerformat.org/v0.2/schema.json`.

## Current Prompts

- [`authoring.md`](authoring.md): create or update an OCF from resumes, notes, conversations, or other source artifacts.
- [`curation.md`](curation.md): select, question, rank, improve, and prepare content for a target or export.
- [`coaching.md`](coaching.md): help a user discover story, voice, goals, boundaries, and reflection from their OCF.
- [`llm-operating.md`](llm-operating.md): baseline behavior for conversational LLM use of OCF.
- [`interview-prep-questions.md`](interview-prep-questions.md): recommended reflection questions and portable `kind` strings.

## Metadata

Each prompt may include simple YAML front matter:

```yaml
ocfPrompt: authoring
status: current
lastUpdated: 2026-05-26
compatibleSchemaVersions:
  - "0.2"
defaultFor:
  - first-time-ocf-creation
```

The metadata is advisory. Tools should treat the prompt body as guidance and the JSON Schema as the validation contract.
