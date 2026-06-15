# OCF Prompts

These prompts are operational guidance for LLMs, coaches, curators, importers, and other tools that work with Open Career Format. They are not the schema. They may evolve faster than `schema.json`.

The current prompt URLs are intentionally not version-pinned. If you need an older prompt, use Git history. Versioned schema URLs remain available separately under paths such as `https://opencareerformat.org/v0.2/schema.json`.

## Schema vs Advice

The prompts deliberately blur a line that the schema keeps sharp. They mention real OCF fields such as `sourceArtifacts`, `cautions`, `openQuestions`, `narrativeVariants`, `visibility`, and `provenance`; when they do that, the JSON Schema remains the validation contract. They also give behavioral advice: ask better questions, avoid generic resume prose, read cautions before drafting, switch into coaching when the user is trying to find their story, and suggest what should be saved for next time.

Treat those as different kinds of instruction:

- **Schema facts** describe fields that can exist in an OCF file and must validate against the schema.
- **Conventions** describe recommended patterns that improve portability but are not hard validation rules.
- **Advice** describes how a careful tool, coach, or LLM should behave in a conversation.

If a prompt and the schema seem to disagree, the schema wins for file structure. The prompt may still be useful as advice about what to ask, what to preserve, and what to flag for review.

## Current Prompts

- [`application-bootstrap.md`](application-bootstrap.md): single-fetch first-session prompt for resume-plus-job-description application help.
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
  - "0.3"
defaultFor:
  - first-time-ocf-creation
```

The metadata is advisory. Tools should treat the prompt body as guidance and the JSON Schema as the validation contract.
