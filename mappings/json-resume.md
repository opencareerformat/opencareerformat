# OCF to JSON Resume Mapping

JSON Resume models a resume. OCF models the career record behind one or many resumes. Exporters should therefore map an export-ready OCF file to JSON Resume, not the master OCF.

## Direction

Primary direction: `export-ready OCF file -> JSON Resume`.

Reverse import from JSON Resume is possible, but should be treated as importing a source artifact into a master OCF. A JSON Resume file usually lacks enough provenance, private context, variants, reflections, and source detail to reconstruct a complete master.

## Top-Level Mapping

| OCF | JSON Resume | Notes |
|---|---|---|
| `person.name.renderAs` | `basics.name` | Prefer the display name selected for this export-ready file. |
| `person.headline` | `basics.label` | Use only if visible in the export-ready file. |
| `person.email` | `basics.email` | Export only when present and visible. |
| `person.phone` | `basics.phone` | Export only when present and visible. |
| `person.website` | `basics.url` | Prefer the canonical personal site or portfolio. |
| `person.linkedin`, `person.github`, `person.contacts[]` | `basics.profiles` | Map recognizable social/profile links into `profiles`. Use contact `label` for services such as Bluesky, Mastodon, X/Twitter, ORCID, Google Scholar, GitLab, YouTube, or a portfolio network. |
| `person.location` | `basics.location` | Preserve city, region, country where possible. |
| `summary` or curated profile text | `basics.summary` | A curator may generate this from OCF evidence; do not invent unsupported claims. |
| `skills` | `skills` | Grouping is exporter-defined. Preserve names and keywords. |
| `experience[].positions[]` | `work[]` | JSON Resume work items are role-shaped; split multi-position experience entries into separate work entries unless the export-ready output intentionally combines them. |
| `education` | `education` | Map institution, area, study type, dates, score, courses when available. |
| `certifications` | `certificates` | Use certificate name, issuer, date, URL. |
| `projects` | `projects` | Include only top-level or selected nested projects relevant to the export-ready file. |
| `publications` | `publications` | Map title/name, publisher, release date, URL, summary. |
| `awards` | `awards` | Map title, awarder, date, summary. |
| `languages` | `languages` | Map language and fluency. |
| `interests` | `interests` | Export only when intentionally included. |
| `references` | `references` | Usually omit unless the user explicitly chose to include references. |

## Work Entries

For each selected OCF position, create a JSON Resume `work` entry:

| OCF | JSON Resume | Notes |
|---|---|---|
| parent experience entry `name` | `name` | Organization or experience-entry display label. |
| `position.title` or chosen `titleVariants[]` | `position` | Title variants must be defensible and selected by curation. |
| `position.dateRange.start` | `startDate` | Use the most precise available ISO-compatible date. |
| `position.dateRange.end` | `endDate` | Omit for present roles if the target renderer expects omission; otherwise use a present convention outside JSON Resume if supported. |
| `position.summary` | `summary` | Use curated display text, not private notes. |
| `achievements[].statement` or selected `narrativeVariants[]` | `highlights[]` | Each highlight should be supported by canonical OCF facts. |
| `position.url` or parent URL | `url` | Include only when useful and visible. |

## Social and Profile Links

JSON Resume `basics.profiles[]` expects a network name plus URL or username. Exporters should map:

- `person.linkedin` and `contacts[].kind = "linkedin"` to network `LinkedIn`
- `person.github` and `contacts[].kind = "github"` to network `GitHub`
- `contacts[].kind = "social"` to the network named by `label`, such as `Bluesky`, `Mastodon`, `X/Twitter`, `ORCID`, `Google Scholar`, `GitLab`, or `YouTube`
- `contacts[].kind = "url"` to `basics.url` only when it is the primary personal site; otherwise export it as a profile when the label names a recognizable network

Do not export private contact methods or social accounts that are not present in the export-ready OCF file.

## Lossy Areas

JSON Resume does not have first-class homes for many OCF concepts:

- source artifacts
- item-level provenance
- narrative variants and title variants
- private reflections
- goals, cautions, open questions, voice, and AI instructions
- top-level organizations registry
- detailed visibility and curation metadata
- structured metrics beyond prose highlights

An exporter should not force these into JSON Resume unless using a clearly namespaced extension supported by the target tool.

## Import Guidance

When importing JSON Resume into OCF:

- Register the JSON Resume file as a `sourceArtifacts` entry.
- Treat `work[]` as evidence for experience entries and positions.
- Preserve bullets as achievements or `narrativeVariants` when they appear to be alternate wording.
- Put uncertain merges, dates, titles, and metrics into `openQuestions`.
- Do not overwrite an existing master with a JSON Resume import without user review.
