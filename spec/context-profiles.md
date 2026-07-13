# Selective Context Without Splitting the Master

An OCF master is intentionally broader than any one resume, application, interview, or conversation. Over time it may contain years of roles, achievements, alternate wording, cautions, source records, and stories preserved in the person's own words. That completeness is useful, but a model rarely needs all of it at once.

The first response should not be to split the person's career memory into competing partial masters. OCF is testing a smaller step: keep one complete authoritative master and create disposable context views containing what a tool or model needs to know at that time.

## The Basic Pattern

The pattern has four parts:

1. **Complete master:** The candidate-owned OCF remains the authoritative career record.
2. **Local profile:** A small, readable configuration describes which expensive fields to withhold for a particular kind of task.
3. **Disposable view:** A local tool creates a reduced context envelope and records exactly what was not loaded.
4. **Selective retrieval:** If the task needs a withheld story or other durable item, the tool retrieves that complete item from the master by its file-local stable ID.

Accepted improvements flow back to the complete master after user review. The context view is never promoted into a replacement master and never becomes a second source of career truth.

```text
complete OCF master
        |
        | local context profile
        v
disposable context view  ----------> model or tool
        ^                                  |
        |                                  | request item ID
        +------ full item from master <----+

accepted, reviewed improvements ----------> complete OCF master
```

## What "Not Loaded" Means

A reduced view must not turn absence into a false claim.

If a long-form story is withheld, the model should be able to see that an item exists, recognize that its text was not loaded, and request it by ID. It must not conclude that the person has no story, no reflection, or no supporting evidence merely because that material was excluded from the current context.

For that reason, a context envelope should retain:

- the source master's `meta.id`, schema version, file version, and freshness marker;
- stable IDs and compact metadata for withheld durable items when available;
- an explicit list of withheld paths or categories;
- a clear statement that the view is disposable and non-authoritative.

## What The First Reference Proves

The dependency-free [`reference/context/ocf-context.js`](../reference/context/ocf-context.js) script implements a deliberately conservative `career-summary` profile. It withholds achievement and variant `longform`, compensation sections, reflection text, and verbose source-artifact content while retaining the surrounding structures.

Against the fictional Maria example, the profile records eight withheld fields, leaves the never-on-resume story discoverable by stable ID, and can retrieve the complete verbatim story from the master. The normalized payload becomes only about six percent smaller.

That modest reduction is acceptable for this first proof. The experiment is testing whether selective loading is understandable and safe before it tries to maximize compression. It demonstrates that:

- the master can remain untouched;
- omission can be explicit rather than ambiguous;
- a model can begin with reduced context;
- a specific complete item can be loaded when needed;
- the mechanism requires no hosted OCF service, hidden database, or schema change.

It does **not** yet prove that `career-summary` is the right profile, that the reduction is large enough for every master, or that long-form stories are the only material worth deferring.

## Why Start Conservatively

Aggressive reduction designed in the abstract would risk removing the exact nuance that makes OCF useful. A job application, career review, interview-preparation session, and public-profile update may each need different combinations of facts, cautions, voice, variants, and stories.

Profiles should become more selective only after observing real tasks:

- Which sections are almost always loaded together?
- Which omitted items do models request?
- Do models ask for stories individually, by role, or as a story bank?
- Which compact metadata helps a model decide what to retrieve?
- Which content is expensive but still important as a drafting control?
- When does selective loading stop being enough and physical sharding become worthwhile?

The current profile is therefore a probe, not an optimization target.

## Local Configuration, Not Career State

A context profile describes how a particular local tool loads a file. It does not describe the person's career and does not belong in the OCF schema.

The profile should remain:

- local and controlled by the user;
- plain JSON or another readable format;
- optional and replaceable;
- unnecessary for interpreting an ordinary OCF file;
- free of activity logs, hidden synchronization state, and career facts.

Other developers should be able to write a different profile generator without asking permission or depending on an OCF-hosted runtime.

## Context Reduction Is Not Privacy Filtering

Reducing model context does not make a file safe to share. A context view may still contain private contact details, sensitive dates, cautions, internal stories, or identifying combinations of facts.

Visibility filtering, target-specific curation, model/provider trust, and user approval remain separate decisions. A tool must not advertise a context profile as anonymization or as permission to send the resulting view to a hosted model.

## Try The Reference

Create an editable local profile:

```bash
node reference/context/ocf-context.js init ocf-context.json
```

Build a disposable view:

```bash
node reference/context/ocf-context.js build \
  person.master.ocf.json \
  ocf-context.json \
  person.context.json
```

Retrieve one complete item after the model or user requests its ID:

```bash
node reference/context/ocf-context.js get \
  person.master.ocf.json \
  ITEM_ID
```

The profile shape and context envelope are reference-tool conventions. They are intentionally outside the OCF schema and may change as the experiment produces evidence.
