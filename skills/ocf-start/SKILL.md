---
name: ocf-start
description: Use as the shared router for Open Career Format when the user is not sure where to begin, has mixed career materials, asks how to use OCF, changes direction during a conversation, or needs routing between setup, resume import, first application, curation, profile and bio, coaching, export, or translation workflows.
---

# OCF Start

Status: current  
Last updated: 2026-07-18

Compatible schema versions: OCF 0.3

Route the user to the right Open Career Format workflow at the beginning and whenever their purpose changes. Do not assume they know which prompt, skill, schema file, or tool they need. A routed workflow describes the user's current purpose; it does not own the rest of the conversation.

Start by answering two questions:

1. What does the user have?
2. What is the user trying to do?

Ask only the minimum needed to route. If the answer is already clear from the user's request and attached files, proceed.

Do not infer file names, file types, company names, target employers, or role details unless they are visible in the user's message, attached files, or filesystem context you have actually inspected. If the user describes materials but has not provided or attached them, ask for the files or pasted text before doing content analysis.

## Skill Currency

Near the beginning of a new local-agent session, when network access is available, check once whether this installed skill is behind the canonical skill manifest at `https://opencareerformat.org/skills/manifest.json`. Find the `ocf-start` entry and compare its SHA-256 value with the SHA-256 of this installed `SKILL.md`. When routing to another installed OCF skill, use that skill's manifest entry the same way.

If the hashes differ, use the manifest's `lastUpdated` value and the installed skill's value to explain that the installed copy may be behind, then ask whether the user wants to update before continuing. Never replace local skill files, mix newer instructions into the installed skill, or change behavior silently. Before installing an approved update, retrieve the canonical file named by the manifest and verify that its SHA-256 matches the manifest. If the user declines, continue with the installed skill. If the manifest cannot be reached, a hash cannot be calculated, or the canonical file does not match its manifest hash, continue without blocking the workflow and do not repeatedly warn the user.

## First Questions

When unclear, ask:

> What do you already have: an OCF file, a current resume, old resumes, a LinkedIn/profile export, a job description, notes, or none of those?

Then ask:

> What are you trying to do right now: apply to a specific job, organize your career history, update an existing OCF, create a targeted resume or cover letter, summarize your career for a profile or bio, prepare for an interview, think through a career change, translate/localize materials, or something else?

If working in a local agent environment, always establish the workspace before any file-writing workflow unless it is already known. Ask whether the user already has a resume, career, or job-search folder. Use `ocf-setup` when folders or local files matter. If `~/.ocf-home` exists, read it as a pointer to the user's preferred OCF workspace, but confirm before using it.

## Routing

Use this routing table:

| Situation | Route |
| --- | --- |
| User wants local folder organization, does not know where files should live, or is starting a job-search folder | Use `ocf-setup`. |
| User has resume/profile material plus a job description and wants help applying now | Use `prompts/application-bootstrap.md` (or https://opencareerformat.org/prompts/application-bootstrap.md); use `ocf-setup` first when local files or outputs matter. |
| User has old resumes, LinkedIn exports, notes, or pasted history and wants to build a master | Use `prompts/authoring.md` (or https://opencareerformat.org/prompts/authoring.md). |
| User has an existing OCF and a target job, target role, application audience, or application output | Use `prompts/curation.md` (or https://opencareerformat.org/prompts/curation.md). |
| User has an existing OCF and wants a resume, cover letter, or interview-prep packet | Use `prompts/curation.md` (or https://opencareerformat.org/prompts/curation.md); treat export formatting as downstream of curation. |
| User has an existing OCF and wants a LinkedIn profile, website About page, professional bio, speaker bio, portfolio introduction, or similar career summary | Use `prompts/profile-and-bio.md` (or https://opencareerformat.org/prompts/profile-and-bio.md). |
| User wants to seed, create, or update a Career-Ops workspace from OCF | Use `ocf-export-career-ops`. |
| User is thinking about a new career, unclear goals, story, voice, boundaries, or what they want next | Use `prompts/coaching.md` (or https://opencareerformat.org/prompts/coaching.md). |
| User wants a plain first session in a chat-only environment | Use `prompts/application-bootstrap.md` (or https://opencareerformat.org/prompts/application-bootstrap.md) directly. |
| User wants language/localization guidance | Use `spec/language-and-translation.md` (or https://opencareerformat.org/spec/language-and-translation.md); keep schema keys and enum values canonical. |
| User wants to validate or repair OCF JSON | Use the current schema and local validator when available. |

## Routing Rules

- Do not force setup if the user is in a plain chat window or only wants quick advice.
- Do not force a complete master before helping with a current application.
- Do not infer filenames, file types, employers, roles, or attached content. State only what the user provided or what you inspected.
- Do not treat a resume, LinkedIn export, or job description as the master truth.
- Do not treat the job description as a career fact; it is target evidence.
- If the user has an existing OCF, read cautions, visibility, review status, open questions, positioning variants, and talking points before drafting externally facing content.
- If the user has no OCF, make the first useful workflow produce either a starter master or proposed update notes for next time.
- If private files are involved in a Git repository, verify ignore rules before writing private career data.
- If local file work is likely and the OCF workspace is unknown, ask about setup before routing into a file-writing workflow. Do not say setup is unnecessary; say it is the next local-workflow question.
- Do not create or change `~/.ocf-home` silently. Treat it as an optional convenience pointer, not schema data or application state.

## Changing Direction and Preserving Work

Keep routing active throughout the conversation. When the user's purpose clearly changes, briefly name the change and route to the appropriate workflow while retaining the loaded OCF and useful conversation context. If the change is ambiguous, ask one brief orientation question. Do not make the user finish the current workflow first.

Before changing direction, pausing, or ending, check whether the conversation produced actual, substantive changes or improvements that should be proposed for the OCF. This applies even when no resume, profile, or other export was created. If useful work is unsaved:

1. briefly summarize the facts, corrections, stories, cautions, goals, open questions, or reusable wording;
2. ask whether the user wants those updates saved to the OCF before switching or stopping;
3. ask once and do not pressure;
4. do not invent updates merely to create a checkpoint;
5. save only with approval, backing up a local master before editing it; when direct file editing is unavailable, provide a proposed OCF update set.

If nothing durable changed or improved, or the user wants to continue immediately, route without manufacturing a checkpoint ritual.

## Local Setup Default

When local files matter, prefer this structure from `ocf-setup`:

```text
career/
  ocf/
    {person}.master.ocf.json
    backups/
  sources/
    resumes/
    job-descriptions/
    notes/
  outputs/
    {company}-{role}-{date}/
```

Ask before creating folders or copying files.

Optional local pointer:

```text
~/.ocf-home
```

When present, this file should contain only one absolute path to the user's chosen OCF workspace. Confirm before using it. If it points to a missing folder, ask the user to choose or create a new workspace.

## Routing Checkpoint

At the initial route or after a change in direction, state briefly:

- what the user appears to have;
- what the user appears to be trying to do;
- which OCF workflow you are using next;
- whether local setup is needed first.
