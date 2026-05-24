# OCF to LER-RS Mapping

Learning and Employment Record Resume Standard (LER-RS) is closer to credential and employment-record infrastructure than to a human-authored career master. OCF can supply candidate-owned narrative and selected career facts, but LER-RS export often needs evidence from outside OCF, especially verified credentials.

## Direction

Primary direction: `derived OCF + credential evidence -> LER-RS`.

OCF alone should not claim cryptographic verification. If a credential is merely recorded in OCF, export it as an asserted credential fact unless the exporter also has access to verifiable credential payloads, badge assertions, registry confirmations, or wallet data.

## Mapping Areas

| OCF | LER-RS Concept | Notes |
|---|---|---|
| `person` | candidate / profile identity | Export only selected contact and identity fields. |
| `education` | education records | Preserve institution, credential/degree, dates, field, and identifiers where available. |
| `certifications` | credentials / achievements | Use issuer, credential ID, URL, issue/expiration dates. |
| `skills[]` | competencies / skills | Include taxonomy references when present. |
| `experience[].positions[]` | employment records / work history | Export selected role, organization, dates, and duties/achievements. |
| `achievements[]` | achievements / assertions | Use only curated, supportable statements. |
| `projects`, `publications`, `awards` | achievements / activities | Map when relevant to the target LER-RS profile. |

## Credential Verification

OCF v0.2 can carry:

- `certifications[].credentialId`
- `certifications[].url`
- structured `issuer` with optional `identifier`
- vendor-specific verification metadata under `extensions`

OCF v0.2 does not define a canonical embedded verifiable credential payload. An LER-RS exporter may enrich OCF data with external wallet or badge evidence. That enrichment should be recorded in exporter provenance or extensions rather than silently changing the master OCF.

## Skills and Taxonomies

When OCF skills include taxonomy references, preserve them. These references are important for LER-RS and adjacent HR systems because they can align user-entered labels with machine-readable skill frameworks.

If taxonomy references are missing, an exporter may suggest alignments, but those suggestions should be reviewed before being written back to the master OCF.

## Lossy Areas

LER-RS is not the right home for:

- private reflections
- coaching notes
- AI instructions
- source artifacts
- alternate prose variants that are only useful for resume wording
- unsupported title variants

These should remain in OCF unless the user has a specific reason to include them in a derived export.

## Import Guidance

When importing LER-RS into OCF:

- Treat verified credentials as strong evidence for certifications, education, and skills.
- Preserve issuer identifiers and verification URLs where available.
- Register the imported LER-RS file or credential bundle in `sourceArtifacts`.
- Do not treat LER-RS work-history records as a complete career narrative; they may be sparse, institutional, or compliance-focused.
