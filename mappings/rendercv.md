# OCF to RenderCV Mapping

This document describes how a reviewed, export-ready Open Career Format file maps to [RenderCV](https://rendercv.com/) YAML.

The direction is:

```text
export-ready OCF -> RenderCV YAML -> RenderCV -> PDF / Typst / Markdown / HTML / PNG
```

RenderCV YAML and rendered files are outputs. They are not replacements for the candidate-owned OCF master.

## Workflow Boundary

The RenderCV exporter starts after a curation conversation has finished. During curation, the person and tool decide which claims, wording, contacts, sections, and ordering belong in this particular resume. The result is a new OCF child with `meta.fileRole: "export-ready"` and lineage back to the source master.

The exporter must not:

- choose among unresolved title or narrative variants;
- answer open questions;
- select achievements from a broad master;
- rewrite claims to improve fit or layout;
- infer missing facts required by RenderCV;
- treat a generated file as an update to the master.

If the rendered document reveals a content problem, return to curation and create a revised export-ready snapshot. If only typography or theme changes, rerender the same RenderCV YAML or export-ready snapshot with different render options.

## Input Readiness

The reference exporter requires:

- `meta.fileRole` to be `export-ready`;
- `person.name.renderAs`;
- at least one supported visible resume section;
- no unresolved `openQuestions` other than entries explicitly marked `do-not-use` or `superseded`;
- no remaining `titleVariants` or `narrativeVariants`;
- target-required fields such as an experience title, education institution and field, or publication title and authors.

An export-ready file may contain `public` and `shared` material approved for this recipient-specific output. `private` branches are still excluded defensively.

## Header

| OCF | RenderCV | Notes |
|---|---|---|
| `person.name.renderAs` | `cv.name` | Required by the reference exporter. |
| `person.headline` | `cv.headline` | Wording must already be approved. |
| First visible `person.locations[]` | `cv.location` | Prefer `renderAs`; otherwise join city, region, and country. |
| Visible email contacts | `cv.email` | Emit a scalar for one value or an array for several. |
| Visible phone contacts | `cv.phone` | Emit a scalar for one value or an array for several. |
| First visible `url` contact | `cv.website` | Additional labeled URLs become custom connections. |
| Recognized social contacts | `cv.social_networks[]` | Translate URLs into RenderCV network usernames where possible. |
| Other labeled social or URL contacts | `cv.custom_connections[]` | Preserve the label and URL without inventing a network. |

The reference exporter does not currently export a photo. Photo handling should remain opt-in because a photo can be inappropriate or unlawful to request in some hiring contexts.

## Sections

RenderCV permits arbitrary section headings, but every entry in one section must use the same RenderCV entry type. The reference exporter uses stable section names and types:

| OCF | RenderCV section | Entry type |
|---|---|---|
| `person.summary` | `Summary` | TextEntry |
| `experience[].positions[]` | `Experience` | ExperienceEntry |
| `skills[]`, grouped by `category` | `Skills` | OneLineEntry |
| `education[]` | `Education` | EducationEntry |
| `certifications[]` | `Certifications` | NormalEntry |
| `projects[]` | `Projects` | NormalEntry |
| `publications[]` | `Publications` | PublicationEntry |
| `awards[]` | `Awards` | NormalEntry |
| `languages[]` | `Languages` | OneLineEntry |
| `service[]` | `Service` | NormalEntry |

Array order is preserved. The curation step owns ordering and inclusion.

## Experience

Each selected OCF position becomes one RenderCV ExperienceEntry:

| OCF | RenderCV |
|---|---|
| organization registry name or `experience[].name` | `company` |
| `position.title` | `position` |
| position date range, falling back to experience date range | `start_date`, `end_date` |
| first visible position or experience location | `location` |
| `position.summary`, falling back to experience description | `summary` |
| canonical visible `position.achievements[].statement` | `highlights[]` |

Multiple positions at one organization become separate entries in the first reference implementation. A later renderer-aware grouping policy may improve the visual treatment without changing OCF career facts.

OCF experience entries without positions do not have a faithful RenderCV ExperienceEntry destination because RenderCV requires a position. The exporter reports and skips them rather than inventing a title.

## Dates

Map OCF partial dates as follows:

| OCF | RenderCV |
|---|---|
| `{ "year": 2026 }` | `2026` |
| `{ "year": 2026, "month": 8 }` | `2026-08` |
| `{ "year": 2026, "month": 8, "day": 12 }` | `2026-08-12` |
| `{ "present": true }` | `present` |

Do not add missing months or days.

## Target-Specific Losses

The exporter should report content that cannot be mapped faithfully. Examples include:

- unresolved wording variants;
- OCF private memory, provenance, cautions, and attribution detail;
- unsupported person details such as work authorization or clearances;
- non-DOI publication identifiers;
- rich metrics that have no selected display statement;
- renderer hints or extensions the adapter does not understand.

These losses do not justify changing canonical facts. Resolve a display choice during curation, leave the concept in OCF, or add an explicit adapter mapping after repeated use demonstrates one.

## Local Reference Flow

Start from a candidate-curated working set and answer the local review questions:

```bash
node reference/curators/review-for-export.js \
  outputs/acme-ciso/resume.candidate-curated.ocf.json \
  outputs/acme-ciso/resume.export-ready.ocf.json
```

Then export the approved snapshot:

```bash
node reference/exporters/rendercv.js \
  outputs/acme-ciso/resume.export-ready.ocf.json \
  outputs/acme-ciso/resume.rendercv.yaml
```

Then render locally with an already-installed RenderCV CLI:

```bash
node reference/renderers/rendercv.js \
  outputs/acme-ciso/resume.rendercv.yaml \
  outputs/acme-ciso/rendered \
  --theme harvard \
  --formats pdf,html,png
```

The wrapper invokes the local `rendercv` executable without a shell or network service. Set `RENDERCV_BIN` to an explicit executable path when it is not on `PATH`. Installing or updating RenderCV is a separate, user-approved dependency-management step.

The generated YAML should remain beside the output so the mapping can be inspected, versioned, edited, or rendered independently of OCF tooling.
