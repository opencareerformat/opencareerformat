# OCF Reference Validator

This directory contains the local OCF JSON Schema validator. It validates OCF
JSON files against `spec/schema.json` using AJV and JSON Schema 2020-12.

Prefer local validation. OCF files often contain private career data. Do not
upload a user's OCF file to a third-party validator unless the user explicitly
asks and understands the privacy implications.

## Install

From the repository root:

```bash
npm --prefix reference/validator ci
```

## Validate Examples

From the repository root:

```bash
node reference/validator/validate.js
```

With no file arguments, the validator checks every JSON file in `spec/examples/`.

## Validate Specific Files

From the repository root:

```bash
node reference/validator/validate.js path/to/file.ocf.json
```

You can pass multiple files:

```bash
node reference/validator/validate.js first.ocf.json second.ocf.json
```

## Warn On Unknown Fields

OCF tools should preserve fields they do not own during round-trip. The full
schema still uses `additionalProperties: false` in many places so typos and
unsupported fields are visible. When you are reviewing or migrating a real file
and want unknown fields reported without failing the whole run, use:

```bash
node reference/validator/validate.js --warn-unknown path/to/file.ocf.json
```

In this mode, `additionalProperties` violations are printed as warnings. Other
schema violations still fail validation.

## What Validation Means

Validation checks structure only. A valid OCF file can still contain false
claims, stale facts, private material, or content that should not be exported or
shared with a particular recipient.

Human review is still required before treating imported material as reviewed master content,
applying proposed updates, or using any externally facing output.
