# OCF Mappings

This directory documents how Open Career Format maps to and from neighboring career-data formats and systems.

These files are prose specifications, not code. They describe expected behavior for importers and exporters so independent tools can make similar decisions without sharing an implementation.

## Available Mappings

| Mapping | Direction | Purpose |
|---|---|---|
| [JSON Resume](json-resume.md) | OCF export-ready file -> JSON Resume | Export a resume-shaped OCF into the established JSON Resume ecosystem. |
| [LER-RS](ler-rs.md) | OCF export-ready file + credential evidence -> LER-RS | Bridge OCF career narrative into learning and employment record infrastructure. |
| [Schema.org](schema-org.md) | OCF export-ready file -> Schema.org JSON-LD | Publish public profile data in search-friendly structured data. |
| [LinkedIn](linkedin.md) | OCF export-ready file -> LinkedIn paste/update bundle | Help users update LinkedIn without treating LinkedIn as the source of truth. |
| [vCard](vcard.md) | OCF export-ready file -> vCard | Export contact/profile information for address books and lightweight profile exchange. |
| [Career-ops](career-ops.md) | OCF curated/export-ready file <-> career-ops User Layer files | Integrate OCF career memory with a local-first job-search workspace without turning OCF into a pipeline tracker. |
| [OCF and Career-Ops](career-ops-integration.md) | Collaboration framing | Explain how OCF can seed Career-Ops workspaces and how user-approved curation improvements could flow back into OCF. |

## General Principles

- Export from an export-ready OCF file by default, not from the master.
- Preserve the master OCF as the source of truth. Exported files are outputs, not authoritative updates.
- Respect `visibility`; do not export `private` items unless the user explicitly chose a private recipient-specific curated or export-ready file.
- Preserve facts separately from display wording. Use canonical fields for factual claims and variants for audience-specific phrasing.
- Include provenance or curation notes when the target format has a reasonable place for them; otherwise keep them in the OCF.
- Do not invent missing facts to satisfy a target schema. Leave fields empty, omit them, or ask an open question.
- The user owns every exported word and should review the output before sending, posting, or importing it elsewhere.
