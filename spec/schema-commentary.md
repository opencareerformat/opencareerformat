# Annotated OCF Schema Commentary

This is not a schema. It is a developer and LLM-facing commentary file for people trying to understand how to use the Open Career Format (OCF) schema well.

`guide.html` explains OCF's intent for human readers. This file explains schema use for tool authors, LLMs, importers, curators, and exporters.

Use:

- `../schema-core.json` when you need the starter shape for first-pass authoring.
- `../schema.json` when you need the full current schema.
- `guide.html` when you need the human-facing explanation and rationale.
- `usage-patterns.md` when you need file-role workflows, subject/controller/editor distinctions, and movement between candidate-owned, imported, curated, export-ready, and third-party files.
- this file when you need intent, examples, tradeoffs, and common variants.

OCF is deliberately a file format, not a platform. The schema defines what can be preserved. Importers, curators, reviewers, coaches, exporters, LLMs, and applications decide how to ask questions, rank relevance, apply user preferences, and produce outputs.

`schema-core.json` is a minimal subset of the full schema, not a different starter dialect. It may omit advanced fields, but overlapping fields should use the same names and shapes as `schema.json`. Do not teach tools a core-only alias or flattened object that later needs translation into real OCF.

## Contents

- [Core Mental Model](#core-mental-model)
- [Naming Files](#naming-files)
- [v0.3 Lineage Names](#v03-lineage-names)
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
- [Cautions](#cautions)
- [Open Questions](#open-questions)
- [Talking Points](#talking-points)
- [Positioning Variants](#positioning-variants)
- [Goals, Voice, And AI Instructions](#goals-voice-and-ai-instructions)
- [Compensation, Sales Plan, And Book Of Business History](#compensation-sales-plan-and-book-of-business-history)
- [Supervisors And References](#supervisors-and-references)
- [Certifications And Credentials](#certifications-and-credentials)
- [Skills And Taxonomies](#skills-and-taxonomies)
- [Vendor Extensions](#vendor-extensions)
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
- `sample-resume.ocf.json`
- `acme-ciso-2026-05-24.ocf.json`
- `public-profile.ocf.json`

Directory layout is a workflow choice. See `usage-patterns.md` for import, curated, and export directory examples.

OCF does not force structure into filenames, but humans often benefit from names that describe the purpose. For example, a file generated specifically for a CISO role at Acme in May 2026 should have a name that reflects that context.

Use explicit names before introducing abbreviations. A future curated example might be named `sample-resume.public-profile.ocf.json` or `sample-resume.acme-ciso.ocf.json`; do not assume a shorthand such as `.c.ocf.json` until usage proves it helpful.

## v0.3 Lineage Names

OCF v0.3 replaces the earlier "derived file" vocabulary with parent/lineage names: `meta.parentFileId`, `meta.parentVersion`, and `meta.lineageNotes`.

`parentFileId` points at the parent file's `meta.id`, not a filename. `parentVersion` records the parent file's `meta.version` at the time the child file was prepared. `lineageNotes` records the target, filter, translation, conversion, or export context. Do not confuse these with provenance values such as `interview-derived`, which remain useful for describing how an item was elicited.

Migration notes for old field names and incubating shapes belong in `CHANGELOG.md`.

## `meta`

`meta` describes the file, not the person.

Important fields:

- `id`: stable ID for this OCF file across its lifetime.
- `version`: content version or fingerprint.
- `canonical`: whether this file is canonical in its own authoring context.
- `fileRole`: what role this file plays in a workflow.
- `variant`: what kind of filtered or targeted form this file is.
- `targetRole`: role target for role-targeted or company-targeted files.
- `targetCompany`: company target for company-targeted files.
- `lastModified`: when this file last changed.
- `source`: original source mechanics for this file, such as authored, imported, converted, merged, or translated.
- `parentFileId`: the parent file's `meta.id` when this file was prepared from another OCF file.
- `parentVersion`: the parent file's `meta.version` at preparation time.
- `lineageNotes`: freeform context for curation, export, conversion, or translation choices.

### File Role Examples

```json
{
  "meta": {
    "fileRole": "candidate-master",
    "canonical": true,
    "variant": "master"
  }
}
```

Use this for the person's own durable master file.

```json
{
  "meta": {
    "fileRole": "candidate-curated",
    "canonical": false,
    "variant": "role-targeted",
    "targetRole": "CISO"
  }
}
```

Use this for a candidate-controlled curated working set. See `usage-patterns.md` for how this differs from `export-ready`.

```json
{
  "meta": {
    "fileRole": "export-ready",
    "canonical": false,
    "variant": "company-targeted",
    "targetCompany": "Example Health"
  }
}
```

Use this for a handoff to a specific exporter or downstream system.

```json
{
  "meta": {
    "fileRole": "third-party-working",
    "canonical": true,
    "source": {
      "kind": "imported"
    }
  }
}
```

Use this when a recruiter, coach, agency, employer, or tool controls a working file about a person. This is not the person's private master.

## `person`

`person` identifies the subject of the OCF. It should not be confused with the controller of the file.

Minimum useful shape:

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
        "primary": true
      }
    ]
  }
}
```

Use `renderAs` for the name that should appear in ordinary outputs. `given`, `family`, and `preferred` are structured helper fields for tools; `renderAs` remains the display string because not every professional name decomposes cleanly. Put legal names, former names, native-script names, and regional fields behind the appropriate fields and visibility controls.

Do not store government identity numbers, account secrets, passwords, passport numbers, taxpayer IDs, bank details, or API keys in OCF.

## Stable ID Rules

Use stable `id` values on durable records that tools may need to update, cite, or preserve across curation. IDs are optional unless a field needs to be referenced, but once an ID exists, future editors must preserve it across ordinary edits. If an eligible item lacks an ID, a future editor may add one.

IDs are local to an OCF lineage: the master file and files intentionally derived from, curated from, or split from it. They are not global identifiers and must not be used to link across people or unrelated OCF files. Do not rewrite existing IDs to match a tool's preferred style. Use provenance to record which tool or person created or edited an item; the ID is not a tool signature.

## `sourceArtifacts`

Source artifacts are inputs, not truth.

Use `sourceArtifacts` for old resumes, cover letters, LinkedIn exports, pasted chat text, uploaded notes, interview transcripts, portfolio bios, comp-plan photos, job descriptions, and other material used to build or improve the OCF.

Example:

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
      "fileName": "sample-resume-source.txt",
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

`sourceArtifact.kind` and `provenance.source` are deliberately different vocabularies. `sourceArtifact.kind` describes the artifact itself (`resume`, `linkedin-export`, `job-description`, `photo`, `video`, `conversation`, `chat-paste`, `interview-transcript`). `provenance.source` describes how the OCF item came into the file (`authored`, `imported`, `interview-derived`, `llm-suggested`, `curated`, `translated`, `merged`). For example, wording pasted into chat should usually have a `sourceArtifact.kind` of `chat-paste` and a `provenance.source` of `imported` or `llm-suggested`, with `sourceArtifactId` linking the two.

Use `job-description` for employer-provided role descriptions and `application-draft` for material the candidate or tool created for an application.

`sourceArtifacts.audience` is free-form and can also support voice calibration. Useful tags include `voice-authentic` for writing that sounds like the person, `voice-calibrated` for assisted writing the person has accepted as representative, and `voice-anti-pattern` for AI-heavy or rejected drafts that future tools should not imitate.

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

Recommended:

```json
{
  "id": "mhs-ransomware-2024"
}
```

Slug-style IDs are easier for humans to review and diff. UUIDs are acceptable when collision safety matters more than readability. Do not put a tool name or model name in the item ID; put that in `provenance.tool`.

## Visibility

Visibility is a curation hint, not a security boundary.

Values:

- `public`: safe for broad exposure in the relevant workflow
- `shared`: usable for recruiter, coach, hiring manager, or trusted-party contexts
- `private`: keep inside the controlling file or workflow

Candidate-owned master example:

```json
{
  "statement": "Built SOC team from 0 to 12 analysts, achieving 24/7 coverage within 6 months",
  "visibility": "public"
}
```

This is an explicit opt-up to `public`. Ordinary hand-authored material defaults to `shared` unless a field or tool sets a narrower or broader visibility.

Private coaching example:

```json
{
  "kind": "biggest-mistake",
  "text": "Underinvesting in the security awareness program in the first nine months...",
  "visibility": "private"
}
```

Public-only export paths should include only `public` material. The reference curator demonstrates this with `--public-only`, which strips both `private` and `shared` content.

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
  "label": "Travel pattern",
  "statement": "Role required roughly 50% travel across regional hospital sites.",
  "dateRange": {
    "start": { "year": 2022 },
    "end": { "year": 2024 }
  },
  "visibility": "shared"
}
```

Do not treat current willingness to travel for future roles as durable career memory. OCF does not currently define first-class fields for "willing to travel up to 25%" or "not open to 50% travel anymore." Tools that need current travel willingness for an application should ask the user at the time of use, avoid inferring it from historical role travel, and avoid saving it as a durable fact unless the user explicitly asks.

## `organizations`

Use top-level `organizations` when the same organization appears in multiple places, when its identity changed, or when organization metadata is useful across experience entries.

Example:

```json
{
  "organizations": {
    "meridianhealth.example.com": {
      "name": "Meridian Health Systems",
      "kind": "company",
      "domain": "meridianhealth.example.com"
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

Good achievement:

```json
{
  "id": "mhs-ransomware-2024",
  "kind": "accomplishment",
  "statement": "Led response to a hospital-wide ransomware incident and restored critical clinical systems within 41 hours with zero patient-care impact.",
  "metrics": [
    {
      "kind": "duration",
      "value": 41,
      "unit": "hours"
    },
    {
      "kind": "other",
      "value": 0,
      "unit": "patients",
      "note": "zero patient-care incidents attributed to the outage"
    }
  ],
  "visibility": "shared"
}
```

Use `longform` for the fuller story: stakes, context, judgment, lessons, tradeoffs, and caveats.

Use `importance` and `audiences` to help curators choose among many valid achievements.

## Attribution

Attribution keeps verbs honest.

Example:

```json
{
  "statement": "Built SOC team from 0 to 12 analysts, achieving 24/7 coverage within 6 months",
  "attribution": {
    "role": "owned",
    "scope": "Owned SOC buildout plan, hiring model, coverage target, and operating cadence.",
    "ownedBudget": true,
    "ownedHeadcount": true,
    "reportedUpward": true
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

Example:

```json
{
  "narrativeVariants": [
    {
      "id": "mhs-ransomware-public-resume",
      "label": "Public resume bullet",
      "audiences": ["resume", "public-profile"],
      "statement": "Led ransomware response that restored critical clinical systems from offline backups within 41 hours with no patient-care impact.",
      "visibility": "public"
    },
    {
      "id": "mhs-ransomware-healthcare-security",
      "label": "Healthcare security framing",
      "audiences": ["healthcare", "patient-safety"],
      "statement": "Protected patient-care continuity during a ransomware event by leading evidence-based recovery from offline backups.",
      "visibility": "shared"
    },
    {
      "id": "mhs-ransomware-interview-prep",
      "label": "Interview-prep framing",
      "audiences": ["interview-prep", "executive-judgment"],
      "longform": "Use this story to show executive judgment under pressure...",
      "visibility": "private"
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

If a variant introduces a new fact, promote that fact into canonical structured fields or create an `openQuestions` item.

## Reflections

Reflections are private review and conversation material. They are not resume bullets.

Example:

```json
{
  "kind": "proudest-of",
  "text": "The ransomware response. Most of my proudest moments in this role were team accomplishments...",
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

## Cautions

Cautions are claims the subject does not want made on their behalf.

Example:

```json
{
  "claim": "claimed as an AI / ML security specialist",
  "reason": "Has operational exposure to ML-based detection tooling but not research-level expertise.",
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

## Open Questions

Open questions are a working queue.

Examples:

```json
{
  "question": "Clarify whether the ransomware-response achievement should name the affected clinical system or keep the description generic.",
  "context": "More specificity may improve interview storytelling while also increasing sensitivity.",
  "addedDate": {
    "year": 2026,
    "month": 5,
    "day": 21
  },
  "visibility": "private"
}
```

```json
{
  "question": "For the SOC buildout, clarify what Maria directly owned versus what managers or team leads owned.",
  "context": "Attribution precision will help curators choose honest verbs.",
  "visibility": "private"
}
```

Good open questions should be answerable by the subject or by reviewing their source material. Use them for unresolved career facts, positioning choices, sensitivity decisions, attribution questions, or stories that need more detail.

Do not use a person's `openQuestions` for schema housekeeping, exporter wishlist items, or mapper TODOs. Put those in a project issue tracker, exporter documentation, or a vendor extension namespace instead.

## Talking Points

Talking points are reusable, evidence-backed career framings.

Use them for patterns that are bigger than one achievement but more concrete than a vague personal brand: how someone handles ambiguous situations, how they explain a transition, what they repeatedly bring to teams, or a confirmed through-line surfaced by a career conversation.

Talking points should cite evidence. Prefer `supportingItemIds` when the supporting items have IDs, and use `supportingEvidence` when the evidence is a source artifact, external reference, or descriptive path that cannot yet be expressed as an item ID. A talking point without evidence is just a slogan; curators should be careful not to overuse it.

Example:

```json
{
  "id": "authority-from-demonstrated-work",
  "label": "Authority through demonstrated work",
  "statement": "Rebuilds authority by doing the hard work first, then asking others to join.",
  "supportingItemIds": ["mhs-soc-buildout", "army-cyber-leadership-progression"],
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

`goals` describes where the person is trying to go.

`voice` describes how drafts should sound.

`aiInstructions` customizes tool behavior for this file.

For the longer rationale behind these fields, see `guide.html` and its discussion of OCF as input to a career conversation.

Example:

```json
{
  "voice": {
    "style": "plain-direct",
    "avoidPhrases": ["leveraged", "thought leader"],
    "preferredPhrases": ["led", "owned", "built"]
  },
  "aiInstructions": "Push back when I undersell. Ask before drafting from uncertain prior-session claims."
}
```

Keep these private by default. They are not resume content.

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

## Vendor Extensions

Use `extensions` for vendor-specific metadata that should round-trip through tools.

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

```json
{
  "$schema": "https://opencareerformat.org/v0.3/schema.json",
  "schemaVersion": "0.3",
  "meta": {
    "fileRole": "candidate-master",
    "canonical": true,
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
