# Maria Reyes Example: Implementation Details

> Last updated: 2026-07-15.

This page opens the OCF files behind the [Maria Reyes conversation example](README.md) and shows how accepted conversation results become structured career memory. Read the conversations to see the workflow; use this page to inspect the resulting JSON.

| Conversation example | Implementation lesson |
|---|---|
| [Maria starts with a resume and no OCF](README.md#conversation-one-maria-creates-her-first-ocf) | [Source Material Becomes Provisional Career Memory](#source-material-becomes-provisional-career-memory) |
| [A short ransomware bullet is explored in Conversation Two](README.md#how-marias-ocf-grew) | [Short Claim Expanded Into Reusable Career Memory](#short-claim-expanded-into-reusable-career-memory) |
| [Maria follows the question about her leadership transition](README.md#conversation-five-maria-explores-a-leadership-transition) | [User Wording And Model Interpretation Stored Separately](#user-wording-and-model-interpretation-stored-separately) |
| [Maria recovers the path behind her final Army rank](README.md#how-marias-ocf-grew) | [Timeline Recovered Behind A Final Title](#timeline-recovered-behind-a-final-title) |
| [Maria considers which private details fit a new audience](README.md#private-does-not-mean-never-useful) | [Stable Facts Support Different Outputs](#stable-facts-support-different-outputs) |
| [Maria corrects her career timeline and management scope](README.md#the-conversation-improves-the-career-memory) | [Canonical Field Corrected](#canonical-field-corrected) |
| [Maria scopes her FedRAMP responsibility](README.md#the-conversation-improves-the-career-memory) | [Achievement Added With Attribution](#achievement-added-with-attribution) |
| [Maria rejects claims that should not return](README.md#the-conversation-improves-the-career-memory) | [Caution Added](#caution-added) |
| [The target and review conversation become evidence](README.md#the-conversation-improves-the-career-memory) | [Provenance And Source Artifact Added](#provenance-and-source-artifact-added) |
| [Maria accepts the complete correction set](README.md#the-conversation-improves-the-career-memory) | [Version Advanced From 6 To 7](#version-advanced-from-6-to-7) |

The complete [`revision 1`](maria-reyes-revision-1.ocf.json), [`revision 6`](maria-reyes-revision-6.ocf.json), and [`revision 7`](maria-reyes-revision-7.ocf.json) files are available for anyone who wants to inspect the full records or double-check the excerpts directly.

## Source Material Becomes Provisional Career Memory

The starting point is an ordinary short resume. In OCF terms, the resume is not the master truth. It is a `sourceArtifact`.

The importer or LLM should:

- record the resume as a `sourceArtifacts` entry;
- extract person, education, certifications, skills, experience, positions, and achievements;
- preserve useful wording from the resume;
- assign provenance to imported items;
- avoid inventing missing metrics, dates, supervisors, or outcomes.

At this point the file is best understood as a provisional `candidate-master`: the file can already be the person's working master, but imported items should remain visibly unreviewed until the person accepts them.

Its metadata records both ideas: this is now Maria's working master, and its starting material was imported. The modification date remains the date of Conversation One, not the later date when this teaching reconstruction was created:

```json
{
  "meta": {
    "fileRole": "candidate-master",
    "lastModified": "2026-05-20",
    "source": {
      "kind": "imported"
    },
    "version": "1"
  }
}
```

Maria's [`revision 1`](maria-reyes-revision-1.ocf.json) shows that first result. It broadly captures the source resume without pretending that the first conversation recovered all of the underlying history. For example, the ransomware bullet initially remains close to the source wording:

```json
{
  "id": "mhs-ransomware-2024",
  "statement": "Led response to a ransomware incident and restored critical clinical systems within 41 hours with zero patient-care impact.",
  "kind": "accomplishment",
  "visibility": "public",
  "provenance": {
    "source": "imported",
    "date": "2026-05-20",
    "sourceArtifactId": "sample-resume-source-2026-05"
  },
  "reviewStatus": "unreviewed"
}
```

The same file preserves the questions Maria chose not to answer. This keeps a named skill from quietly becoming an invented accomplishment:

```json
{
  "id": "open-question-vulnerability-management-ownership",
  "question": "Did Maria run a formal vulnerability-management program, own part of it through the SOC, or mainly provide oversight?",
  "context": "The target role makes vulnerability management a core responsibility, but the source resume lists the skill without enough evidence to support a stronger claim.",
  "visibility": "private"
}
```

Revision 1 reconstructs the provisional OCF produced by Conversation One using only the source resume, healthcare job description, and that conversation.

The stable `mhs-ransomware-2024` ID remains unchanged as later conversations add context, evidence, cautions, and alternate wording. The existing career memory is enriched instead of being duplicated.

## Short Claim Expanded Into Reusable Career Memory

The source resume contains one compressed public bullet point:

```text
- Led response to a ransomware incident and restored critical clinical systems within 41 hours with zero patient-care impact.
```

Loaded into a frontier model with OCF guidance, that bullet point is first captured as source material. The model should not treat it as complete truth or rewrite it immediately. It should ask what the bullet point means: what Maria personally did, what evidence supported the decision, which metrics are safe to use, what should stay private, and what future tools should avoid overstating.

An OCF-oriented intake pass does more than rewrite resume bullet points. It asks whether each bullet point should become:

- a canonical achievement;
- structured metrics;
- supporting facts;
- a private reflection;
- a caution;
- an open question;
- a narrative variant for a particular audience.

The ransomware response story in `maria-reyes-revision-7.ocf.json` shows this pattern. After follow-up questions, the career event that boiled down to a short bullet point turns into structured data and reusable memory:

- a structured achievement;
- supporting facts and metrics;
- private reflection material;
- cautions about overclaiming;
- narrative variants for different audiences.

That is the core OCF loop: preserve the facts once, then let future curation choose the right wording.

In the OCF, that becomes a richer achievement. The public claim is still there, but the master file also keeps the judgment call, evidence, metrics, and review context that a resume cannot hold:

```json
{
  "id": "mhs-ransomware-2024",
  "statement": "Led response to a hospital-wide ransomware incident — performed forensic analysis on the attacker tooling, advised leadership against paying the ransom based on observed decryption failures in adjacent engagements, and executed an alternate recovery path from offline backups; restored critical clinical systems within 41 hours with zero patient-care impact.",
  "metrics": [
    { "kind": "duration", "value": 41, "unit": "hours", "note": "time-to-restore: critical clinical systems back online from offline backups" },
    { "kind": "other", "value": 0, "unit": "patients", "note": "patient_care_impact: zero patient-care incidents attributed to the outage" },
    { "kind": "other", "value": 0, "unit": "USD", "note": "ransom_paid: no ransom was paid; recommendation against payment was accepted by leadership" }
  ],
  "provenance": {
    "source": "interview-derived",
    "sessionTopic": "Tailoring resume for CISO-track role"
  }
}
```

The same achievement also carries longer private context, narrative variants for different audiences, and cautions about overclaiming. That is the practical difference between a resume and career memory.

The follow-up interview also changes the surrounding memory. Selected fields on the `mhs-ransomware-2024` achievement show skills that were only implied by the bullet point and reusable wording for different audiences:

```json
{
  "id": "mhs-ransomware-2024",
  "skills": [
    "Incident Response Leadership",
    "Ransomware Analysis",
    "Executive Risk Communication",
    "Backup Recovery Operations",
    "Forensic Tooling Triage"
  ],
  "narrativeVariants": [
    {
      "id": "mhs-ransomware-public-resume",
      "label": "Public resume bullet point",
      "statement": "Led ransomware response that restored critical clinical systems from offline backups within 41 hours with no patient-care impact.",
      "visibility": "public"
    },
    {
      "id": "mhs-ransomware-security-leadership",
      "label": "Security leadership framing",
      "statement": "Led evidence-based ransomware recovery by analyzing attacker tooling, advising executives against payment, and restoring critical systems from backups within 41 hours.",
      "visibility": "shared"
    },
    {
      "id": "mhs-ransomware-healthcare-security",
      "label": "Healthcare security framing",
      "statement": "Protected patient-care continuity during a ransomware event by leading evidence-based recovery from offline backups and restoring critical clinical systems within 41 hours.",
      "visibility": "shared"
    }
  ]
}
```

Separately, the top-level `cautions` collection records a correction from an overreaching draft:

```json
{
  "cautions": [
    {
      "claim": "claimed as an AI / ML security specialist",
      "reason": "Has good operational exposure to ML-based detection tooling but does not have research-level expertise. Past LLM draft positioned this too strongly; corrected here."
    }
  ]
}
```

Those are not three separate stories. They are three reusable consequences of one clarified story: what skills it demonstrates, how to tell it to different audiences, and what not to claim.

## Timeline Recovered Behind A Final Title

The same intake pattern applies to timelines, not just events. Maria's resume lists her rank exactly once, the way veterans often write resumes:

```text
United States Army | Cyber Operations Specialist (17C), Staff Sergeant (E-6) | 2016-01 - 2018-08
```

That single line is enough for a civilian reader. It is not enough for career memory, because anyone who served can read rank against years of service in seconds: the progression behind a final rank is a story military readers reconstruct whether or not the file tells it. A short intake exchange recovers the path:

> **LLM:** Your resume shows you separated as a Staff Sergeant after eight years. What was the progression behind that?
>
> **Maria:** Came in as a PV2 in 2010. PFC in '11, Specialist in '12, made Sergeant in 2014, and pinned Staff Sergeant in March 2017 after I reclassed to 17C.

The master stores each step as a dated supporting fact on a spanning achievement: the same pattern the schema documents for "top 5 seller 2010-2015" backed by annual records. The `progression` block remains the narrative summary; this spanning achievement holds the checkable steps:

```json
{
  "id": "army-rank-progression",
  "kind": "recognition",
  "statement": "Progressed from Private (E-2) to Staff Sergeant (E-6) across eight years of service, with four promotions.",
  "supportingFacts": [
    {
      "id": "army-promo-e5",
      "statement": "Promoted to Sergeant (E-5)",
      "date": { "year": 2014 },
      "visibility": "shared"
    },
    {
      "id": "army-promo-e6",
      "statement": "Promoted to Staff Sergeant (E-6)",
      "date": { "year": 2017, "month": 3 },
      "visibility": "shared"
    }
  ],
  "visibility": "shared",
  "provenance": {
    "source": "interview-derived",
    "date": "2026-06-11",
    "sessionTopic": "Military record pass",
    "operation": "recovered-promotion-dates-behind-final-rank",
    "confidence": 0.9,
    "sourceArtifactId": "sample-resume-source-2026-05",
    "note": "Final rank and MOS appear on the source resume; the dated steps were established during Conversation Six."
  }
}
```

The excerpt shows two of the six supporting facts in Maria's OCF. Note the provenance split: the final rank is supported by the resume itself; the dated steps are interview-derived. The resume proves the endpoint; the conversation recovers the path.

Whether the steps appear in any output is a separate decision. A general civilian resume may show none of them; a government-contracting resume may list every one. The OCF stores the full path so curation can choose. Storage and display are different questions, and OCF only fixes the first.

## User Wording And Model Interpretation Stored Separately

[Conversation Five](README.md#conversation-five-maria-explores-a-leadership-transition) is the canonical telling of the parking-garage story and the model's proposed through-line. This page does not retell that exchange. It shows why the accepted conversation creates two different records: the person's original words remain a private reflection, while the model's interpretation becomes a separate talking point only after the person confirms it.

The story is stored where it happened, as a role reflection:

```json
{
  "kind": "never-on-resume-story",
  "text": "My first month at Meridian, I asked an analyst to cover a weekend shift and he just said no. In the Army I never heard 'no' to a lawful tasking. I'd been a civilian five years by then — but as an analyst, then a consultant. Meridian was the first time since the Army I had people to task. I sat in my car in the parking garage for a while after that one. What I eventually understood is that nobody in that building had ever watched me earn anything. In the Army, my rank was the authority. Out here, working for someone meant something different. So I stopped asking for anything I hadn't done first. I took the worst on-call rotations for two months and wrote up every handoff like it mattered, because it did. By the time we staffed the overnight shift, I had a waiting list to get on my team. The Army would have called that bad delegation. I call it the thing that worked.",
  "visibility": "private",
  "provenance": {
    "source": "interview-derived",
    "date": "2026-05-24",
    "sessionTopic": "Story-ask pass (per the first-session script)",
    "operation": "never-on-resume-story"
  }
}
```

The confirmed through-line is stored separately, because it is not a raw story and not a single achievement:

```json
{
  "talkingPoints": [
    {
      "id": "authority-from-demonstrated-work",
      "label": "Authority from demonstrated work",
      "statement": "I rebuild authority from demonstrated work rather than inherited position.",
      "uses": [
        "interview-prep",
        "leadership-screen",
        "military-to-civilian-transition"
      ],
      "visibility": "private",
      "supportingItemIds": [
        "meridian-health-systems-director-of-cybersecurity-never-on-resume-story-reflection",
        "mhs-soc-buildout"
      ],
      "supportingEvidence": [
        {
          "kind": "reflection",
          "id": "meridian-health-systems-director-of-cybersecurity-never-on-resume-story-reflection",
          "summary": "First-month Meridian story about rebuilding authority after an analyst declined a weekend shift."
        },
        {
          "kind": "achievement",
          "id": "mhs-soc-buildout",
          "summary": "Built SOC from 0 to 12 analysts and reached 24/7 coverage within six months."
        }
      ],
      "evidenceSummary": "Supported by Maria's first-month Meridian story and by the SOC buildout that reached 24/7 coverage in six months.",
      "reviewStatus": "user-confirmed",
      "provenance": {
        "source": "llm-suggested",
        "operation": "earned-through-line-reflection"
      }
    }
  ]
}
```

The storage choice follows a simple rule: raw user wording goes into a private reflection; a confirmed synthesized pattern goes into a talking point; unresolved implications become or update open questions. The source memory is not replaced by polished model prose.

## Stable Facts Support Different Outputs

[Conversation Seven](README.md#private-does-not-mean-never-useful) shows the user deciding whether private career memory is appropriate for a particular application. The JSON also supports different truthful descriptions of the same evidence. For a general civilian audience, Maria's Army leadership can emphasize team scope. For a government-contractor audience, rank and MOS may be relevant. Both variants remain attached to the same achievement:

```json
{
  "narrativeVariants": [
    {
      "id": "army-cyber-lead-civilian",
      "label": "Civilian resume framing",
      "audiences": [
        "civilian",
        "healthcare",
        "private-sector"
      ],
      "statement": "Led a 6-person cyber operations team protecting a 15,000-node enterprise network.",
      "visibility": "public",
      "provenance": {
        "source": "curated",
        "date": "2026-06-11",
        "sourceArtifactId": "sample-resume-source-2026-05",
        "operation": "military-to-civilian-framing",
        "confidence": 0.9
      },
      "reviewStatus": "user-confirmed"
    },
    {
      "id": "army-cyber-lead-federal",
      "label": "Federal / defense framing",
      "audiences": [
        "federal",
        "defense-contractor",
        "cleared"
      ],
      "statement": "As a Staff Sergeant (17C), led a 6-person defensive cyber operations team protecting a 15,000-node Army enterprise network.",
      "notes": "Federal and defense audiences expect rank and MOS; omitting them can read as concealment, not brevity.",
      "visibility": "shared",
      "provenance": {
        "source": "curated",
        "date": "2026-06-11",
        "sourceArtifactId": "sample-resume-source-2026-05",
        "operation": "federal-defense-framing",
        "confidence": 0.9
      },
      "reviewStatus": "user-confirmed"
    }
  ]
}
```

The underlying fact does not change. Curation chooses the approved wording that fits the audience, while the stored rank progression prevents either version from implying leadership throughout Maria's entire service.

The same audience inversion can apply at the person level. `person.headline` remains Maria's general-purpose headline, while `positioningVariants` records target-aware alternatives with supporting evidence:

```json
{
  "positioningVariants": [
    {
      "id": "maria-healthcare-security-headline",
      "kind": "headline",
      "label": "Healthcare security leadership headline",
      "headline": "Healthcare cybersecurity leader protecting clinical continuity through incident response, compliance, and SOC maturity",
      "audiences": [
        "healthcare-security",
        "ciso-track",
        "security-leadership"
      ],
      "supportingItemIds": [
        "mhs-ransomware-2024",
        "mhs-soc-buildout"
      ],
      "evidenceSummary": "Supported by Maria's ransomware recovery leadership and the Meridian SOC buildout.",
      "visibility": "shared",
      "reviewStatus": "user-confirmed"
    },
    {
      "id": "maria-federal-cyber-headline",
      "kind": "headline",
      "label": "Federal / defense cyber headline",
      "headline": "Former Army Staff Sergeant (17C) and cybersecurity leader with enterprise incident response and SOC buildout experience",
      "audiences": [
        "federal",
        "defense",
        "cleared-cyber",
        "military-transition"
      ],
      "supportingItemIds": [
        "army-rank-progression",
        "army-cyber-leadership",
        "mhs-ransomware-2024"
      ],
      "evidenceSummary": "Supported by Maria's Army rank/MOS progression, Army cyber leadership, and later healthcare incident-response leadership.",
      "visibility": "shared",
      "reviewStatus": "user-confirmed"
    }
  ]
}
```

The headline changes, but the supporting IDs do not. The user can approve one version for a healthcare role and another for a government contractor without inventing a second career history.

## Canonical Field Corrected

In [Conversation Seven](README.md#the-conversation-improves-the-career-memory), Maria corrects two statements that had become part of her accumulated OCF. Revision 6 overstates both the length of her private-sector cybersecurity work and the size of teams she managed:

```json
{
  "person": {
    "summary": "Eight years of Army service in signal and cyber operations followed by a decade in private-sector cybersecurity. Led SOC teams, built zero-trust architectures, and earned CISSP and CISM certifications. Comfortable briefing generals and board members alike."
  },
  "competencies": [
    {
      "label": "Leadership & Cross-Functional Communication",
      "description": "Led teams of 8-40 across military and civilian contexts. Briefed flag officers, C-suite executives, and board audit committees on risk posture and incident status. Mentored junior analysts through career transitions."
    }
  ]
}
```

Revision 7 replaces those statements rather than preserving two contradictory canonical versions:

```json
{
  "person": {
    "summary": "Ten years in dedicated cybersecurity across Army cyber operations and civilian roles, preceded by Army signal-systems experience. Led SOC teams, built zero-trust architectures, and earned CISSP and CISM certifications. Briefs the CISO monthly and the board audit committee quarterly."
  },
  "competencies": [
    {
      "label": "Leadership & Cross-Functional Communication",
      "description": "Led a 6-person Army cyber team and later an 18-person civilian security function with 12 direct reports. Briefs the CISO monthly and the board audit committee quarterly. Has coordinated incident groups as large as 40 people, but does not describe that as management scope."
    }
  ]
}
```

The general lesson is that structured content is still reviewable. When the person corrects an existing claim, the canonical field should become more accurate; structure is not a reason to preserve a known error.

## Achievement Added With Attribution

The revision 6 competency text said Maria had "led FedRAMP authorization for a SaaS product." Conversation Seven establishes a narrower and more useful account: the product received authorization, but Maria owned the security-operations workstream rather than the whole program.

Revision 7 turns that clarification into an achievement with explicit attribution:

```json
{
  "id": "mhs-fedramp-security-operations-workstream",
  "statement": "Led the security-operations workstream supporting a successful FedRAMP Moderate authorization, accountable for logging and monitoring, incident response, vulnerability remediation, operational evidence, and assigned findings.",
  "kind": "accomplishment",
  "importance": 4,
  "audiences": [
    "government-contractor",
    "federal",
    "security-leadership"
  ],
  "skills": [
    "FedRAMP",
    "NIST 800-53",
    "Incident Response",
    "Vulnerability Management"
  ],
  "visibility": "shared",
  "attribution": {
    "role": "owned",
    "scope": "Owned the security-operations workstream. The GRC director owned the overall authorization program and 3PAO relationship; cloud engineering owned infrastructure changes.",
    "reportedUpward": true,
    "notes": "The SaaS product received authorization in 2025. Do not describe Maria as having led the entire authorization."
  },
  "provenance": {
    "source": "interview-derived",
    "date": "2026-07-14",
    "sessionTopic": "Government-contractor role review",
    "operation": "fedramp-attribution-clarification",
    "confidence": 0.95,
    "sourceArtifactId": "government-contractor-review-2026-07-14"
  },
  "reviewStatus": "user-confirmed"
}
```

Attribution preserves the strong part of the claim while recording where Maria's responsibility ended. A later resume can use the achievement without quietly promoting workstream ownership into program ownership.

## Caution Added

Correcting the current wording is not enough if a future model could make the same plausible mistake. Revision 7 adds a caution that tells later tools what not to reconstruct:

```json
{
  "claim": "described as having led the entire FedRAMP authorization",
  "reason": "Maria owned the security-operations workstream. The GRC director owned the overall authorization program and 3PAO relationship, and cloud engineering owned infrastructure changes.",
  "visibility": "private",
  "provenance": {
    "source": "interview-derived",
    "date": "2026-07-14",
    "sourceArtifactId": "government-contractor-review-2026-07-14",
    "operation": "fedramp-attribution-correction",
    "confidence": 0.95
  },
  "addedDate": {
    "year": 2026,
    "month": 7,
    "day": 14
  },
  "id": "caution-led-entire-fedramp-authorization"
}
```

The same conversation adds cautions against describing a 40-person incident group as management scope and against claiming unsupported flag-officer briefings. A caution makes a correction durable without discarding the surrounding career evidence.

## Provenance And Source Artifact Added

Revision 7 records both the target that prompted the review and the conversation that produced the accepted changes:

```json
{
  "sourceArtifacts": [
    {
      "id": "government-contractor-job-description-2026-07-14",
      "kind": "job-description",
      "label": "Cybersecurity operations director job description for government programs",
      "capturedDate": {
        "year": 2026,
        "month": 7,
        "day": 14
      },
      "audience": [
        "government-contractor",
        "federal",
        "defense"
      ],
      "sourceTool": "manual-example",
      "fileName": "government-contractor-job-description.txt",
      "rawIncluded": false,
      "notes": "Private-employer job description for a role serving U.S. government customers. Used as target evidence during Conversation Seven.",
      "visibility": "private"
    },
    {
      "id": "government-contractor-review-2026-07-14",
      "kind": "conversation",
      "label": "Government-contractor role review",
      "capturedDate": {
        "year": 2026,
        "month": 7,
        "day": 14
      },
      "audience": [
        "government-contractor",
        "security-leadership"
      ],
      "sourceTool": "Recommended OCF LLM prompt",
      "fileName": "README.md",
      "rawIncluded": true,
      "notes": "Conversation preserved under Conversation Seven in README.md. It compared the target first with Maria's source resume and then with revision 6 of her OCF. Maria corrected the private-sector timeline, management scope, FedRAMP attribution, and executive-briefing evidence.",
      "visibility": "private"
    }
  ]
}
```

The job description explains why these questions were asked; it does not become career truth. Item-level provenance points back to the review conversation so later tools can distinguish imported material, prior claims, and user-confirmed corrections.

## Version Advanced From 6 To 7

Revision 7 is not a patch file. It is the complete OCF after the accepted changes. Its metadata advances the version and records when the file changed:

Revision 6:

```json
{
  "meta": {
    "lastModified": "2026-06-11",
    "version": "6"
  }
}
```

Revision 7:

```json
{
  "meta": {
    "lastModified": "2026-07-14",
    "version": "7"
  }
}
```

Everything that remained valid in revision 6 stays available in revision 7, including the private reflection and talking point from Conversation Five. The accepted Conversation Seven changes add better canonical wording, attributed achievements, cautions, and source records. Readers can inspect [`revision 6`](maria-reyes-revision-6.ocf.json) and [`revision 7`](maria-reyes-revision-7.ocf.json) directly to verify the complete difference.
