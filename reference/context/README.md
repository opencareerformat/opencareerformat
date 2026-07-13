# OCF Context Reference

`ocf-context.js` is a dependency-free reference for selectively loading a large
OCF master into an LLM conversation. It demonstrates three operations:

1. create a local, human-readable context profile;
2. build a disposable context view while recording exactly what was withheld;
3. retrieve one complete item from the master by stable ID when the task needs it.

It does not shard or modify the master. Its output is an envelope containing an
`ocf` property, not another OCF file, and must not overwrite the source master.

## Create A Profile

Print the default `career-summary` profile:

```bash
node reference/context/ocf-context.js init
```

Or create a local editable copy. The command refuses to overwrite an existing
file:

```bash
node reference/context/ocf-context.js init ocf-context.json
```

The example [`career-summary.profile.json`](career-summary.profile.json)
withholds achievement and variant `longform`, compensation sections, reflection
text, and verbose source-artifact content. It retains the surrounding item,
including its stable ID when one exists.

## Build A Context View

```bash
node reference/context/ocf-context.js build \
  spec/examples/sample-resume.ocf.json \
  reference/context/career-summary.profile.json \
  /tmp/maria.context.json
```

Omit the profile argument to use the built-in `career-summary` profile, or omit
both optional arguments to print the view to stdout.

The `context.omitted` array records each withheld JSON path and its item ID,
kind, or label when available. The envelope also records the source master's
schema version, `meta.id`, version, and freshness marker. This makes **not
loaded** observable; it does not imply that the omitted content does not exist.
Generated views and retrieved items use compact JSON because their purpose is
to conserve model context. The local profile remains pretty-printed for people.

Context reduction is not privacy filtering. The view can still contain private
career data. Decide where the model runs and apply visibility filtering or
curation separately when needed.

## Retrieve A Full Item

When the model needs a withheld story, retrieve it from the complete master:

```bash
node reference/context/ocf-context.js get \
  spec/examples/sample-resume.ocf.json \
  meridian-health-systems-director-of-cybersecurity-never-on-resume-story-reflection
```

The command fails if the ID is absent or not unique. It does not provide
cross-person lookup and does not treat IDs as global identifiers.

These scripts are intentionally small and opinionated enough to test the
context-profile idea. The profile shape is reference-tool configuration, not
part of the OCF schema or a promised interchange standard. See [Selective
Context Without Splitting the Master](../../spec/context-profiles.md) for the
design rationale and the limits of the first conservative profile.
