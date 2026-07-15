# OCF CLI

Minimal command-line helper for inspecting OCF files.

This is intentionally a small Python standard-library script. It is not a full
editor and it does not implement schema validation itself. Validation delegates
to the reference Node/AJV validator.

## Summary

```bash
python3 reference/cli/ocf.py spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json
```

Prints key file fields, person headline, collection counts, and headline
positioning variants.

## Validate

```bash
python3 reference/cli/ocf.py validate spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json
```

Calls `node reference/validator/validate.js <file>`.

## Filter Private Items

```bash
python3 reference/cli/ocf.py --filter private spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json
```

Prints the whole OCF JSON document to stdout with private objects removed
recursively. It uses the compact schema index generated from `schema.json` and
removes objects explicitly marked private or private by their schema default.
When filtering removes a locally defined item, references to that removed item
are also removed so the output does not retain dangling local pointers. The
runtime filter uses only Node.js built-in modules.

This is a convenience filter, not an anonymizer: organization names, dates, rare
skills, metrics, and combinations of facts can still identify someone.
Unknown extension namespaces are preserved because a generic OCF tool cannot know
their meaning. The filter removes explicit and schema-default private objects, but
it cannot prove that arbitrary extension content is safe to share. The user or an
extension-aware curator remains responsible for deciding whether that content
belongs in a particular output.
