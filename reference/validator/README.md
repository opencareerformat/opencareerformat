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

## What Validation Means

Validation checks structure only. A valid OCF file can still contain false
claims, stale facts, private material, or content that should not be exported or
shared with a particular recipient.

Human review is still required before treating an imported starter as a master,
applying proposed updates, or using any externally facing output.
