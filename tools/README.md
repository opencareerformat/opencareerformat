# Repository Maintenance Tools

These scripts keep generated OCF artifacts synchronized with the canonical full schema.

- `schema-core-projection.json` declares which parts of `schema.json` belong in the starter/core projection.
- `generate-schema-core.js` copies those fields and their transitive `$ref` dependencies into `schema-core.json`. Do not edit the generated core independently.
- `schema-semantics.json` classifies local reference fields and the few ID-shaped fields that are not local item definitions.
- `generate-schema-index.js` walks `schema.json` as an AST and writes the compact visibility/reference index used by reference tools.
- `check-schema-core.js` verifies that `schema-core.json` matches a fresh projection and that the canonical application-bootstrap starter validates against both the generated core and the full schema.
- `check-schema-copies.js` verifies that the current root, spec, and version-pinned schema copies are byte-identical.

Run the generators after changing `schema.json` or either configuration file:

```bash
node tools/generate-schema-core.js
node tools/generate-schema-core.js --check
node tools/generate-schema-index.js
node tools/check-schema-copies.js
```

CI runs the generators and fails if their checked-in outputs differ.
