# OCF to Schema.org Mapping

Schema.org JSON-LD is useful for publishing public profile data on a personal website or portfolio. It is not a resume master and should usually be generated from a public-profile derived OCF.

## Direction

Primary direction: `public-profile derived OCF -> Schema.org JSON-LD`.

Reverse import from Schema.org is possible but typically low fidelity. Treat it as a source artifact, not as a replacement for the master OCF.

## Recommended Types

Use `Person` as the main object. Add related objects where useful:

- `Organization` for employers, schools, issuers, and memberships
- `EducationalOccupationalCredential` for certifications and credentials
- `CreativeWork` or subtypes for publications
- `Project` is not a broadly supported Schema.org type; use `CreativeWork`, `SoftwareSourceCode`, or `Thing` depending on the project
- `Occupation` or `Role` where the publisher needs structured occupational context

## Core Mapping

| OCF | Schema.org | Notes |
|---|---|---|
| `person.name.renderAs` | `Person.name` | Use the public display name. |
| `person.headline` | `Person.jobTitle` or `description` | Use carefully; `jobTitle` may imply current role. |
| `person.website` | `Person.url` | Prefer canonical personal site. |
| `person.linkedin`, `person.github`, `person.contacts[]` | `Person.sameAs` | Use for public profile URLs: LinkedIn, GitHub, Bluesky, Mastodon, X/Twitter, ORCID, Google Scholar, GitLab, YouTube, and similar identity/profile pages. |
| `person.email` | `Person.email` | Include only in a public-profile derivative when intentional. |
| `person.location` | `Person.homeLocation` or `address` | Use coarse location unless the user explicitly wants detailed address data public. |
| selected current position | `Person.worksFor`, `jobTitle` | Avoid exposing stealth or private employers. |
| education | `Person.alumniOf` | Can point to `Organization` objects. |
| skills | `Person.knowsAbout` | Use human-readable skill labels. |
| languages | `Person.knowsLanguage` | Map language names and proficiency when appropriate. |
| publications | `CreativeWork` linked from `Person` | Use `author` back to the person. |

## Visibility

Schema.org is public web metadata. Exporters should require a public-profile derived OCF or an explicit public export decision. Do not include private or shared-only material by default.

Fields that are especially risky in public JSON-LD:

- precise address
- phone number
- personal email
- date of birth
- nationality, gender, marital status
- references
- private employers or stealth roles
- source artifacts and provenance notes

## Social and Profile Links

Schema.org `sameAs` is the right place for public identity/profile URLs. Exporters should include only profiles the user intentionally made public in the derived OCF. For generic social contacts, use `contacts[].kind = "social"` and the `label` to name the service.

Examples:

- `{"kind": "social", "label": "Bluesky", "value": "https://bsky.app/profile/example.bsky.social"}`
- `{"kind": "social", "label": "Mastodon", "value": "https://hachyderm.io/@example"}`
- `{"kind": "social", "label": "X/Twitter", "value": "https://x.com/example"}`
- `{"kind": "social", "label": "ORCID", "value": "https://orcid.org/0000-0000-0000-0000"}`

## Display Versus Facts

Schema.org values can be consumed by search engines and other automated systems. Use canonical OCF facts unless a curator explicitly selected a public display variant. Do not use a title variant in `jobTitle` unless it is defensible in a public profile.
