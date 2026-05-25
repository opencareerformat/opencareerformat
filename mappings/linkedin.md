# OCF to LinkedIn Mapping

LinkedIn is both a public profile and a platform with its own editing UI. OCF should remain the source of truth; LinkedIn should be treated as an output target or source artifact, not the master.

## Direction

Primary direction: `public-profile or audience-specific export-ready OCF file -> LinkedIn paste/update bundle`.

Reverse direction: `LinkedIn export/profile text -> source artifact for OCF import`.

## Export Shape

A LinkedIn exporter will usually produce a paste/update bundle rather than an API upload. The bundle should be organized by LinkedIn screen/field:

- headline
- about
- experience
- education
- licenses and certifications
- skills
- projects
- publications
- honors and awards
- languages
- volunteer experience
- contact info and public profile links

## Field Guidance

| OCF | LinkedIn Area | Notes |
|---|---|---|
| `person.headline` or curated headline | Headline | Should be public-safe and current. |
| curated profile summary | About | May synthesize from goals, achievements, and selected experience, but must be reviewed by the user. |
| `person.website` | Contact Info / Website | Include when intended for the public LinkedIn profile. |
| `person.contacts[]` | Contact Info / Websites | Include selected public profile links such as Bluesky, Mastodon, X/Twitter, ORCID, Google Scholar, GitHub, GitLab, YouTube, or portfolio networks. |
| `experience[].positions[]` | Experience | LinkedIn can represent multiple roles at one organization. Preserve dates and role progression where useful. |
| `position.title` or selected `titleVariants[]` | Title | Title variants should be defensible and public-safe. |
| achievements / selected variants | Description bullets or prose | Use audience-appropriate wording; do not introduce unsupported facts. |
| `skills[]` | Skills | Select a focused public set rather than dumping every skill from the master. |
| `certifications` | Licenses & Certifications | Include credential ID and URL only when the user wants them public. |
| `projects` | Projects | Include selected public projects and links. |
| `publications` | Publications | Include public works and links. |
| `service` | Volunteer Experience | Map volunteer/civic work when public and relevant. |

## Source Artifact Import

When importing from LinkedIn:

- Register the LinkedIn export or pasted profile as a `sourceArtifacts` entry.
- Treat LinkedIn wording as public-profile wording, often suitable for `narrativeVariants`.
- Do not assume LinkedIn is complete; many users omit jobs, dates, details, or sensitive transitions.
- Compare LinkedIn titles and dates against the master and use `openQuestions` for conflicts.

## Privacy

LinkedIn is broadly public even when profile visibility is restricted. Exporters should use a public-profile export-ready OCF file by default and should warn before including phone, email, exact address, private reflections, source artifacts, salary, exit context, or sensitive demographic fields.

Public social/profile links are appropriate when selected by the user, but they still reveal identity and activity outside the resume. Treat Bluesky, Mastodon, X/Twitter, GitHub, ORCID, Google Scholar, YouTube, and similar accounts as public profile choices, not harmless metadata.
