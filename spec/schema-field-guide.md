# OCF Schema Field Guide

This is the detailed companion to the [OCF Design Guide](design-guide.md) and the full [`schema.json`](../schema.json). The Design Guide explains the model and boundaries. This field guide explains exact intent, conventions, variants, examples, and common implementation mistakes for tool authors, LLMs, importers, curators, and exporters.

This document is not the schema. The full JSON Schema remains the normative validation contract.

Use:

- `../schema.json` when you need the full current schema.
- `design-guide.md` when you need the conceptual model and rationale.
- `../schema-core.json` when a first-pass authoring workflow or context-constrained model needs a smaller generated projection of the full schema.
- `usage-patterns.md` when you need file-role workflows, subject/controller/editor distinctions, and movement between candidate-owned, imported, curated, export-ready, and third-party files.
- this file when you need intent, examples, tradeoffs, and common variants.

OCF is deliberately a file format, not a platform. The schema defines what can be preserved. Importers, curators, reviewers, coaches, exporters, LLMs, and applications decide how to ask questions, rank relevance, apply user preferences, and produce outputs.

`schema-core.json` is generated from the full schema and checked alongside it by the validator and repository tests. It is a minimal subset, not a different starter dialect. It may omit advanced fields, but overlapping fields use the same names and shapes as `schema.json`. Do not teach tools a core-only alias or flattened object that later needs translation into real OCF.

## Contents

- [Core Mental Model](#core-mental-model)
- [Naming Files](#naming-files)
- [v0.3 Lineage Names](#v0-3-lineage-names)
- [`meta`](#meta)
- [`person`](#person)
- [`sourceArtifacts`](#sourceartifacts)
- [`provenance`](#provenance)
- [Stable ID Rules](#stable-id-rules)
- [Visibility](#visibility)
- [`experience`](#experience)
- [`organizations`](#organizations)
- [Projects And Open Source](#projects-and-open-source)
- [Achievements](#achievements)
- [Attribution](#attribution)
- [Metrics](#metrics)
- [Narrative Variants](#narrative-variants)
- [Reflections](#reflections)
- [Corrections And Pushback](#corrections-and-pushback)
- [Cautions](#cautions)
- [Open Questions](#open-questions)
- [Talking Points](#talking-points)
- [Positioning Variants](#positioning-variants)
- [Goals, Voice, And AI Instructions](#goals-voice-and-ai-instructions)
- [Compensation, Sales Plan, And Book Of Business History](#compensation-sales-plan-and-book-of-business-history)
- [Supervisors And References](#supervisors-and-references)
- [Certifications And Credentials](#certifications-and-credentials)
- [Skills And Taxonomies](#skills-and-taxonomies)
- [Extensions And Incubation](#extensions-and-incubation)
- [Importer Guidance](#importer-guidance)
- [Curator Guidance](#curator-guidance)
- [Exporter Guidance](#exporter-guidance)
- [Common Pitfalls](#common-pitfalls)
- [Minimal Useful OCF](#minimal-useful-ocf)

## Core Mental Model

An OCF file is a structured career memory. The top-level `person` is always the subject of the file: the person whose career is described. For file-role and controller distinctions, see `usage-patterns.md`.

The same career fact may appear in several forms:

- canonical fact: what happened
- `longform`: the fuller story behind a claim
- `narrativeVariants`: alternate audience-specific wording
- `reflections`: private review or coaching material
- `openQuestions`: things to revisit before using or improving the claim
- `cautions`: things not to claim on the subject's behalf

## Naming Files

Recommended filename pattern:

- `{person}.master.ocf.json`
- `maria-reyes.master.ocf.json`
- `acme-ciso-2026-05-24.ocf.json`
- `public-profile.ocf.json`

Directory layout is a workflow choice. See `usage-patterns.md` for import, curated, and export directory examples.

OCF does not force structure into filenames, but humans often benefit from names that describe the purpose. For example, a file generated specifically for a CISO role at Acme in May 2026 should have a name that reflects that context.

Use explicit names before introducing abbreviations. A future curated file might be named `maria-reyes.public-profile.ocf.json` or `maria-reyes.acme-ciso.ocf.json`; do not assume a shorthand such as `.c.ocf.json` until usage proves it helpful.

## v0.3 Lineage Names

OCF v0.3 replaces the earlier "derived file" vocabulary with parent/lineage names: `meta.parentFileId`, `meta.parentVersion`, and `meta.lineageNotes`.

`parentFileId` points at the parent file's `meta.id`, not a filename. `parentVersion` records the parent file's `meta.version` at the time the child file was prepared. `lineageNotes` records the target, filter, translation, conversion, or export context. Do not confuse these with provenance values such as `interview-derived`, which remain useful for describing how an item was elicited.

Migration notes for old field names and incubating shapes belong in `CHANGELOG.md`.

## `meta`

`meta` describes the file, not the person.

Important fields:

- `id`: stable ID for this OCF file across its lifetime.
- `version`: content version or fingerprint.
- `fileRole`: what role this file plays in a workflow.
- `targetRole`: role target for targeted curated or export-ready files.
- `targetCompany`: company target for targeted curated or export-ready files.
- `lastModified`: when this file last changed.
- `source`: original source mechanics for this file, such as authored, imported, converted, merged, or translated.
- `parentFileId`: the parent file's `meta.id` when this file was prepared from another OCF file.
- `parentVersion`: the parent file's `meta.version` at preparation time.
- `lineageNotes`: freeform context for curation, export, conversion, or translation choices.

### File Role Examples

```json
{
  "meta": {
    "fileRole": "candidate-master"
  }
}
```

Use this for the person's own durable master file.

```json
{
  "meta": {
    "fileRole": "candidate-curated",
    "targetRole": "CISO",
    "parentFileId": "c94ffaa9-31fd-40d7-96cd-a66725a9784a",
    "parentVersion": "db2a5a6fc562"
  }
}
```

Use this for a candidate-controlled curated working set. See `usage-patterns.md` for how this differs from `export-ready`.

```json
{
  "meta": {
    "fileRole": "export-ready",
    "targetRole": "CISO",
    "targetCompany": "Example Health",
    "parentFileId": "c94ffaa9-31fd-40d7-96cd-a66725a9784a",
    "parentVersion": "db2a5a6fc562",
    "lineageNotes": "Reviewed handoff for Example Health CISO resume exporter."
  }
}
```

Use this for a handoff to a specific exporter or downstream system.

```json
{
  "meta": {
    "fileRole": "third-party-working",
    "source": {
      "kind": "imported"
    }
  }
}
```

Use this when a recruiter, coach, agency, employer, or tool controls a working file about a person. This is not the person's private master.

## `person`

`person` identifies the subject of the OCF. It should not be confused with the controller of the file.

Partial canonical example from Maria Reyes:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json# -->
```json
{
  "person": {
    "name": {
      "renderAs": "Maria E. Reyes",
      "given": "Maria",
      "family": "Reyes",
      "preferred": "Maria"
    },
    "headline": "Cybersecurity leader bridging military discipline with enterprise security strategy",
    "contacts": [
      {
        "kind": "email",
        "value": "maria.reyes@example.com",
        "primary": true,
        "visibility": "private"
      }
    ]
  }
}
```

Use `renderAs` for the name that should appear in ordinary outputs. `given`, `family`, and `preferred` are structured helper fields for tools; `renderAs` remains the display string because not every professional name decomposes cleanly.

Sensitive person-level facts use object-valued fields with their own `visibility`, so a generic filter can remove the object without understanding field-specific companion names. Use `person.legalName.text`, `person.photo.uri`, `person.dateOfBirth.value`, `person.nationality.values`, `person.maritalStatus.text`, and `person.gender.text`; do not create `legalNameVisibility`, `photoVisibility`, `dateOfBirthVisibility`, `nationalityVisibility`, `maritalStatusVisibility`, or `genderVisibility`.

A contact method belongs to the object that contains it: `person.contacts` describes the subject of the OCF file, `references[].contacts` describes that reference, and `experience[].positions[].supervisor.contacts` describes that supervisor. Use `contacts[]`, not legacy scalar fields, for email, phone, LinkedIn, GitHub, website, and other contact/profile URLs.

When tools create contact methods, write `visibility` explicitly. Do not rely on downstream tools inferring that an email, phone number, or profile URL is private from the field name alone.

Do not store government identity numbers, account secrets, passwords, passport numbers, taxpayer IDs, bank details, or API keys in OCF.

## Stable ID Rules

Use stable `id` values on durable records that tools may need to update, cite, or preserve across curation. IDs are optional unless a field needs to be referenced, but once an ID exists, future editors must preserve it across ordinary edits. If an eligible item lacks an ID, a future editor may add one.

IDs are local to an OCF lineage: the master file and files intentionally derived from, curated from, or split from it. They are not global identifiers and must not be used to link across people or unrelated OCF files. Do not rewrite existing IDs to match a tool's preferred style. Use provenance to record which tool or person created or edited an item; the ID is not a tool signature.

## `sourceArtifacts`

Source artifacts are inputs, not truth.

Use `sourceArtifacts` for old resumes, cover letters, LinkedIn exports, pasted chat text, uploaded notes, interview transcripts, portfolio bios, comp-plan photos, job descriptions, and other material used to build or improve the OCF.

Partial canonical example from Maria Reyes:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json# -->
```json
{
  "sourceArtifacts": [
    {
      "id": "sample-resume-source-2026-05",
      "kind": "resume",
      "label": "Sample source resume for Maria E. Reyes",
      "capturedDate": {
        "year": 2026,
        "month": 5,
        "day": 20
      },
      "audience": ["cybersecurity-leadership", "healthcare-security"],
      "fileName": "source-resume.txt",
      "rawIncluded": false,
      "visibility": "private"
    }
  ]
}
```

Good importer behavior:

- preserve the source artifact
- mark imported material conservatively
- add provenance to mined items
- create `openQuestions` for uncertainty
- avoid treating imported material as intentionally shareable just because normal authored items default to `shared`

Treat extracted text as a machine reading of the source artifact, not as the artifact itself. PDF font encoding, reading order, ligatures, OCR, and parser behavior can corrupt text that renders correctly. For example, a PDF may visibly say "Staff engineer" while mechanical extraction returns "Sta% engineer" because the font lacks a usable Unicode map. Compare suspicious extraction with the rendered source and ask the user when necessary. Preserve the confirmed intended wording in OCF, not the extraction defect.

`sourceArtifact.kind` and `provenance.source` are deliberately different vocabularies. `sourceArtifact.kind` describes the artifact itself (`resume`, `linkedin-export`, `job-description`, `photo`, `video`, `conversation`, `chat-paste`, `interview-transcript`). `provenance.source` describes how the OCF item came into the file (`authored`, `imported`, `interview-derived`, `llm-suggested`, `curated`, `translated`, `merged`). For example, wording pasted into chat should usually have a `sourceArtifact.kind` of `chat-paste` and a `provenance.source` of `imported` or `llm-suggested`, with `sourceArtifactId` linking the two.

Use `job-description` for employer-provided role descriptions and `application-draft` for material the candidate or tool created for an application.

Use `conversation` for a retained exchange or verbatim answer from an OCF session, even when only one answer becomes the durable artifact. Use `manual-note` for a standalone note authored outside a conversation. A session answer may initially look like informal notes and later become the most valuable source captured that day. If material from another chat is pasted into the current workflow as input, use `chat-paste` for the artifact as received.

```json
{
  "id": "leadership-story-conversation-2026-07-21",
  "kind": "conversation",
  "label": "Verbatim answer about the first management transition",
  "capturedDate": {
    "year": 2026,
    "month": 7,
    "day": 21
  },
  "fileName": "leadership-story-conversation-2026-07-21.txt",
  "rawIncluded": true,
  "visibility": "private"
}
```

`rawIncluded` does not mean the raw content is embedded in the `sourceArtifact` object. It indicates that the workflow retained the raw artifact, normally through `fileName`, `uri`, or an accompanying file. Source-artifact metadata may travel without the referenced artifact.

Raw conversation artifacts often remain private even when user-approved facts, achievements, talking points, or wording derived from them are shared. Give each derived item its own visibility and retain provenance back to the private source.

`sourceArtifacts.audience` is free-form and can also support voice calibration. Useful tags include `voice-authentic` for writing that sounds like the person, `voice-calibrated` for assisted writing the person has accepted as representative, and `voice-anti-pattern` for AI-heavy or rejected drafts that future tools should not imitate.

Keep a rejected draft only when it demonstrates a durable caution, voice rule, or structural lesson. For example, retain one rejected cover-letter opening when the user's explanation produced the rule "do not introduce me by leading with what I will not do." Do not retain every shorter rewrite that was discarded while editing that letter. Keep representative examples and remove redundant ones over time.

## `provenance`

Provenance explains how an item came to be.

Recommended boring keys:

```json
{
  "source": "interview-derived",
  "tool": "example-interview-tool",
  "date": "2026-05-21",
  "sourceArtifactId": "sample-resume-source-2026-05",
  "confidence": 0.82,
  "sessionTopic": "CISO resume refresh",
  "operation": "mined-achievement",
  "note": "Recovered from prior resume and confirmed in conversation."
}
```

`confidence` is the tool's own 0-1 estimate that the item is accurate as recorded. It is not an LLM log probability, user self-rating, source-quality score, external verification tier, or proof that the claim is true.

Examples:

- cleanly parsed from a resume: `0.7`
- OCR from a messy screenshot: `0.4`
- user confirmed in conversation: `0.9`
- inferred from inconsistent source documents: `0.3` plus an `openQuestions` entry

Do not use `confidence` as a substitute for future review status, verification, or attestation.

## Stable IDs

Use stable IDs on durable items that tools may need to reference later: source artifacts, experience entries, positions, achievements, supporting facts, narrative/title variants, reflections, cautions, open questions, talking points, and positioning variants. IDs are optional unless another item references them. If an ID exists, future editors must preserve it. If an eligible item lacks an ID, future editors may add one.

Any item referenced by `supportingItemIds` must have a stable local `id`. Editors must preserve referenced IDs across ordinary edits, and tools should validate that every `supportingItemIds` value resolves to an item in the same OCF lineage. JSON Schema cannot fully enforce those local cross-references, so referential-integrity checks belong in validators, editors, and migration tools.

Recommended:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/experience/0/positions/0/achievements/5 -->
```json
{
  "id": "mhs-ransomware-2024"
}
```

Slug-style IDs are easier for humans to review and diff. UUIDs are acceptable when collision safety matters more than readability. Do not put a tool name or model name in the item ID; put that in `provenance.tool`.

Choose a slug that is compact, recognizable to the subject, and durable across ordinary rewriting. It does not need to explain the item to a stranger. For example, `mhs-ransomware-2024` can be a useful internal name for an achievement even when its canonical `statement` is a full resume bullet point. In a candidate-owned workflow, the editor is usually the subject and already knows the underlying story.

Editors may humanize a readable ID for navigation, show the full `statement` when more context is needed, and fall back to a shortened display of `statement` when no ID exists. They must not change the stored ID merely to improve its display. Do not use `shortStatement` as the internal name: it is optional, may evolve, and represents tighter outward-facing wording of the same achievement. OCF does not add a separate achievement label for this purpose unless future real-world use shows that subjects need a renameable display name distinct from stable identity.

When `reviewStatus` is `superseded`, use `supersededById` when the replacement item is known. It is a local OCF item ID, not an embedded object and not a global identifier. Tools should verify that the referenced replacement exists before relying on it.

## Visibility

Visibility is a curation hint, not a security boundary.

Values:

- `public`: safe for broad exposure in the relevant workflow
- `shared`: usable for recruiter, coach, hiring manager, or trusted-party contexts
- `private`: keep inside the controlling file or workflow

Candidate-owned master example:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/experience/0/positions/0/achievements/0 -->
```json
{
  "statement": "Built SOC team from 0 to 12 analysts, achieving 24/7 coverage within 6 months",
  "visibility": "public"
}
```

This is an explicit opt-up to `public`. Most ordinary hand-authored career items default to `shared`, but this is not a universal or inherited default. OCF assigns defaults by schema location. For example, an achievement normally defaults to `shared`, a caution defaults to `private`, and a certification can default to `shared` while its credential identifier defaults to `private`.

An omitted `visibility` means "use the default defined for this exact schema location." It does not mean "inherit the parent's visibility." Explicit visibility on an item overrides its default.

Private coaching example:

```json
{
  "kind": "biggest-mistake",
  "text": "I should have involved the support teams before finalizing the rollout plan.",
  "visibility": "private"
}
```

Public-only export paths should include only `public` material. The reference curator demonstrates this with `--public-only`, which strips both `private` and `shared` content.

Private-by-default means "do not include automatically," not "never ask." A curator may ask the user whether a private group, type, or specific item should be shared in the export being prepared. Frame it as an output-specific curation checkpoint, not an abstract permission request: "We have the right choices to create this targeted resume; I want to make sure you are okay using these private-by-default fields for this version." The question should name what would be shared and the recipient or context, and the answer should apply to that output unless the user also asks to update the master visibility.

Filtering by visibility does not anonymize a file. Organization names, dates, locations, rare skills, metrics, and combinations of facts can identify someone.

## `experience`

`experience` is one chronological list of career periods: jobs, military service, self-employment, consulting, caregiving, career breaks, academic appointments, or other work-like periods.

Each experience entry can contain positions. This lets one organization tenure hold promotions, lateral moves, assignments, and multiple roles.

Example:

```json
{
  "kind": "employment",
  "name": "Meridian Health Systems",
  "positions": [
    {
      "title": "Director of Cybersecurity",
      "dateRange": {
        "start": { "year": 2023, "month": 3 },
        "end": { "present": true }
      },
      "achievements": []
    }
  ]
}
```

Use `dateRange.end.present: true` to mean present as of the source or current file context. When importing multiple resumes, remember that "Present" in an old resume means "present when that resume was written," not necessarily present today.

Use `dateRange.visibility: "private"` when the containing item may remain visible but its dates should be suppressed. Common examples include education dates that reveal age, employment dates that expose gaps, or deployment dates with sensitivity concerns.

If a person has separate periods doing similar work for the same organization or client, model them as separate positions with the same or similar title and different `dateRange` values. This is clearer than hiding a gap inside prose. A future schema may add richer repeated-period support if this pattern becomes common.

Use `positions[].locations[].renderAs` for a role's resume-facing location string. A resume may reasonably show the company, office, market, remote status, or an intentional display location without implying where the person lived or performed all work:

```json
{
  "title": "Director of Cybersecurity",
  "locations": [
    {
      "renderAs": "Remote, company based in New York",
      "city": "New York",
      "region": "NY",
      "country": "US",
      "remote": true
    }
  ]
}
```

Do not use organization address or a role location as a proxy for the person's residence, tax-sensitive location history, or actual worksite pattern. If richer role-location nuance matters, preserve it separately and keep sensitive residence or tax details private. Curate only the location facts the user intentionally wants to disclose.

Travel is related to location but usually does not need its own first-class v0.3 schema. For an existing role, preserve the history of travel when it affects scope, credibility, or operating context. A role that expected roughly 50% travel across regional hospital sites is more than a throwaway bullet point: it explains what the work actually required. Model that historical pattern as a supporting fact, note, achievement context, or caution depending on how it will be reused:

```json
{
  "statement": "Role required roughly 50% travel across regional hospital sites.",
  "dateRange": {
    "start": { "year": 2022 },
    "end": { "year": 2024 }
  },
  "visibility": "shared"
}
```

Do not treat current willingness to travel for future roles as durable career memory. OCF does not currently define first-class fields for "willing to travel up to 25%" or "not open to 50% travel anymore." Tools that need current travel willingness for an application should ask the user at the time of use, avoid inferring it from historical role travel, and avoid saving it as a durable fact unless the user explicitly asks.

Use `experience[].notes.text` for free-form private context that does not fit `progression`, `spanning`, `exitContext`, or structured items. Do not create `notesVisibility`; the `notes` object carries its own `visibility`.

## `organizations`

Use top-level `organizations` when the same organization appears in multiple places, when its identity changed, or when organization metadata is useful across experience entries.

Example:

```json
{
  "organizations": {
    "meridianhealth.example.com": {
      "name": "Meridian Health Systems",
      "kind": "company",
      "identifiers": [
        {
          "system": "domain",
          "value": "meridianhealth.example.com"
        }
      ]
    }
  },
  "experience": [
    {
      "organizationRef": "meridianhealth.example.com",
      "name": "Meridian Health Systems"
    }
  ]
}
```

Use `domainAtTime` when an organization used a different domain during that tenure.

## Projects And Open Source

Use top-level `projects` for meaningful work that is not tied to a specific employer, client, or position: independent open-source work, personal projects, creative work, independent research, or freelance-like projects where the project itself is the durable career signal.

If the project happened as part of a role, prefer `position.projects` so the relationship to the job stays structural. If the project stands on its own, use top-level `projects` with `category: "open-source"` and a `links` entry for the GitHub repository.

See `spec/examples/open-source-project.json` for a compact example using Open Career Format as an open-source project with a public GitHub repo link.

## Achievements

Achievements are canonical claims. They store what happened, not just how it should be worded in a resume.

Partial canonical example from Maria Reyes:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/experience/0/positions/0/achievements/5 -->
```json
{
  "id": "mhs-ransomware-2024",
  "kind": "accomplishment",
  "statement": "Led response to a hospital-wide ransomware incident — performed forensic analysis on the attacker tooling, advised leadership against paying the ransom based on observed decryption failures in adjacent engagements, and executed an alternate recovery path from offline backups; restored critical clinical systems within 41 hours with zero patient-care impact.",
  "visibility": "shared"
}
```

Use `longform` for the fuller story: stakes, context, judgment, lessons, tradeoffs, and caveats.

Use `importance` and `audiences` to help curators choose among many valid achievements.

## Attribution

Attribution keeps verbs honest.

Partial canonical example from Maria Reyes:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/experience/0/positions/0/achievements/0 -->
```json
{
  "id": "mhs-soc-buildout",
  "statement": "Built SOC team from 0 to 12 analysts, achieving 24/7 coverage within 6 months",
  "attribution": {
    "role": "owned",
    "scope": "Owned SOC buildout plan, hiring model, coverage target, and operating cadence; direct managers and team leads handled some day-to-day execution as the team scaled.",
    "ownedBudget": true,
    "ownedHeadcount": true,
    "reportedUpward": true,
    "notes": "A future review should clarify which parts Maria personally managed versus delegated through leads once the team reached 12 analysts."
  }
}
```

Use attribution to distinguish:

- owned
- led
- co-led
- drove
- contributed to
- supported
- advised
- observed

This is not formal verification. It is a structured prompt for honest wording. RACI-like questions can help clarify responsibility, but OCF does not encode a formal RACI model.

The `role` values are common cases, not a complete vocabulary for every collaboration pattern. If the precise truth is "jointly owned" or "led one workstream inside a larger program," use the closest role value and put the nuance in `scope` or `notes` so a curator can choose accurate verbs.

## Metrics

Metrics are flexible because careers have many kinds of numbers.

Examples:

```json
{
  "kind": "headcountGrowth",
  "from": 0,
  "to": 12,
  "unit": "analysts"
}
```

```json
{
  "kind": "percentage",
  "value": 165,
  "unit": "% quota attainment"
}
```

```json
{
  "kind": "currency",
  "value": 20000000,
  "unit": "USD ARR"
}
```

Metric `kind` is a hint. Do not overfit it. Use `note` when the number needs context.

## Narrative Variants

Narrative variants are alternate wording for the same underlying facts.

They are not competing facts and not separate achievements.

Partial canonical examples from Maria Reyes:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/experience/0/positions/0/achievements/5 -->
```json
{
  "narrativeVariants": [
    {
      "id": "mhs-ransomware-public-resume",
      "label": "Public resume bullet point",
      "audiences": ["resume", "public-profile", "incident-response"],
      "statement": "Led ransomware response that restored critical clinical systems from offline backups within 41 hours with no patient-care impact.",
      "visibility": "public"
    },
    {
      "id": "mhs-ransomware-interview-prep",
      "label": "Interview-prep framing",
      "audiences": ["interview-prep", "executive-judgment", "ciso-track"],
      "longform": "Use this story to show executive judgment under pressure: Maria did the forensic analysis herself, explained the risk of paying in business terms, committed to a 48-hour recovery path, and owned the recommendation when the outcome was uncertain.",
      "visibility": "private"
    },
    {
      "id": "mhs-ransomware-healthcare-security",
      "label": "Healthcare security framing",
      "audiences": ["healthcare", "patient-safety", "security-leadership"],
      "statement": "Protected patient-care continuity during a ransomware event by leading evidence-based recovery from offline backups and restoring critical clinical systems within 41 hours.",
      "visibility": "shared"
    }
  ]
}
```

Use variants for:

- old resume wording
- LinkedIn profile wording
- federal-resume wording
- role-targeted wording
- public-safe wording
- interview-prep framing
- translated or localized wording

Variants should represent reusable audience or purpose distinctions, not one-off wording for a named recipient. The healthcare-security variant above is reusable because patient-care continuity may matter across healthcare audiences. Changing its greeting or selecting one sentence for a particular hiring manager belongs in the current output unless the conversation reveals a framing worth reusing.

If a variant introduces a new fact, promote that fact into canonical structured fields or create an `openQuestions` item.

When the user confirms a new target industry, missing industry-specific variant coverage is an opportunity to ask, not permission to invent a new framing. Show the current default and relevant variants, then ask what that audience should understand differently. Create a new variant only from the user's confirmed context and wording, and keep an existing version when nothing materially changes.

## Reflections

Reflections are private review and conversation material. They are not resume bullets.

Partial canonical example from Maria Reyes:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/experience/0/positions/0/reflections/2 -->
```json
{
  "id": "meridian-health-systems-director-of-cybersecurity-biggest-mistake-reflection",
  "kind": "biggest-mistake",
  "text": "Underinvesting in the security awareness program in the first nine months. I prioritized technical controls because the SOC was being built, but the phishing click-through rate stayed stubbornly above 20% well into year two. I should have run a parallel awareness track from the start — it took us 18 months to get below 8%, and the early window was wasted. The lesson is that technical controls and human factors have different time-to-impact curves, and the right move with a fresh budget is to fund both early rather than sequentially.",
  "visibility": "private",
  "provenance": {
    "source": "interview-derived",
    "date": "2026-05-21"
  }
}
```

Use reflections for material that helps a person prepare, improve, or remember:

- proudest work
- biggest mistake
- why they left
- what they learned
- how a manager would rate them
- difficult working relationships
- transition stories

Reflections can seed achievements. Keep both when useful: the reflection preserves raw memory and voice; the achievement stores the distilled shareable claim.

“Raw memory” means material preserved in the subject’s own words rather than rewritten into polished language by a tool. It may contain selected portions of a longer answer rather than a complete transcript. Tools may remove repetition or retain only the most useful passages, but they should not paraphrase the subject or combine excerpts in a way that changes the meaning. Provenance may note whether the reflection is a complete answer, a selected excerpt, or a lightly edited version the subject approved.

When a fact, opinion, correction, or aside hints at a useful story, offer one natural probe. For example:

> **User:** I never liked calling that project a digital transformation.
>
> **Tool:** What did you call the change when you explained it to the people doing the work?

If the user engages, follow their energy with one question at a time. If they answer briefly, deflect, or move on, stop without pressure. Preserve what surfaces in their own words and propose the appropriate OCF update before saving it.

## Corrections And Pushback

Disagreement with a tool can produce durable career memory. When the user corrects, rejects, narrows, or reframes a suggestion, listen to the explanation rather than treating it as a request for another rewrite. Preserve the user's wording and ask whether future tools should remember what the conversation revealed.

Store the lesson according to what it means. A factual correction updates the relevant canonical field. A rejected overclaim or framing can become a `caution`. Authentic replacement language may improve `voice` guidance or become a reviewed narrative or positioning variant. A broader insight may belong in a reflection or evidence-backed talking point. Do not save every objection automatically; distinguish a one-draft preference from durable career memory, and save it only with the user's approval.

For example, "make this bullet shorter for this application" is probably a one-draft preference. "I do not introduce myself by leading with what I will not do; future drafts should not frame me that way" is durable voice guidance. When the distinction is unclear, ask whether the preference applies only to the current output or should be remembered for future conversations.

## Cautions

Cautions are claims the subject does not want made on their behalf.

Partial canonical example from Maria Reyes:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/cautions/1 -->
```json
{
  "id": "caution-claimed-as-an-ai-ml-security-specialist",
  "claim": "claimed as an AI / ML security specialist",
  "reason": "Has good operational exposure to ML-based detection tooling but does not have research-level expertise. Past LLM draft positioned this too strongly; corrected here.",
  "addedDate": {
    "year": 2026,
    "month": 5,
    "day": 21
  },
  "visibility": "private"
}
```

Write `claim` as the claim or framing a tool might make, such as "claimed as..." or "positioned as...". Do not require first-person wording; cautions are often easiest to apply when they describe the risky output phrase directly.

Use cautions when a tool, coach, recruiter, or draft overstates something and the user corrects it. Cautions are not weaknesses; they are positioning constraints.

Cautions can also capture writing anti-patterns, not only factual overclaims. A useful caution might be "do not describe this as a transformational journey" or "do not use the phrase uniquely positioned" when the user has rejected that voice. These are still guardrails for future curation: things the tool should not claim, imply, or sound like on the person's behalf.

A weak caution records only the correction: "The Atlas migration was co-led, not led." A stronger caution also records the failure signature and standing rule:

```json
{
  "claim": "Sole-leadership framing for the Atlas migration, including 'led', 'my team', or 'I built'",
  "reason": "The work had two program leads. Future summaries must preserve shared attribution even when compressing the story.",
  "visibility": "private"
}
```

The stronger form helps future tools recognize the same overclaim when it returns through paraphrasing or compression. A caution can prevent the first drift; it does not require a documented history of prior mistakes.

## Open Questions

Open questions are a working queue.

Partial canonical examples from Maria Reyes:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/openQuestions/1 -->
```json
{
  "id": "open-question-clarify-whether-the-ransomware-response-ac",
  "question": "Clarify whether the ransomware-response achievement should name the affected clinical system or keep the description generic.",
  "context": "The current achievement is strong, but more specificity may improve interview storytelling while also increasing sensitivity. Decide during review before using it in external materials.",
  "addedDate": {
    "year": 2026,
    "month": 5,
    "day": 21
  },
  "visibility": "private"
}
```

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/openQuestions/3 -->
```json
{
  "id": "open-question-for-the-soc-buildout-clarify-what-maria-di",
  "question": "For the SOC buildout, clarify what Maria directly owned versus what her managers or team leads owned as the team scaled from 0 to 12 analysts.",
  "context": "The achievement is strong, but attribution precision will help curators choose honest verbs. Explore budget ownership, hiring authority, headcount responsibility, and who reported progress upward.",
  "visibility": "private"
}
```

Good open questions should be answerable by the subject or by reviewing their source material. Use them for unresolved career facts, positioning choices, sensitivity decisions, attribution questions, or stories that need more detail.

Do not use a person's `openQuestions` for schema housekeeping, exporter wishlist items, or mapper TODOs. Put those in a project issue tracker, exporter documentation, or a vendor extension namespace instead.

## Talking Points

Talking points are reusable, evidence-backed career framings.

Use them for patterns that are bigger than one achievement but more concrete than a vague personal brand: how someone handles ambiguous situations, how they explain a transition, what they repeatedly bring to teams, or a confirmed through-line surfaced by a career conversation.

Talking points should cite evidence. Prefer `supportingItemIds` when the supporting items have IDs, and use `supportingEvidence` when the evidence is a source artifact, external reference, or descriptive path that cannot yet be expressed as an item ID. A talking point without evidence is just a slogan; curators should be careful not to overuse it.

For `talkingPoints` and `positioningVariants`, `supportingItemIds` is the preferred evidence link. Use `supportingEvidence` only when the evidence cannot yet be expressed as an item ID, such as an external source, a source artifact path, or a temporary descriptive pointer that a future editor may turn into a stable reference.

Partial canonical example from Maria Reyes:

<!-- canonical-subset: spec/examples/maria-reyes/maria-reyes-revision-7.ocf.json#/talkingPoints/0 -->
```json
{
  "id": "authority-from-demonstrated-work",
  "label": "Authority from demonstrated work",
  "statement": "I rebuild authority from demonstrated work rather than inherited position.",
  "supportingItemIds": [
    "meridian-health-systems-director-of-cybersecurity-never-on-resume-story-reflection",
    "mhs-soc-buildout"
  ],
  "reviewStatus": "user-confirmed",
  "visibility": "private"
}
```

## Positioning Variants

Positioning variants are person-level presentation choices.

Use `person.headline` for the default, general-purpose headline. Use `positioningVariants` for target-aware alternatives: a healthcare-security headline, a federal/defense headline, a career-pivot summary, or a concise conference-bio framing. They can include a headline, summary, audiences, and supporting evidence.

Do not treat a positioning variant as a new canonical fact. A curator chooses it for a target, or a user promotes it after review.

## Goals, Voice, And AI Instructions

These fields guide future conversations.

`goals` describes reusable career direction: role shapes, locations, motivations, preferences, and constraints that should guide future conversations.

An application can prompt a goal-discovery question, but it is not itself a goal. Ask whether the role represents a broader direction. If the user confirms that it does, store the reusable role shape and preferences in `goals`; keep the employer-specific pipeline stage, follow-up dates, outcome, and other application state in an external workflow or producer-owned extension. Do not turn one application into a persistent objective that future tools repeatedly ask the user to resolve.

`voice` describes how drafts should sound.

`aiInstructions.text` customizes tool behavior for this file.

For the longer rationale behind these fields, see `design-guide.md` and its discussion of OCF as input to a career conversation.

Example:

```json
{
  "voice": {
    "style": "plain-direct",
    "avoidPhrases": ["leveraged", "thought leader"],
    "preferredPhrases": ["led", "owned", "built"],
    "visibility": "private"
  },
  "aiInstructions": {
    "text": "Push back when I undersell. Ask before drafting from uncertain prior-session claims.",
    "visibility": "private"
  }
}
```

Keep these private by default. They are not resume content. Visibility is explicit so a simple filter can remove them without understanding field names.

## Compensation, Sales Plan, And Book Of Business History

Compensation and plan details are memory fields, not ordinary downstream output. While completely optional, the reason OCF offers to store this sensitive data is because it is relatively easy to collect while you are employed and almost impossible to do afterwards.

Use them to preserve:

- base salary
- bonus
- commission
- equity
- quota
- attainment
- rank
- President's Club or similar recognition
- territory or plan caveats
- book of business, renewal base, managed ARR, account count, retention, and churn context

Keep raw comp and plan details private unless a specific workflow requires sharing them.

OCF distinguishes compensation history from current compensation expectations. Historical compensation, quota, commission, plan, and book-of-business facts can belong in the master because they are hard to reconstruct later and often needed for applications or negotiation. Current target compensation is more transient and application-facing; v0.3 does not define a first-class target-compensation field. Tools that need it should ask at the time of use or store dated, private guidance in tool config, `goals`, `cautions`, notes, or an extension.

Use `position.bookOfBusiness` for account, territory, renewal, or portfolio responsibility in a specific role. It is repeatable by year or period because a person's book can change materially inside the same role. This is where a sales, customer-success, account-management, partner, or revenue leader can remember facts like "managed $2M ARR in my territory" or "owned $20M of successful renewals in 2025; all churn was non-regretted."

Keep `bookOfBusiness` distinct from `salesPerformance`: sales performance records plan, quota, attainment, rank, or club outcomes; book of business records what portfolio the person was responsible for and what happened to it. A shareable resume claim can still become an achievement with reviewed metrics, while the private annual book details stay in the master.

Metric `kind` values often use camelCase in examples because they behave like compact analytic labels (`quotaAttainment`, `renewalBookValue`, `nonRegrettedChurnArr`). Book-of-business outcome `kind` values often use kebab-case because they behave more like event labels (`renewed-arr`, `non-regretted-churn-arr`). Treat both as hints, not controlled vocabularies; consistency inside a tool matters more than forcing every author into one style.

Resume-ready sales claims should usually be achievements with reviewed metrics:

```json
{
  "statement": "Achieved 165% revenue attainment against FY16 budget",
  "metrics": [
    {
      "kind": "percentage",
      "value": 165,
      "unit": "% revenue attainment"
    }
  ],
  "visibility": "shared"
}
```

If a statement blends multiple facts, use `supportingFacts` for the individual annual records when available. This matters for sales recognition because the public claim is often a summary:

```json
{
  "statement": "Qualified for President's Club 2 out of 3 eligible years",
  "kind": "recognition",
  "metrics": [
    {
      "kind": "count",
      "value": 2,
      "unit": "years"
    },
    {
      "kind": "count",
      "value": 3,
      "unit": "eligible years",
      "note": "Denominator for the 2-out-of-3 recognition claim."
    }
  ],
  "supportingFacts": [
    {
      "statement": "Qualified for President's Club in FY2022.",
      "date": {
        "year": 2022
      },
      "visibility": "private"
    },
    {
      "statement": "Did not qualify for President's Club in FY2023.",
      "date": {
        "year": 2023
      },
      "visibility": "private",
      "note": "Stored as private memory; usually not rendered in public outputs."
    },
    {
      "statement": "Qualified for President's Club in FY2024.",
      "date": {
        "year": 2024
      },
      "visibility": "private"
    }
  ],
  "visibility": "shared"
}
```

The shareable achievement can stay concise while the master keeps enough annual detail to defend or revise it later.

## Supervisors And References

Supervisor and reference details are private by default.

Use `position.supervisor` for the most relevant person the subject worked for in that role. This is useful for Topgrading-style prep, federal applications, and reference checks.

Keep the shape lightweight. OCF is not trying to become a LinkedIn-style people graph.

## Certifications And Credentials

Use simple issuer strings when that is all the person has:

```json
{
  "name": "CISSP",
  "issuer": "(ISC)²",
  "status": "active"
}
```

Use structured issuer metadata when importing verified credentials or preparing exports that need stronger issuer identity.

Questions in a person's OCF should affect that person's file. Schema housekeeping, exporter wishlist items, and mapper TODOs belong in the project issue tracker, exporter documentation, or a vendor extension namespace. A good credential question for the person's OCF would be "Do you have the badge URL or certificate number?"

## Skills And Taxonomies

Skills can be plain names:

```json
{
  "name": "Incident Response"
}
```

They can also carry external taxonomy references when a tool has them. Do not force casual authors to fill taxonomy data by hand.

For example, a tool working with European hiring data might align a human-readable OCF skill to ESCO, the EU taxonomy for skills, competences, qualifications, and occupations:

```json
{
  "name": "Incident Response",
  "taxonomies": [
    {
      "framework": "esco",
      "id": "http://data.europa.eu/esco/skill/example-incident-response",
      "label": "incident response",
      "version": "ESCO v1.1.2"
    }
  ]
}
```

The exact taxonomy identifier should come from the importing or matching tool. The OCF author can keep the plain skill name; the taxonomy reference is an interoperability layer.

## Extensions And Incubation

Use `extensions` where the schema exposes an extension surface for vendor-specific or experimental metadata that should round-trip through tools. Extensions are not valid on every object; consult the full schema before adding one.

Example:

```json
{
  "extensions": {
    "example-ats.com": {
      "candidateId": "abc123",
      "pipelineStage": "screening"
    }
  }
}
```

Use a domain you control as the namespace. Tools that do not understand an extension should preserve it.

By convention, use top-level `extensions.user.local` for user-controlled scratch metadata that has no vendor owner and no first-class schema field yet. It is valid under the extension key pattern, but it is not a normative schema commitment. Portable data should still prefer first-class schema fields when they exist, and vendor-owned metadata should use a domain the vendor controls.

Do not use `person.extensions`; `person` is a closed object in the canonical schema. If the experimental concept is person-level, store it under top-level `extensions.user.local` and include IDs or references back to the relevant person-level concept.

When a tool repeatedly stores the same reusable career-memory structure under `extensions.user.local`, treat that as possible schema feedback. Preserve the local data, but consider helping the user file a redacted suggestion with the OCF project that explains the concept, the current best mapping, what felt awkward, and a fictionalized or anonymized example.

OCF may publish a suggested `extensions.user.local` shape in planning notes when a possible schema addition needs real use before standardization. Such shapes are incubating conventions, not promises that the next schema will use the same name or structure. Tools should preserve them, use them only when they explicitly support the experiment, and follow release migration guidance if the concept later becomes first-class.

## Importer Guidance

Importers should be conservative.

See `usage-patterns.md` for the full import workflow. At the field level, an importer should:

- add a `sourceArtifacts` entry
- set `meta.source.kind` to `imported` or `converted`
- preserve provenance on imported items
- default durable mined items to `reviewStatus: "unreviewed"` or `"needs-review"` until accepted
- treat missing `reviewStatus` on imported, inferred, or LLM-mined durable items as `unreviewed`
- default mined items to `private` or `shared` based on source and workflow
- create `openQuestions` for uncertain dates, metrics, titles, and claims
- do not silently treat raw imported notes as public

An importer can parse:

```text
Maria E. Reyes
Cybersecurity leader bridging military discipline with enterprise security strategy
```

But it cannot know whether every claim is current, defensible, or appropriate for a target role. That is why review and provenance matter.

## Curator Guidance

A curator reads an OCF plus a target, audience, purpose, review question, or source artifact. It should:

- filter based on visibility, rules, relevance, and recency
- preserve lineage for selected material
- keep proposed improvements separate from export-ready content

Visibility governs selection and disclosure, not whether a trusted curator operating on the private master may inspect an item. Before asking the user for more information, check relevant canonical fields, `longform`, variants, reflections, and available source material; ask only for what remains missing or ambiguous.

For selected material, preserve lineage in `provenance` with the source file and item IDs when the tool has them:

```json
{
  "provenance": {
    "source": "curated",
    "sourceFileId": "master-ocf-7f3a",
    "sourceItemId": "mhs-ransomware-2024",
    "operation": "selected-for-export"
  }
}
```

For proposed improvements, keep the suggested update distinct from export-ready content. Tools can do this with a vendor extension, a candidate-curated working file, or an external review queue:

```json
{
  "extensions": {
    "curator.example.com": {
      "proposedUpdates": [
        {
          "targetItemId": "mhs-ransomware-2024",
          "suggestion": "Add whether the recovery target was met or exceeded.",
          "status": "needs-user-review"
        }
      ]
    }
  }
}
```

See `usage-patterns.md` for the broader movement from master to curated or export-ready files.

## Exporter Guidance

An exporter turns export-ready input into files:

- PDF
- DOCX
- HTML
- JSON Resume
- LER-RS input
- Schema.org JSON-LD
- LinkedIn paste bundle
- cover letter
- interview-prep packet

Exporters should not decide which private career facts belong. That is curation.

Review rendered documents twice: once as a person sees them and once as a machine reads them. Before sharing a generated PDF, visually inspect the rendering and extract its text with an independent parser. Compare the normalized extraction with the intended content and investigate missing, corrupted, duplicated, or badly reordered text.

For example, a PDF that visibly renders "Staff engineer" but extracts as "Sta% engineer" has failed output review even though the page looks correct. Missing Unicode maps, replacement characters, mojibake, and unexpected symbols are useful warnings, not conclusive tests. Passing one extraction tool does not guarantee compatibility with every ATS or document parser.

## Common Pitfalls

- Treating a curated file as the master.
- Treating imported source material as truth.
- Treating `visibility` as anonymization.
- Putting schema/tooling TODOs into a person’s `openQuestions`.
- Using `provenance.source` and `sourceArtifact.kind` interchangeably.
- Using `confidence` as external verification.
- Letting narrative variants introduce unsupported facts.
- Letting an exporter make curation decisions.
- Assuming "Present" in an old resume means present today.
- Using a third-party working file as if it were the candidate’s own master.

## Minimal Useful OCF

A useful OCF can be tiny:

<!-- canonical-subset: spec/examples/minimal-useful.ocf.json# -->
```json
{
  "$schema": "https://opencareerformat.org/v0.3/schema.json",
  "schemaVersion": "0.3",
  "meta": {
    "fileRole": "candidate-master",
    "lastModified": "2026-05-24"
  },
  "person": {
    "name": {
      "renderAs": "Maria E. Reyes"
    }
  },
  "experience": [
    {
      "kind": "employment",
      "name": "Meridian Health Systems",
      "positions": [
        {
          "title": "Director of Cybersecurity",
          "dateRange": {
            "start": { "year": 2023, "month": 3 },
            "end": { "present": true }
          },
          "achievements": [
            {
              "statement": "Built SOC team from 0 to 12 analysts, achieving 24/7 coverage within 6 months",
              "visibility": "public"
            }
          ]
        }
      ]
    }
  ]
}
```

A partial, honest OCF is better than a complete-looking file full of invented certainty.
