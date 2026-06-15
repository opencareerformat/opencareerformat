# OCF Reference Editor

This is a developer reference implementation for editing Open Career Format files. It is useful for local experimentation, schema UX exploration, opening existing OCF files, and simple OCF drafting. It is not intended to be the complete production editor for the full schema.

## Run Locally

This editor is a Next.js reference app. Running `npm install` creates a large local `node_modules` directory; it is ignored by Git and can be deleted and recreated from `package-lock.json` when needed.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

The editor has no LLM dependency and no server-side API-key requirement. Import, curation, and export workflows are demonstrated separately as minimal bare-bones code examples in `reference/importers`, `reference/curators`, and `reference/exporters`. LLM-assisted workflows are described in `prompts/llm-operating.md` and the guide, and can be used with any LLM tool that can follow the schema.

## Scope

The editor covers the core authoring surface: person, experience entries, positions, achievements, skills, education, certifications, and several supporting sections.

The TypeScript model is currently a partial mirror of the schema. It does not yet provide first-class editing UI for every current schema feature, including provenance, source artifacts, top-level organizations, competencies, narrative variants, title variants, reflections, goals, cautions, open questions, voice, talking points, positioning variants, and AI instructions.

Opening an existing rich OCF file and exporting it again should preserve fields that the editor does not touch, because the document is loaded and stored as a whole. New files created entirely through the editor will be shallower than the full schema until those sections get dedicated UI.

Resume import is intentionally out of scope for this editor. Use the deterministic proof-of-concept importer in `reference/importers`, or ask an LLM to follow the guide and schema, then open the resulting OCF JSON here for review and editing.

## Validation

Use the validator in `reference/validator` when you need standalone validation of example files or external OCF documents.

Future work should add richer validation feedback to file open, save, and export flows so users can see exactly what needs fixing inside the editor.
