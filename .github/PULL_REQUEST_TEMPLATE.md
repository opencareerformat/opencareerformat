## What this changes

<!-- One or two sentences. -->

## Linked issue

<!-- Issue number(s) if any. Schema changes should generally have a discussed issue before a PR. -->

## Scope

- [ ] Spec change (touches `spec/` or `mappings/`) — CC-BY 4.0
- [ ] Reference code change (touches `reference/`) — MIT
- [ ] Both

## Compatibility (for schema changes)

- [ ] Backwards-compatible (new optional field, new enum value, etc.)
- [ ] Breaking — described below

## Checklist

- [ ] `node reference/validator/validate.js` runs cleanly
- [ ] CHANGELOG entry added under `[Unreleased]`
- [ ] Documentation updated (`spec/guide.html` and related)
- [ ] If this changes example files, they still validate
- [ ] If this adds a new reflection `kind`, an audience tag, or another canonical string, it's added to the relevant doc (`spec/interview-prep-questions.md`, etc.)

## Notes for reviewer

<!-- Anything the editor should know that isn't obvious from the diff. -->
