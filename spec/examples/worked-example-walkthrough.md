# Worked Example Walkthrough

The details behind a resume bullet point fade fast — usually right when you next need them. This walkthrough takes one bullet point, a hospital ransomware response, and recovers the career memory behind it.

This walkthrough explains the lifecycle behind the fictional Maria E. Reyes example files. It is not a new schema requirement; it is a concrete way to read the examples as a small OCF workflow.

Files:

| File | Website | GitHub source |
|---|---|---|
| Source resume | [`sample-resume-source.txt`](https://opencareerformat.org/spec/examples/sample-resume-source.txt) | [`spec/examples/sample-resume-source.txt`](https://github.com/opencareerformat/opencareerformat/blob/main/spec/examples/sample-resume-source.txt) |
| Enriched OCF file | [`sample-resume.ocf.json`](https://opencareerformat.org/spec/examples/sample-resume.ocf.json) | [`spec/examples/sample-resume.ocf.json`](https://github.com/opencareerformat/opencareerformat/blob/main/spec/examples/sample-resume.ocf.json) |
| Detailed change history, from source resume through OCF improvements | [`sample-resume.html`](https://opencareerformat.org/spec/examples/sample-resume.html) | [`spec/examples/sample-resume.md`](https://github.com/opencareerformat/opencareerformat/blob/main/spec/examples/sample-resume.md) |
| Target job description | [`sample-job-description.txt`](https://opencareerformat.org/spec/examples/sample-job-description.txt) | [`spec/examples/sample-job-description.txt`](https://github.com/opencareerformat/opencareerformat/blob/main/spec/examples/sample-job-description.txt) |

## 1. Source Resume Captured

The starting point is an ordinary short resume. In OCF terms, the resume is not the master truth. It is a `sourceArtifact`.

The importer or LLM should:

- record the resume as a `sourceArtifacts` entry;
- extract person, education, certifications, skills, experience, positions, and achievements;
- preserve useful wording from the resume;
- assign provenance to imported items;
- avoid inventing missing metrics, dates, supervisors, or outcomes.

At this point the file is best understood as a provisional `candidate-master`: the file can already be the person's working master, but imported items should remain visibly unreviewed until the person accepts them.

## 2. Intake Turns Bullet Points Into Career Memory

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

The ransomware response story in `sample-resume.ocf.json` shows this pattern. After follow-up questions, the career event that boiled down to a short bullet point turns into structured data and reusable memory:

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

The follow-up interview also changes the surrounding memory. Maria's explanation adds skills that were only implied by the bullet point, creates reusable wording for different audiences, and records a caution from an overreaching draft:

```json
{
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
  ],
  "cautions": [
    {
      "claim": "claimed as an AI / ML security specialist",
      "reason": "Has good operational exposure to ML-based detection tooling but does not have research-level expertise. Past LLM draft positioned this too strongly; corrected here."
    }
  ]
}
```

Those are not three separate stories. They are three reusable consequences of one clarified story: what skills it demonstrates, how to tell it to different audiences, and what not to claim.

### The Resume Proves The Endpoint; The Conversation Recovers The Path

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
    "note": "Final rank and MOS appear on the source resume; the dated steps were established in conversation for this fictional example."
  }
}
```

The excerpt shows two of the six supporting facts in the sample file. Note the provenance split: the final rank is supported by the resume itself; the dated steps are interview-derived. The resume proves the endpoint; the conversation recovers the path.

Whether the steps appear in any output is a separate decision. A civilian resume shows none of them; a federal resume may list every one. The master stores the full path so curation can choose. Storage and display are different questions, and OCF only fixes the first.

### Stories Improve Career Memory

A first-session OCF workflow should also ask for one story about the person's work that they would never put on a formal resume. The point is not to force the story into a bullet point immediately. The point is to preserve career memory in the subject's own words, then look for an earned pattern only if the evidence supports it.

In the Maria example, the military-to-civilian leadership gap is a good place to do this. The general heuristic is: look for the seam the resume crosses silently. Maria's resume proves Army cyber leadership and later healthcare security leadership, but it does not explain how she translated authority across those worlds.

A short version of the conversation could look like this:

> **Maria:** I have this resume and a Director of Security job description. I do not have an OCF yet. Can you help me with the application?
>
> **LLM:** Yes. First, a gap read: the job appears to want healthcare security leadership, incident response judgment, SOC maturity, compliance depth, and executive communication. Your resume already proves healthcare security leadership, SOC buildout, HITRUST/SOC 2, ransomware response, Army cyber operations, and executive-facing communication. The gaps I would probe before drafting are: what you personally owned in the SOC buildout, what judgment you exercised in the ransomware event, and how your military leadership translated into civilian teams.
>
> *Maria answers the targeted questions; the LLM drafts the resume and cover letter; then it closes the session by saving what should improve the next one.*
>
> **LLM:** Before I create the starter OCF, one more question: tell me one story about your work that you would never put on a formal resume. It can be something that happened at work, how you work, what you like doing at work, or an anecdote that explains a role. It does not need an outcome or metric.

Maria's story, preserved verbatim:

> My first month at Meridian, I asked an analyst to cover a weekend shift and he just said no. In the Army I never heard "no" to a lawful tasking. I'd been a civilian five years by then — but as an analyst, then a consultant. Meridian was the first time since the Army I had people to task. I sat in my car in the parking garage for a while after that one. What I eventually understood is that nobody in that building had ever watched me earn anything. In the Army, my rank was the authority. Out here, working for someone meant something different. So I stopped asking for anything I hadn't done first. I took the worst on-call rotations for two months and wrote up every handoff like it mattered, because it did. By the time we staffed the overnight shift, I had a waiting list to get on my team. The Army would have called that bad delegation. I call it the thing that worked.

An LLM should not polish that into case-study prose. The unpolished texture teaches future tools what the transition actually felt like and how Maria explains it.

Bad flattened version:

> Maria adapted her military leadership style to civilian healthcare security by modeling commitment, improving team trust, and increasing shift coverage engagement.

That version is shorter, but it destroys the memory. It removes the parking garage, the rank shock, the failed assumption, and the reason the later talking point is earned.

After preserving the story, the tool can offer an earned through-line only if it can cite independent evidence. For example:

> Does this ring true — you rebuild authority from demonstrated work rather than inherited position? It's in this story, and it's how the SOC got built: 24/7 coverage in six months, staffed by people who'd watched you take the first shifts yourself.

If Maria confirms it, the raw story stays as a private reflection, and the confirmed through-line is saved as a reusable talking point for future interviews, cover letters, and coaching conversations. The existing military-to-civilian open question should also be updated: the file now has story-backed material, but it may still need additional examples about coaching, performance management, or hard staffing decisions.

The resulting OCF update is concrete. The story is stored where it happened, as a role reflection:

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
      "supportingItemIds": ["mhs-soc-buildout"],
      "supportingEvidence": [
        {
          "kind": "reflection",
          "path": "experience[name=Meridian Health Systems].positions[title=Director of Cybersecurity].reflections[kind=never-on-resume-story]",
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

The storage choice follows a simple rule: raw user wording goes into a private reflection; a confirmed synthesized pattern goes into a talking point; unresolved implications become or update open questions.

This is the give-back loop. The user contributes a story that was never resume-shaped; the tool returns a pattern that is useful only because it is earned from the user's own evidence. If the user rejects the pattern, the correction is useful too.

## 3. Review Adds Guardrails

Early drafts often overstate something. OCF records those corrections instead of making the user repeat them in every future session.

In the sample file, cautions and open questions show how a reviewer or LLM can preserve:

- claims not to make;
- missing attribution details;
- questions about how military leadership translates to civilian staffing contexts;
- areas where a future conversation should ask for better evidence.

Cautions are leading controls. A future curation pass should read them before drafting.

For example, the sample file records a caution against positioning Maria as an "AI / ML security specialist." The underlying fact is useful: she has operational exposure to ML-based detection tooling. The risky draft leap is turning that exposure into research-level AI/ML specialization. Once the caution is saved, a later tool can still use the real fact, but it should choose safer wording such as "evaluated and operationalized ML-assisted detection tooling" rather than overstating her expertise.

That is the value of a caution: the user corrects the mistake once, and future curation starts with that correction already in memory.

## 4. Candidate Master Accumulates Over Time

After review, accepted material can become part of a candidate-owned master OCF. The master may contain more than any resume should show:

- achievements that can be shared;
- private reflections that improve future coaching or interview prep;
- source artifacts;
- provenance;
- open questions;
- cautions;
- narrative variants;
- skills and certifications.

The master is not an output. It is the private memory layer.

## 5. Curation For A Target

When the user provides a target job description, a curator reads the master plus the target and decides:

- what to filter because of privacy or relevance;
- what to question because it is missing, stale, or unclear;
- what to rank because it is strong evidence for the target.

The output of this step is not necessarily a final resume. It may be:

- proposed improvements to the master;
- export-ready content for a resume or cover letter;
- interview-prep notes;
- a short list of questions the user should answer first.

If an item is real but irrelevant to the target, it stays in the master and gets filtered from the current output.

For this healthcare cybersecurity director job description, the ransomware response, SOC buildout, HITRUST/SOC 2, and executive-risk communication material are highly relevant. The `mhs-mssp-transition` achievement is still useful career memory, but it is usually curated out for this target unless the user wants to emphasize budget stewardship or security-operations efficiency.

Curation can also invert by audience, and the Army material shows the cleanest case. For Maria's healthcare-sector target, her rank is correctly translated into civilian scope: "led a 6-person cyber operations team." For a federal or defense-contractor target, the calculus reverses: rank and MOS are expected, and omitting them reads as concealment, not brevity. The master holds both tellings as narrative variants on the same achievement:

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

The same fact is noise for one audience and mandatory for another. A resume can only hold one telling; the master holds both, and curation chooses. The file also records a caution against letting any draft imply Maria held leadership rank throughout her service: she was junior enlisted from 2010 to 2014, and anyone who served reads rank against time instantly. The progression must support the verb.

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

The headline changes, but the evidence does not. A curator can choose the healthcare version for a hospital CISO role and the federal version for a defense contractor without inventing new claims.

## 6. Export Produces Files

Once curation has selected the right material, whatever tool Maria uses can produce the files she needs, typically a resume and cover letter for the target role.
Maria still needs to proofread and edit those documents carefully; once she sends them, she owns every word.

## 7. Updates Flow Back

After the output is drafted, the useful closing question is not just "does this resume look good?" It is:

> What did we learn that should be saved for next time?

Examples:

- a correction becomes a `caution`;
- a missing metric becomes an `openQuestions` item;
- a new story becomes a private reflection;
- a polished audience-specific bullet point becomes a `narrativeVariant`;
- a confirmed claim becomes a canonical achievement update.

That feedback loop is why OCF gets more useful after each session.

## 8. Session Two Reuses And Improves The Memory

Six months later, Maria can bring the OCF to a different conversation:

> **Maria:** I am applying for a VP Security role. Use my OCF and help me prepare for the interview.
>
> **LLM:** Your resume alone would show SOC buildout and ransomware response. Your OCF adds a useful leadership pattern: you rebuild authority from demonstrated work rather than inherited position. For a VP interview, I would use that carefully as a military-to-civilian leadership answer, not as a resume bullet point.
>
> **LLM draft answer:** "The biggest adjustment after the Army was learning that civilian authority starts from evidence, not rank. At Meridian, I learned that the hard way when a weekend coverage request got a flat no. I took the worst rotations first, wrote clean handoffs, and let the team see the standard before I asked them to share it. That became part of how we built 24/7 SOC coverage: not just a staffing plan, but a credibility plan."

That paragraph could not come from the source resume alone. It needs the resume fact, the preserved story, and the confirmed through-line. This second session is also a good time to capture fresh items and stories from Maria's current role before they fade into old resume shorthand. That is the compounding value claim: each reviewed session gives the next session better memory to work with.
