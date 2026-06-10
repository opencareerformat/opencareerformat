# Worked Example Walkthrough

This walkthrough explains the lifecycle behind the fictional Maria E. Reyes example files. It is not a new schema requirement; it is a concrete way to read the examples as a small OCF workflow.

Files:

- `sample-resume-source.txt`: the source resume.
- `sample-resume.ocf.json`: the enriched OCF file.
- `sample-resume.md`: notes on the fictional review history.
- `sample-job-description.txt`: a fictional target job description for curation.

## 1. Source Resume Captured

The starting point is an ordinary short resume. In OCF terms, the resume is not the master truth. It is a `sourceArtifact`.

The importer or LLM should:

- record the resume as a `sourceArtifacts` entry;
- extract person, education, certifications, skills, experience, positions, and achievements;
- preserve useful wording from the resume;
- assign provenance to imported items;
- avoid inventing missing metrics, dates, supervisors, or outcomes.

At this point the file is best understood as an `imported-starter`, even if the example file later shows the richer candidate-master shape.

## 2. Intake Turns Bullets Into Career Memory

An OCF-oriented intake pass does more than rewrite resume bullets. It asks what each bullet means and whether it should become:

- a canonical achievement;
- structured metrics;
- supporting facts;
- a private reflection;
- a caution;
- an open question;
- a narrative variant for a particular audience.

The ransomware response story in `sample-resume.ocf.json` shows this pattern. The same underlying career event appears as:

- a structured achievement;
- supporting facts and metrics;
- private reflection material;
- cautions about overclaiming;
- narrative variants for different audiences.

That is the core OCF loop: preserve the facts once, then let future curation choose the right wording.

### The Story Ask Preserves What Resumes Usually Lose

A first-session OCF workflow should also ask for one story about the person's work that they would never put on a formal resume. The point is not to force the story into a bullet immediately. The point is to preserve career memory in the subject's own words, then look for an earned pattern only if the evidence supports it.

In the Maria example, the military-to-civilian leadership gap is a good place to do this. The resume proves Army cyber leadership and later healthcare security leadership, but it does not explain how Maria translated authority across those worlds.

Maria's story, preserved verbatim:

> My first month at Meridian, I asked an analyst to cover a weekend shift and he just said no. In the Army I never heard "no" to a lawful tasking — rank did the asking for me. I'd been a civilian five years by then — but as an analyst, then a consultant. Meridian was the first time since the Army I had people to task. I sat in my car in the parking garage for a while after that one. What I eventually understood is that nobody in that building had ever watched me earn anything. My rank walked in before I did, and out here it didn't mean a thing. So I stopped asking for anything I hadn't done first. I took the worst on-call rotations for two months and wrote up every handoff like it mattered, because it did. By the time we staffed the overnight shift, I had a waiting list to get on my team. The Army would have called that bad delegation. I call it the only thing that worked.

An LLM should not polish that into case-study prose. The parking garage and "the only thing that worked" are the evidence. The unpolished texture teaches future tools what the transition actually felt like and how Maria explains it.

After preserving the story, the tool can offer an earned through-line only if it can cite independent evidence. For example:

> Does this ring true — you rebuild authority from demonstrated work rather than inherited position? It's in this story, and it's how the SOC got built: 24/7 coverage in six months, staffed by people who'd watched you take the first shifts yourself.

If Maria confirms it, the raw story stays as a private reflection, and the confirmed through-line can be saved as an incubating talking point under a root extension namespace until OCF has a first-class `talkingPoints` field. The existing military-to-civilian open question should also be updated: the file now has story-backed material, but it may still need additional examples about coaching, performance management, or hard staffing decisions.

The example also exposes a v0.3 schema pressure: the talking point can cite the SOC-buildout achievement by ID, but the raw reflection does not have a stable ID in v0.2. The extension therefore uses a descriptive path for the reflection. That is workable for a sample, but brittle for tooling; future OCF versions should consider IDs on reflections and other story-bearing items.

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

## 6. Export Produces Files

The exporter turns export-ready content into a file or paste-ready artifact:

- resume;
- cover letter;
- PDF;
- DOCX;
- HTML;
- LinkedIn-shaped paste bundle;
- JSON Resume;
- LER input;
- interview-prep packet.

The exporter should not decide which career claims belong. That judgment belongs to curation.

## 7. Updates Flow Back

After the output is drafted, the useful closing question is not just "does this resume look good?" It is:

> What did we learn that should be saved for next time?

Examples:

- a correction becomes a `caution`;
- a missing metric becomes an `openQuestions` item;
- a new story becomes a private reflection;
- a polished audience-specific bullet becomes a `narrativeVariant`;
- a confirmed claim becomes a canonical achievement update.

That feedback loop is why OCF gets more useful after each session.

## Minimal First-Time Flow

If a user has no OCF and only provides a resume and job description, a practical LLM flow is:

1. Ask briefly whether they already have an OCF.
2. Treat the resume and job description as source artifacts.
3. Build a provisional imported-starter view.
4. Ask the few questions that affect this target.
5. Produce the requested resume and cover letter.
6. Suggest the OCF updates worth saving.

That is enough. The user does not need to finish a complete master before getting value.
