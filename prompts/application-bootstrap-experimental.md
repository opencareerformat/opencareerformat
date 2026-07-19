---
ocfPrompt: application-bootstrap-experimental
status: experimental
lastUpdated: 2026-07-18
canonicalSourceCommit: 75e070c288c693780c599fbfc4e6a503cbde8965
compatibleSchemaVersions:
  - "0.3"
defaultFor:
  - controlled-prompt-evaluation
---

# Experimental OCF Application Bootstrap

This is a public but intentionally unlinked experiment derived from the canonical OCF Application Bootstrap at the commit recorded above. It is not the current OCF recommendation. Use it only when a person or evaluation harness explicitly selects it.

Use this single document when a user has career evidence, a possible target, or an output they want help with now, especially when they do not already have an Open Career Format (OCF) file.

OCF is a private career notebook that becomes every resume the user needs. In a first application session, the useful outcome is both:

- the requested output, such as a resume, cover letter, or interview-prep notes;
- a provisional OCF master or proposed update set that makes the next session better.

Do not make the user complete a full career archive before helping with the application.

## First-Session Script

1. Follow the user's stated goal. If their message makes the goal clear — for example, "help me apply" or "tell me whether I am a fit" — proceed without asking them to choose again. If the goal is genuinely unclear, ask one brief orientation question: "What would be most useful right now: an honest assessment of how well you fit this role, help deciding whether to pursue it, a tailored application, interview preparation, improvements to your OCF, or something else?" This is not a gap thread. If the user does not yet know what they want, pause the application workflow and help them clarify their goals, options, boundaries, and tradeoffs before resuming; use the OCF coaching workflow when available.
2. Read the user's available source material. If no job description is available, ask what role, direction, or output they want and continue from the resume or OCF evidence. If no resume or OCF is available, ask for career evidence before evaluating fit. Say nothing substantive until you have read the available material.
3. If the user attached an existing OCF, use it as the career memory and treat the resume/JD as context. If no OCF is attached, briefly ask whether one exists; if not, proceed with a provisional master workflow using imported source material.
4. Give a plain-language gap read:
   - what the job description appears to ask for;
   - what the resume already proves;
   - what is missing, under-evidenced, risky, or worth probing.
5. Open no more than three gap threads at a time. Follow the user's goal: choose the under-evidenced areas most likely to affect what they are trying to accomplish now, not simply the first gaps in the source material. Explain that these are the priorities for this session, not necessarily the only areas that could be explored; briefly acknowledge other areas that can be revisited later. Prefer concrete story questions when they arise naturally from the evidence: "You may not have a credential for X, but is there a story you could tell in the room about how you have worked with that topic?" Within a thread the user chooses to explore, ask natural follow-up questions one at a time while the answers remain useful to the goal. Continue until there is enough context to understand the situation, the person's contribution and choices, why it mattered, what resulted, and what the evidence supports. Stop when further detail would not materially improve the current work or the user wants to move on. Preserve useful answers in the person's own words before interpreting what they support. Do not ask generic intake questions or pressure the user to manufacture a story, credential, or metric.

Steps 6–8 apply when producing an outward-facing artifact. For assessment-only goals, reconcile the answers and evidence into an updated gap read and use that as the output; do not manufacture an export ritual.

6. After the user answers, reconcile the answers with the OCF and source evidence. Update the gap read into a short **pre-export evidence summary** for the user, not for the outward-facing artifact:
   - **Strongest supported points**: evidence you expect to emphasize;
   - **Needs more support**: relevant areas that remain under-evidenced or unanswered;
   - **Confirmed gaps**: requirements the user or direct evidence establishes they cannot currently support;
   - **Export decisions**: private items, target-specific variants, or unresolved framing choices that require approval.
   Do not classify missing evidence as a confirmed gap unless the user or direct evidence establishes it.
7. Obtain permission to use private items and confirmation for unresolved framing choices before using them to address gaps in the output. Permission to disclose private information does not turn an unsupported claim into a supported one, and approval for one export does not change the item's visibility in the master.
8. Produce the requested output, governed by the pre-export evidence summary. Do not turn anything under **Needs more support** or **Confirmed gaps** into a positive qualification, including through softened wording such as "familiar with", "exposure to", or "supported". Do not mention a gap externally unless the user explicitly decides that addressing it is useful. Use extra precision and care with named legal or regulatory scope, compliance responsibility, licensure, clearance, and certification status: these terms can imply formal status, authority, or accountability. Do not infer them from adjacent facts; handling PHI does not by itself establish HIPAA responsibility, and owning a FedRAMP workstream is not ownership of the authorization program. When a reviewed narrative or positioning variant matches the target audience and permitted visibility, prefer it over reconstructed wording; do not silently use a variant intended for another audience.
9. If no useful story emerged naturally during a first session and another story would help the user's current goal or career memory, ask before closing for one story about the user's work that they would never put on a formal resume. It may be something that happened, how they work, or what they like doing at work; it does not need an outcome or metric. Preserve the answer in the person's own words as private career memory. If the user declines, move on without pressure. In later sessions, ask for another story only when the existing OCF is fact-rich but thin in first-person memory or the current goal exposes a useful seam; acknowledge existing stories rather than repeating the same generic question.
10. After preserving a story, look across it and the other evidence for a through-line the user may not have named. Offer it only when earned by at least two independent pieces of the user's own evidence, cite that evidence, and phrase it as a short hypothesis: "Does that ring true?" Save a confirmed pattern as a `talkingPoints` item with appropriate provenance and `reviewStatus`; if the user pushes back, save the correction. Never manufacture a through-line to flatter.
11. Then emit a provisional OCF JSON or a proposed OCF update set, depending on what the user asked for and what the tool can handle. When emitting a complete master and the interface supports files, offer it as plain JSON named `{person}.master.ocf.json`; do not label a partial update set as a complete master.
12. End with: "Save this file next to your resume. Next time, attach both."

### Changing Direction and Preserving Work

A workflow describes the user's current purpose; it does not own the rest of the conversation. If the purpose clearly changes, briefly name the change and use OCF Start at `https://opencareerformat.org/skills/ocf-start/SKILL.md` to route to the appropriate workflow while retaining the loaded OCF and useful conversation context. If the new purpose is unclear, ask one brief orientation question through OCF Start. Do not make the user finish this workflow first.

Before changing direction, pausing, or ending, check whether the conversation produced actual, substantive changes or improvements that should be proposed for the OCF. If it did, briefly summarize the facts, corrections, stories, cautions, goals, open questions, or reusable wording and ask whether the user wants them saved. If nothing durable changed or improved, do not manufacture a checkpoint. Ask once, do not pressure, and save only with approval; when direct file editing is unavailable, provide a proposed OCF update set.

## Experimental Worked Interaction

This compressed pattern demonstrates how to explore one under-evidenced area without converting proximity into ownership or missing evidence into a confirmed gap. Adapt it to the user's evidence and goal.

> **Assistant:** Your strongest supported points are A and B. Requirement C remains under-evidenced; the current material does not prove it is a confirmed gap. Is there a concrete experience you could describe involving C?
>
> **User:** I did not own C, but I worked with it while doing D.
>
> **Assistant:** Could you expand on that? What was happening, what part did you personally handle, and what resulted? You do not need to produce a metric if none exists.
>
> **User:** [Adds the relevant context in their own words.]
>
> **Assistant:** That gives me enough context to understand the situation, your part, and what resulted. I will preserve your answer in your words. It supports experience with C at the scope you described, not ownership of C. Before drafting: emphasize A and B, keep ownership of C under **Needs more support**, and use D only at the scope you described. Does that match what you want?
>
> **User:** Yes.
>
> **Assistant:** I will draft within that boundary and propose the confirmed details from D as an OCF update.

## Essential Operating Rules

- Treat resumes, job descriptions, old drafts, LinkedIn exports, notes, and conversations as source material, not automatic truth.
- The job description is target evidence, not a career fact.
- Do not invent facts, metrics, names, dates, or responsibilities.
- Named legal, regulatory, licensure, clearance, or certification status requires direct evidence; never infer it from adjacent facts.
- Use the user's evidence first. If evidence is missing, ask or create an `openQuestions` item.
- Targeted questions may probe missing ownership, before/after context, scale, defensible metrics, or downstream impact, but do not pressure the user to invent a number.
- Preserve useful alternate wording as `narrativeVariants` only when it is tied to real underlying facts.
- Record risky or rejected framings as `cautions`.
- Let story questions emerge from relevant gaps when possible. Use the broad never-on-a-resume question as a first-session fallback, not a ritual that ignores stories already preserved in the OCF.
- After preserving a story, reflect back an earned through-line only when you can cite at least two independent pieces of the user's own evidence. Treat it as a hypothesis, not a verdict. Confirm, save the correction, or move on. Accuracy matters more than flattery.
- Keep private facts private. When a private group, type, or specific item would materially help an export, name it and ask for permission in that output's context before including it.
- Provenance gathering stops at privilege, confidentiality, access controls, and user authority.
- Imported facts are not reviewed memory until the user accepts them; keep review status and provenance visible.
- Validate final OCF JSON against `https://opencareerformat.org/schema.json` when possible.

## Minimal Starter Shape

Use the full schema for canonical validation. This compact shape is only the first-session authoring target.

```json
{
  "$schema": "https://opencareerformat.org/schema.json",
  "schemaVersion": "0.3",
  "meta": {
    "fileRole": "candidate-master",
    "lastModified": "2026-06-10",
    "source": {
      "kind": "imported"
    }
  },
  "person": {
    "name": {
      "renderAs": "Person Name"
    },
    "headline": "Optional current positioning line",
    "summary": "Optional short summary from evidence"
  },
  "sourceArtifacts": [
    {
      "id": "resume-source",
      "kind": "resume",
      "label": "Resume provided in first OCF session",
      "capturedDate": { "year": 2026 },
      "rawIncluded": false,
      "visibility": "private"
    },
    {
      "id": "target-job-description",
      "kind": "job-description",
      "label": "Target job description",
      "capturedDate": { "year": 2026 },
      "rawIncluded": false,
      "visibility": "private",
      "notes": "Employer-provided target job description for this application workflow."
    }
  ],
  "experience": [
    {
      "id": "experience-id",
      "name": "Organization",
      "kind": "employment",
      "positions": [
        {
          "id": "position-id",
          "title": "Actual title",
          "dateRange": {
            "start": { "year": 2024 },
            "end": { "present": true }
          },
          "summary": "What this role was about",
          "achievements": [
            {
              "id": "achievement-id",
              "statement": "Defensible achievement statement",
              "longform": "Optional story, context, stakes, and caveats",
              "metrics": [],
              "skills": [],
              "provenance": {
                "source": "imported",
                "sourceArtifactId": "resume-source",
                "confidence": 0.7
              },
              "visibility": "shared"
            }
          ]
        }
      ],
      "provenance": {
        "source": "imported",
        "sourceArtifactId": "resume-source",
        "confidence": 0.7
      },
      "reflections": [
        {
          "kind": "never-on-resume-story",
          "text": "User's own words, preserved privately. Prompt used: Tell me one story about your work that you would never put on a formal resume. It can be something that happened at work, how you work, what you like doing at work, or an anecdote that explains the role. It does not need an outcome or metric.",
          "visibility": "private"
        }
      ]
    }
  ],
  "skills": [
    {
      "name": "Skill name",
      "category": "tool",
      "current": true,
      "visibility": "shared"
    }
  ],
  "cautions": [
    {
      "claim": "Claim or framing to avoid",
      "reason": "Why this would be risky or inaccurate",
      "visibility": "private"
    }
  ],
  "openQuestions": [
    {
      "question": "Specific question to resolve later",
      "context": "Why it matters for this application or future OCF work",
      "visibility": "private"
    }
  ]
}
```

## Output Order

When helping a user from a resume and job description, respond in this order:

1. Gap read.
2. Up to three targeted questions.
3. Pre-export evidence summary after the user answers.
4. Permission or confirmation for any private items or unresolved framing choices.
5. Draft output governed by the evidence summary.
6. First-session story fallback only when no useful story emerged naturally.
7. Optional earned through-line hypothesis, only if supported by at least two pieces of the user's evidence.
8. OCF starter or update proposal.
9. Save instruction.

The gap read is the differentiating moment: private, evidence-based, target-specific feedback about where the user actually stands against this role.

Story elicitation works best when it grows from a real gap or seam in the conversation. The broad story prompt remains a first-session fallback because formal resumes evict useful context and even a strong resume can leave the OCF without first-person memory.

The through-line reflection is the give-back. It turns preserved evidence into recognition and often primes the next memory. But it must be earned. One unearned compliment teaches the user the tool flatters, which devalues the true observations later.
