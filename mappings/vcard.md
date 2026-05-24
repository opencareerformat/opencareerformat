# OCF to vCard Mapping

vCard is a contact-card format. It is useful for exporting a lightweight profile into address books, contact managers, QR codes, and email signatures. It is not a resume format.

## Direction

Primary direction: `derived OCF -> vCard`.

Export from a public-profile or contact-card derivative, not from the master OCF.

## Core Mapping

| OCF | vCard | Notes |
|---|---|---|
| `person.name` | `FN`, `N` | Use `renderAs` for `FN`; use structured name parts for `N` when available. |
| `person.headline` | `TITLE` or `ROLE` | Use only when appropriate for a contact card. |
| current organization | `ORG` | Include only if public and current. |
| `person.email` | `EMAIL` | Include selected email only. |
| `person.phone` | `TEL` | Include selected phone only. |
| `person.location` | `ADR` | Prefer coarse location unless the user explicitly wants a full address in the contact card. |
| `person.website` | `URL` | Prefer canonical personal site. |
| `person.linkedin`, `person.github`, `person.contacts[]` | `URL` or `X-SOCIALPROFILE` | Use standard fields where possible; vendor extensions vary by address book. Use `label` for Bluesky, Mastodon, X/Twitter, ORCID, Google Scholar, GitLab, YouTube, and similar profiles. |
| `person.photo` | `PHOTO` | Include only when intentionally public and suitable for the target region/use. |
| short bio | `NOTE` | Optional; keep concise and public-safe. |

## Limits

vCard has no good home for:

- achievements
- full work history
- source artifacts
- provenance
- private reflections
- goals, cautions, open questions, voice, or AI instructions
- derivation rationale

Do not stuff resume content into `NOTE`. If the user needs a resume, export a rendered resume or another structured profile format instead.
