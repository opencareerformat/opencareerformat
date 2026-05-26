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

## Contents

- [Core Mental Model](#core-mental-model)
- [Naming Files](#naming-files)
- [v0.2 Compatibility Names Replaced In v0.3](#v02-compatibility-names-replaced-in-v03)
- [`meta`](#meta)
- [`person`](#person)
- [`sourceArtifacts`](#sourceartifacts)
- [`provenance`](#provenance)
- [Stable IDs](#stable-ids)
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

- `master.ocf.json`
- `sample-resume.ocf.json`
- `acme-ciso-2026-05-24.ocf.json`
- `public-profile.ocf.json`

Directory layout is a workflow choice. See `usage-patterns.md` for import, curated, and export directory examples.

OCF does not force structure into filenames, but humans often benefit from names that describe the purpose. For example, a file generated specifically for a CISO role at Acme in May 2026 should have a name that reflects that context.

Use explicit names before introducing abbreviations. A future curated example might be named `sample-resume.public-profile.ocf.json` or `sample-resume.acme-ciso.ocf.json`; do not assume a shorthand such as `.c.ocf.json` until usage proves it helpful.

## v0.2 Compatibility Names Replaced In v0.3

OCF v0.2 still carries a few schema names from the earlier "derived file" vocabulary: `meta.derivedFrom`, `meta.derivedFromVersion`, `meta.derivationNotes`, and `meta.source.kind: "derived"`. Treat these as compatibility names in v0.2. Tooling should preserve and read them, but new docs and UI should describe the workflow as curation and export-ready preparation.

v0.3 should replace these fields and enum values with names that match the current language directly. Do not confuse them with provenance values such as `interview-derived`, which remain useful for describing how an item was elicited.

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
- `source`: how this file came to be.

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

`sourceArtifact.kind` and `provenance.source` are deliberately different vocabularies. `sourceArtifact.kind` describes the artifact itself (`resume`, `linkedin-export`, `chat-paste`, `interview-transcript`). `provenance.source` describes how the OCF item came into the file (`authored`, `imported`, `interview-derived`, `llm-suggested`, `curated`, `translated`, `merged`). For example, wording pasted into chat should usually have a `sourceArtifact.kind` of `chat-paste` and a `provenance.source` of `imported` or `llm-suggested`, with `sourceArtifactId` linking the two.

OCF v0.2 does not include `job-description` as a `sourceArtifact.kind` enum value. For now, use `application-draft`, `manual-note`, or `other` for job descriptions depending on the source and workflow. `job-description` is a likely v0.3 addition because resume-plus-JD workflows are common.

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

Use stable IDs on records tools may need to reference later: source artifacts, experience entries, positions, achievements, reflections, variants, open questions, and other durable items.

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

Do not use organization address as a proxy for the person's work location, residence, or tax-sensitive location history. A resume may reasonably show the company, office, or market location without implying where the person lived or performed all work. If role-location nuance matters, preserve it separately and keep sensitive residence or tax details private. Until OCF has first-class position-level location fields, use `extensions.user.local` for private/local location notes and curate only the location facts the user intentionally wants to disclose.

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
- drove
- contributed to
- supported
- advised
- observed

This is not formal verification. It is a structured prompt for honest wording. RACI-like questions can help clarify responsibility, but OCF does not encode a formal RACI model.

The `role` values are common cases, not a complete vocabulary for every collaboration pattern. If the precise truth is "co-led," "jointly owned," or "led one workstream inside a larger program," use the closest role value and put the nuance in `scope` or `notes` so a curator can choose accurate verbs.

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

By interim convention, use `extensions.user.local` for user-controlled scratch metadata that has no vendor owner and no first-class schema field yet. It is valid under the v0.2 extension key pattern, but it is not a v0.2 normative schema commitment. Portable data should still prefer first-class schema fields when they exist, and vendor-owned metadata should use a domain the vendor controls.

## Importer Guidance

Importers should be conservative.

See `usage-patterns.md` for the full imported-starter workflow. At the field level, an importer should:

- add a `sourceArtifacts` entry
- preserve provenance on imported items
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

For proposed improvements, keep the suggested update distinct from export-ready content. In v0.2, tools can do this with a vendor extension, a candidate-curated working file, or an external review queue:

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
  "$schema": "https://opencareerformat.org/v0.2/schema.json",
  "schemaVersion": "0.2",
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
