---
ocfPrompt: interview-prep-questions
status: current
lastUpdated: 2026-06-12
compatibleSchemaVersions:
  - "0.3"
defaultFor:
  - reflections
  - interview-prep
---

# Recommended Interview-Prep Question Set

This file holds the OCF community's recommended question set for tools that help a user fill in *reflections* — open-ended, often subjective answers about each role and company that are useful for interview preparation but not appropriate for resumes.

This document is **not** part of the OCF schema. Tools may use these questions verbatim, adapt them, or invent their own. The point is that the canonical `kind` strings stay consistent across tools, so a user's reflections are portable. If a tool introduces a new reflection kind, it should use a clear, lowercase-hyphenated string and ideally contribute it back to this document.

Reflections default to `visibility: private` and should not appear in curated OCFs, export-ready OCFs, or rendered outputs without explicit user permission.

## Why these questions

The Topgrading interview methodology (Smart, *Who: The A Method for Hiring*, 2008) popularized a structured set of questions that hiring managers ask about every role on a candidate's resume. Whether or not the candidate's interviewer follows Topgrading literally, the *questions* surface answers candidates often haven't thought through — and answering them once, into a master file, dramatically improves interview readiness for any subsequent role.

The questions also surface achievement material that resumes typically miss. "What are you proudest of?" frequently elicits a story that the user never wrote down because they didn't think it counted. A conversational tool that captures the reflection in raw form, and then proposes a structured achievement entry distilled from it, builds the master file over time.

## Per-position questions

Tools should ask these for each `position` in the master file. Each answer is stored as a `reflection` on that position, with the corresponding `kind`.

| Question | Recommended `kind` | Answer type |
|---|---|---|
| Who was your direct supervisor? | (covered by `position.supervisor`) | structured field, not a reflection |
| On a 1–10 scale, how would your supervisor rate you? | `boss-would-rate-1-10` | `value` (number) |
| On a 1–10 scale, how would you rate your supervisor? | `would-rate-boss-1-10` | `value` (number) |
| What did you like most about this role? | `liked-most` | `text` |
| What did you like least about this role? | `liked-least` | `text` |
| How large was your team? | (covered by `position.teamSize` / `directReports`) | structured fields |
| What was your biggest success? | `biggest-success` | `text` |
| What was your biggest mistake or failure? | `biggest-mistake` | `text` |
| What was your biggest lesson? | `biggest-lesson` | `text` |
| What are you proudest of? | `proudest-of` | `text` |
| What is one story about your work that you would never put on a formal resume? | `never-on-resume-story` | `text` |
| What would you have done differently? | `would-do-differently` | `text` |
| Why did you take this role? | `why-took-role` | `text` |
| Why did you leave this role? (position-to-position move within same company) | `why-left-position` | `text` |

For the supervisor question, tools should capture enough structured data to make the later rating question meaningful: name, title when known, and useful contact/profile details. A LinkedIn URL is often the safest durable identifier because phone numbers and work emails go stale when people change companies. Store contact methods as `positions[].supervisor.contacts[]` items with explicit `kind` and `visibility`; do not use scalar supervisor contact fields. Supervisor data defaults to private.

Long careers make this question less simple than it sounds. "I worked for X" might mean direct manager in one period, skip-level leader in another, client sponsor on a consulting engagement, commanding officer, principal investigator, or executive several layers above the role. OCF intentionally does not model a full people graph. Use `position.supervisor` for the most relevant person for the role and preserve nuance in private reflection text or notes when it matters for interview prep.

## Per-experience-entry questions

These are asked at the company / experience-entry level rather than per role. They live as `reflection` entries on the `experienceEntry`.

| Question | Recommended `kind` | Answer type |
|---|---|---|
| Why did you leave this company? | `why-left` | `text` |
| What was the company's biggest strength? | `company-strength` | `text` |
| What was the company's biggest weakness? | `company-weakness` | `text` |
| What's your overall takeaway from working there? | `overall-takeaway` | `text` |
| Would you work there again? | `would-work-again` | `text` or `value` (1–10) |

## Conversational pattern

A tool that uses these questions to elicit reflections should follow the pattern described in `prompts/llm-operating.md`:

1. **Surface gaps proactively.** When a user opens their OCF and a position has no reflections, the tool can offer to ask the standard set. Users who don't want to fill them in skip the prompt; users who do get a structured conversation.
2. **Capture answers in the user's voice.** Store reflections as the user said them. Don't sanitize or normalize the prose. The texture matters for interview prep.
3. **Look for distillable achievements.** When a reflection — especially `biggest-success`, `proudest-of`, or `biggest-lesson` — contains a story that should also exist as a structured achievement, propose adding the achievement, with provenance linking it to the originating reflection. Keep the reflection in place; the achievement is the structured claim, the reflection is the raw voice.
   Exception: `never-on-resume-story` reflections are preserved verbatim and are not distillation fodder — the pattern there is an earned through-line offered as a hypothesis, not a resume bullet (see the application bootstrap).
4. **Respect privacy defaults.** Reflections are `private` by default. Don't surface them in any externally-facing output without the user explicitly opting that reflection up to `shared` or `public`.

## Adding new kinds

When a tool needs to elicit a kind that isn't in this list, it should use a clear lowercase-hyphenated `kind` string and add the new kind back to this document via a pull request. Conventions emerge from tools; the schema imposes no fixed list, but tools converge on shared kinds so reflections stay portable.
