# Sample Resume Example Set

This example set is fictional. Maria E. Reyes is not a real person, and the organizations, incidents, conversations, and source artifacts are invented to demonstrate how OCF can preserve career memory beyond a single resume.

## Files

- `sample-resume-source.txt` is the short source resume. It is intentionally ordinary: headline, contact information, skills, experience, education, and certifications.
- `sample-resume.ocf.json` is the richer candidate-owned master OCF built from that source resume and later review conversations.

## Why the OCF Is Richer Than the Resume

The source resume has a compressed bullet: "Led response to a ransomware incident and restored critical clinical systems within 41 hours with zero patient-care impact."

The OCF keeps that public-facing claim, but also records the private and review-oriented material around it:

- a longer story with stakes, decision context, and lessons learned
- structured metrics for restore time, patient-care impact, and ransom paid
- provenance showing that the story was expanded during a later CISO-track refinement conversation
- narrative variants for public resume use, healthcare-security positioning, and private interview prep
- an open question about whether to name the affected clinical system or keep the description generic

This is the core OCF pattern: the resume preserves the claim; the master OCF preserves the memory, evidence, caveats, and alternate ways to use the claim.

## Example History

This sample is meant to read as if it evolved over several passes:

1. **2026-05-20: source resume captured.** The short resume in `sample-resume-source.txt` is recorded as a private `sourceArtifact`.
2. **2026-05-21: CISO-track refinement conversation.** A fictional LLM-assisted review expands the ransomware bullet into a structured achievement, private reflections, cautions, and narrative variants.
3. **2026-05-21: caution capture.** The same review pass records positioning corrections, such as not overstating Big Four consulting experience or AI/ML security specialization.
4. **2026-05-24: coaching review.** A later review adds open questions about military-to-civilian leadership translation and attribution precision for the SOC buildout.

The dates are illustrative, but the pattern is intentional: an OCF can start from an old resume, then improve through review, coaching, LLM conversations, and user-approved updates.

## What To Notice

- `sourceArtifacts` shows where source material came from without embedding every raw artifact.
- `provenance` explains whether a fact was authored, imported, interview-derived, curated, or suggested later.
- `visibility` keeps private context separate from public claims.
- `narrativeVariants` preserve alternate wording without changing the canonical achievement.
- `cautions` prevent future tools from repeating claims the subject does not want made.
- `openQuestions` keeps useful follow-up work alive across sessions.
- `attribution` prompts cleaner distinctions between owned, led, drove, contributed to, and delegated work.

The example is not meant to be the only way to write an OCF. It is meant to show why a master career file can be more useful than a resume alone.
