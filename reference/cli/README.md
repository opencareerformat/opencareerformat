# OCF CLI

Minimal command-line helper for inspecting OCF files.

This is intentionally a small Python standard-library script. It is not a full
editor and it does not implement schema validation itself. Validation delegates
to the reference Node/AJV validator.

## Summary

```bash
python3 reference/cli/ocf.py spec/examples/sample-resume.ocf.json
```

Prints key file fields, person headline, collection counts, and headline
positioning variants.

## Validate

```bash
python3 reference/cli/ocf.py validate spec/examples/sample-resume.ocf.json
```

Calls `node reference/validator/validate.js <file>`.

## Filter Private Items

```bash
python3 reference/cli/ocf.py --filter private spec/examples/sample-resume.ocf.json
```

Prints the whole OCF JSON document to stdout with private objects removed
recursively. It removes objects marked `"visibility": "private"` and contact
objects with omitted visibility, because contacts default to private in the
schema. For other object types, mark private content explicitly.

This is a convenience filter, not an anonymizer: organization names, dates, rare
skills, metrics, and combinations of facts can still identify someone.
