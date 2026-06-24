---
name: ocf-start
description: Use as the front door for Open Career Format when the user is not sure where to begin, has mixed career materials, asks how to use OCF, wants help with a job search, or needs routing between setup, resume import, first application, curation, coaching, export, or translation workflows.
---

# OCF Start

Status: current  
Last updated: 2026-06-21  
Compatible schema versions: OCF 0.3

Route the user to the right Open Career Format workflow. Do not assume they know which prompt, skill, schema file, or tool they need.

Start by answering two questions:

1. What does the user have?
2. What is the user trying to do?

Ask only the minimum needed to route. If the answer is already clear from the user's request and attached files, proceed.

Do not infer file names, file types, company names, target employers, or role details unless they are visible in the user's message, attached files, or filesystem context you have actually inspected. If the user describes materials but has not provided or attached them, ask for the files or pasted text before doing content analysis.

## First Questions

When unclear, ask:

> What do you already have: an OCF file, a current resume, old resumes, a LinkedIn/profile export, a job description, notes, or none of those?

Then ask:

> What are you trying to do right now: apply to a specific job, organize your career history, update an existing OCF, create a targeted resume or cover letter, prepare for an interview, think through a career change, translate/localize materials, or something else?

If working in a local agent environment, always establish the workspace before any file-writing workflow unless it is already known. Ask whether the user already has a resume, career, or job-search folder. Use `ocf-setup` when folders or local files matter. If `~/.ocf-home` exists, read it as a pointer to the user's preferred OCF workspace, but confirm before using it.

## Routing

Use this routing table:

| Situation | Route |
| --- | --- |
| User wants local folder organization, does not know where files should live, or is starting a job-search folder | Use `ocf-setup`. |
| User has resume/profile material plus a job description and wants help applying now | Use the canonical bootstrap prompt at `prompts/application-bootstrap.md`; use `ocf-setup` first when local files or outputs matter. |
| User has old resumes, LinkedIn exports, notes, or pasted history and wants to build a master | Use `prompts/authoring.md`. |
| User has an existing OCF and a target job, role, audience, or output | Use `prompts/curation.md`. |
| User has an existing OCF and wants a resume, cover letter, profile, or interview-prep packet | Use `prompts/curation.md`; treat export formatting as downstream of curation. |
| User is thinking about a new career, unclear goals, story, voice, boundaries, or what they want next | Use `prompts/coaching.md`. |
| User wants a plain first session in a chat-only environment | Use `prompts/application-bootstrap.md` directly. |
| User wants language/localization guidance | Use `spec/language-and-translation.md`; keep schema keys and enum values canonical. |
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

## Final Response Checklist

Before handing off to a routed workflow, state:

- what the user appears to have;
- what the user appears to be trying to do;
- which OCF workflow you are using next;
- whether local setup is needed first.
