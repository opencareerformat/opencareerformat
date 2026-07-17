# Contributing to Open Career Format

Thank you for considering a contribution. OCF is a small, opinionated spec maintained by a single editor who started it after getting tired of tracking too many resume versions. This document explains how proposals are received, considered, and decided so the process is predictable.

## Before You Start

A few things are worth checking before opening anything:

1. **Read the [What OCF Does Not Do](https://opencareerformat.org/spec/design-guide.html#what-ocf-does-not-do) section of the Design Guide.** OCF deliberately doesn't specify how content is elicited, how it's rendered, how it's scored against job descriptions, or how institutional truth is verified and adjudicated. Proposals that try to extend the spec into those areas will generally be declined with a pointer back to this section.

2. **Check the [CHANGELOG](CHANGELOG.md).** A surprising number of "this should be added" ideas have already been considered. If something is marked as deferred to a future version, the issue or discussion that led to that decision is usually linked.

3. **Decide whether your idea is a Discussion or an Issue.** Open-ended exploration ("should OCF support X kind of content?") belongs in [Discussions](https://github.com/opencareerformat/opencareerformat/discussions). Concrete proposals ("adding this field with this shape would allow people who do X to describe Y") belong in [Issues](https://github.com/opencareerformat/opencareerformat/issues). If you are not a developer and simply hit a missing use case, use the *Use case or suggestion* issue template and describe what you were trying to do in plain language.

## Design Posture

OCF is an open schema, not a standards committee. Real workflows, examples, and interoperability needs carry more weight than abstract preferences. Naming, structure, and scope debates should be grounded in a concrete user or tool problem: what someone was trying to preserve, curate, export, validate, or exchange, and why the existing shape failed.

The project is intentionally small and candidate-owned. The schema defines what gets preserved and how it stays portable. Reference prompts, examples, mappings, and code can show one practical way to use the format, but they do not turn every tool behavior into a schema requirement.

## Kinds of Contributions

The repository accepts contributions in these rough categories. Each has its own issue template.

**Schema changes** — additions to or modifications of the JSON Schema. These get the most scrutiny because they're the most committing. Use the *Schema Change* template; expect questions about backwards compatibility, motivating use cases, and prior art in adjacent formats.

**Use cases and suggestions** — plain-language reports of something OCF could not express or a workflow that felt awkward. Use the *Use case or suggestion* template. You do not need to propose a schema shape; concrete examples are enough. Try to indicate how this increases the value of leveraging OCF to describe careers.

**Prose improvements** — clarifications, typo fixes, better examples in the spec guide. Use the *Prose Improvement* template. These usually land quickly and are greatly appreciated.

**New examples or mappings** — adding to `spec/examples/` or `mappings/`. Examples should validate; mapping documents should follow the structure of any existing mapping doc.

**Bug reports** — broken validator runs, invalid examples, contradictions in the spec. Use the *Bug Report* template.

**Reference implementations and maintenance tools** — code in `reference/` and `tools/` (validators, curators, renderers, exporters, importers, generators, and repository checks). These are MIT-licensed (see `LICENSE-code`) and the bar is "does it work, is it readable, does it match the spec." No requirement to match a specific style or framework.

Do not edit `schema-core.json` independently. It is generated from `schema.json` using `tools/schema-core-projection.json`; change the full schema or the projection configuration, then run `node tools/generate-schema-core.js`.

## Licensing

OCF is dual-licensed by artifact type:

- Specification, mapping, prompt, skill, example, and project documentation contributions are licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). This includes `spec/`, `mappings/`, `prompts/`, `skills/`, root documentation, schemas, examples, and issue/PR templates unless noted otherwise.
- Reference implementation and repository maintenance code under `reference/` and `tools/` is licensed under MIT.

See [`LICENSING.md`](LICENSING.md) for the umbrella explainer. By contributing, you agree that your contribution is licensed under the license that applies to the files you touch.

## The Process

1. **Discover and discuss.** Open a Discussion if you want feedback on an idea before committing to a proposal. Open an Issue when you have a concrete shape in mind.
2. **Editor responds.** Expect a response within one to two weeks for 0.x-era traffic; longer is possible for proposals that need careful thought, in which case the issue gets labeled `in-consideration` so you know it's not been forgotten.
3. **Decision.** Every proposal gets one of four outcomes:
   - **Accept as proposed.** You or the editor opens a PR; once merged, a CHANGELOG entry is added.
   - **Accept with revisions.** The editor describes the changes wanted; you (or the editor) revises.
   - **Defer.** The proposal is real and considered, but not for this version. Labeled and milestoned to a future version.
   - **Decline.** Closed with a specific reason. Common decline reasons: conflicts with Non-Goals; out of scope for OCF as a portable format; would require breaking changes inappropriate for the current version; covered by an existing field or pattern.
4. **Merge and release.** Accepted changes accumulate against a milestone. When a milestone is ready (or feels organic), the editor cuts a release: bumps `schemaVersion` and `$id`, updates the CHANGELOG, tags the commit, and announces.

## Versioning Policy

OCF follows a relaxed semver during the 0.x series and strict semver from 1.0 onward.

OCF is currently pre-1.0 and in beta. The current schema alias (`https://opencareerformat.org/schema.json`) may change as feedback comes in. Tools that need stability should pin to a versioned schema URL. Breaking changes may occur before 1.0 and will be documented in the changelog.

**0.x (current).** Small breaking changes are possible between minor versions; the CHANGELOG documents every change. Optional fields can be added without notice; required fields, enum tightening, or removals get flagged.

**1.0 and after.** Minor versions are additive only — a 1.1 schema validates every 1.0 file. Major versions can be breaking, but the migration path is documented.

The schema's `$id` URL includes the version (e.g. `https://opencareerformat.org/v0.3/schema.json`). Older versions remain accessible at their URLs after newer versions ship; nothing breaks just because a new version is released.

## Before You Push

Run the repository's generated-artifact and behavior checks from the repository root:

```bash
node tools/generate-schema-core.js
node tools/generate-schema-index.js
node tools/check-schema-copies.js
node reference/validator/validate.js
node tools/check-schema-core.js
node reference/test/run.js
node tools/generate-doc-html.js
node tools/check-worked-example-snippets.js
git diff --exit-code
```

The generators update checked-in files. Review those changes before committing. `index.html` and
the static `index.{language}.html` gateways are hand-authored; the other checked-in HTML counterparts
produced by `tools/generate-doc-html.js` are generated from Markdown.

## Editor's Preferences (Informal)

These aren't binding rules, but they describe what kinds of proposals tend to land vs. get declined. Sharing them upfront saves everyone time.

**Likely to land:**
- Small additions that fix real interop problems (e.g., the structured issuer + DID work we did to enable LER-RS export)
- Optional fields that earn their place — they unlock a specific tool behavior or improve a specific output
- Documentation clarifications, better examples, fixed contradictions
- New entries in canonical lists (interview-prep question kinds, audience tag conventions, taxonomy framework names) when supported by real use
- Mapping documents for new target formats
- New reference implementations in `reference/`

**Likely to be declined:**
- Required fields that don't exist for a clear interop reason
- Fields that prescribe how content is *elicited* (that's tool work)
- Fields that prescribe how content is *rendered* (that's renderer work)
- Fields that prescribe how content is *scored* against external opportunities (that's matching work)
- Fields that make OCF adjudicate institutional truth or mirror external registries (that's verifier, issuer, registry, employer, school, board, court, or consumer work)
- Fields that duplicate what `extensions` can already carry
- Personality/assessment frameworks (DISC, MBTI, etc.) — too contested to standardize
- Heavy structure for content that's still emerging (the spec prefers `$comment` placeholders over committing to fields the ecosystem hasn't proven)

**Will be declined politely:**
- Drive-by feature requests with no motivating use case
- "X format does it this way, OCF should too" without justification
- Renaming proposals without evidence of real user or tool confusion
- Broad rewrites based mainly on personal preference
- "This should be more general" proposals without a concrete workflow that fails today
- Tool-behavior proposals that belong in prompts, examples, mappings, or reference tools rather than the schema
- Personal-data-format proposals (resumes/profiles for self-promotion) — OCF's design is candidate-owned, narrative-rich, and small; adopters extend through `extensions`, not by adding fields to the core

## Code of Conduct

Be kind. Argue the proposal, not the proposer. Disagreement is welcome; condescension isn't. The editor reserves the right to close any discussion that crosses the line and to remove repeat offenders.

## Response Times

This is a one-editor project. Realistic response time during early public development:
- **Bug reports:** within a week
- **Schema-change proposals:** one to two weeks for the first response
- **PRs to spec prose / examples / mapping docs:** within a week
- **Discussions:** when there's something useful to add (no SLA)

If something has been sitting for longer than that, feel free to leave a comment asking for an update. It's not rude — it's helpful.

## Questions

Open a Discussion. Questions don't need an issue; they need a conversation.

## Saying Thanks

If OCF helped you or you implemented something with it, a short note in [Discussions](https://github.com/opencareerformat/opencareerformat/discussions) is welcome. It helps the project understand which parts of the format are useful for real people.
