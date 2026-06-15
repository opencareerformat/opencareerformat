# Language And Translation

OCF separates three language questions:

- **Spec and tooling language:** translating documentation, user-facing guides, and bootstrap prompts so more people can use OCF. English remains canonical for the schema, examples, field names, enum values, validator behavior, and reference implementations.
- **Content language:** representing the same person's career for use in another language. OCF handles this through translated sidecar files.
- **Language skills:** the languages a person speaks, reads, writes, or signs. Those belong in the top-level `languages` section and are separate from translation.

The invariant is simple: translation changes presentation, not the underlying facts.

## Whole-File Sidecars

The recommended content-translation pattern is a translated child file, not per-item translation management inside the master. Use the existing metadata and lineage fields:

- `meta.language`: the main language of this OCF file.
- `meta.translatedFrom`: the source language tag.
- `meta.source.kind: "translated"`: this file was produced as a translation.
- `meta.parentFileId`: the source OCF file's `meta.id`.
- `meta.parentVersion`: the source OCF file's `meta.version` at translation time.
- `meta.lineageNotes`: human-readable context about the translation.

The source file remains the canonical source of facts unless the user explicitly accepts a translated file as a replacement master.

## Minimal Spanish Sidecar Excerpt

This excerpt uses the fictional Maria Reyes sample. It is not a complete translated OCF file; it shows the metadata and translated headline pattern.

```json
{
  "$schema": "https://opencareerformat.org/v0.3/schema.json",
  "schemaVersion": "0.3",
  "meta": {
    "canonical": false,
    "language": "es-ES",
    "translatedFrom": "en-US",
    "source": {
      "kind": "translated"
    },
    "parentFileId": "c94ffaa9-31fd-40d7-96cd-a66725a9784a",
    "parentVersion": "db2a5a6fc562",
    "lineageNotes": "Spanish presentation sidecar excerpt translated from the English Maria Reyes sample. Facts, IDs, and schema values remain canonical."
  },
  "person": {
    "name": {
      "renderAs": "Maria E. Reyes"
    },
    "headline": "Líder de ciberseguridad que combina disciplina militar con estrategia de seguridad empresarial"
  }
}
```

## Translation Rules

- Preserve schema keys, enum values, IDs, and structured values exactly. Do not translate `reviewStatus`, `talkingPoints`, `job-description`, item IDs, or similar schema-controlled strings.
- Preserve `visibility`, provenance, review state, source artifact references, and supporting IDs.
- Translate display wording: summaries, headlines, narrative text, `renderAs` values, and exported prose.
- Be careful with proper nouns, legal entity names, credential names, ranks, occupational codes, organization names, and product names. Translate or localize them only when there is an accepted localized rendering.
- Use `renderAs` when localized display text sits over canonical structured data, such as a location or work authorization line.
- Locale formatting, such as dates, addresses, number separators, currency display, and page layout, belongs to exporters and renderers rather than the schema.

## Staleness And Review

Translated sidecars can drift when the source file changes. Use `parentVersion` to detect that the source file moved after translation.

When a source update affects translated presentation, tools should mark the translated sidecar or affected output as needing review in their own workflow. If a translated file contains reviewable OCF items that support `reviewStatus`, ordinary review state can be used there too. Do not invent a second translation-specific review mechanism before real usage proves it is needed.

## Documentation Translation

Translated documentation should name its English source, source version or commit when known, and translation date. If the English source changes materially, the translation should be marked stale or regenerated before users rely on it.

Localized bootstrap prompts should be wrappers around the canonical English prompt. They should tell the LLM to speak to the user in the target language while keeping OCF schema keys, enum values, JSON snippets, and validation behavior canonical.

The Spanish application bootstrap wrapper is an example of this pattern: [`prompts/application-bootstrap.es.md`](../prompts/application-bootstrap.es.md).

Current Spanish human-facing examples:

- [`README.es.md`](../README.es.md)
- [`index.es.html`](../index.es.html)
- [`spec/examples/worked-example-walkthrough.es.md`](examples/worked-example-walkthrough.es.md)
