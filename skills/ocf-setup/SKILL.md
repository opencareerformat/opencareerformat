---
name: ocf-setup
description: Use when a user wants to start using Open Career Format locally, organize resume/job-search files, create or locate an OCF master, establish backups, or prepare a folder structure before running OCF application, curation, import, or export workflows.
---

# OCF Setup

Status: current  
Last updated: 2026-06-21  
Compatible schema versions: OCF 0.3

Create a simple local home for Open Career Format work. Do not start by editing the user's career content. First make the workspace understandable, private by default, and hard to confuse with files that get sent out.

OCF is a file format, not a platform. The user owns the files. The setup workflow should help them keep the durable career memory separate from source materials, backups, and application outputs.

## First Question

Ask:

> Do you already have a resume, career, or job-search folder you want me to use?

If `~/.ocf-home` exists, read it first and say what folder it points to. Ask whether to use that folder. If it points to a missing folder, ask whether to create that folder or choose a different one.

If the user names a folder, inspect it lightly before proposing changes. If they do not have one, propose creating a new local folder.

Do not move, rename, delete, or overwrite existing files without explicit confirmation.

## Default Structure

Recommend this simple structure unless the user already has a strong convention:

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
      resume.md
      cover-letter.md
      candidate-curated.ocf.json
      ocf-review-notes.md
```

Explain the model briefly:

- `ocf/{person}.master.ocf.json` is the private durable career memory.
- `ocf/backups/` holds dated safety copies before meaningful edits.
- `sources/` holds evidence: resumes, LinkedIn exports, job descriptions, notes, transcripts, and other inputs.
- `outputs/` holds files prepared for a specific application, audience, or export.

## Setup Workflow

1. Ask whether the user already has a folder to use.
2. If a folder exists, inspect names and obvious subfolders only. Do not deeply read private files unless needed.
3. Propose a structure using either the existing folder or a new `career/` folder.
4. Ask for confirmation before creating folders or copying files.
5. Locate any existing OCF master. If multiple plausible masters exist, ask which one is authoritative.
6. If no OCF exists, create the folders and leave master creation to the next workflow, such as the application bootstrap prompt, unless the user explicitly asks to create a blank starter.
7. If a master exists, recommend making a dated backup before any workflow edits it.
8. Ask whether to remember the chosen workspace on this machine by writing `~/.ocf-home`.
9. Record any local convention in a short `README.md` inside the chosen folder if the user wants one.

## Remembering The OCF Home

`~/.ocf-home` is an optional local pointer to the user's preferred OCF workspace.

Rules:

- Ask before creating, changing, or using it.
- Store only one absolute path.
- Do not store secrets, settings, personal data, or JSON in it.
- Treat it as a hint, not an unquestioned instruction.
- If it points to a missing folder, ask whether to create that folder, update the pointer, or ignore it.

Example content:

```text
/Users/example/Documents/Career
```

## Backup Rules

Before editing an existing master, copy it to `ocf/backups/` with a dated filename:

```text
{person}.master.2026-06-21.backup.ocf.json
```

Never overwrite a master with a curated, reduced, imported, or export-ready file.

If a workflow produces a complete proposed replacement, save it separately and ask the user before promoting it to master.

## Application Output Folders

For a specific target, create one folder under `outputs/`:

```text
outputs/{company}-{role}-{date}/
```

Use lowercase slugs when practical, such as:

```text
outputs/acme-security-director-2026-06-21/
```

Keep drafts and sent files in that target folder. Do not mix them into `ocf/` next to the master.

## Source Files

Treat source files as evidence, not truth.

Recommended locations:

- resumes and old resumes -> `sources/resumes/`
- LinkedIn/profile exports -> `sources/resumes/` or `sources/notes/`, depending on shape
- job descriptions -> `sources/job-descriptions/`
- interview notes, pasted conversations, review notes -> `sources/notes/`

Ask before copying large, sensitive, or unrelated files.

## Privacy Defaults

Assume the OCF master and backups are private.

Do not suggest syncing or publishing these folders unless the user explicitly asks. If Git is used, remind the user not to commit private masters, backups, resumes, or job descriptions to a public repository unless they have made a deliberate decision.

If the setup lives inside a Git repository, verify that private career folders are ignored before writing private files. If they are not ignored, propose adding an ignore rule before creating private content.

## Integration With Other OCF Skills

Other OCF skills should reuse this folder structure when available.

For application bootstrap workflows:

- read source resume/profile material from `sources/resumes/` when available;
- read or copy the target job description into `sources/job-descriptions/`;
- read the master from `ocf/{person}.master.ocf.json`;
- create a backup before editing the master;
- write application outputs under `outputs/{company}-{role}-{date}/`;
- write proposed master updates to the target output folder when not applying them directly.

## Final Response Checklist

Before finishing, tell the user:

- which folder is the OCF workspace;
- where the master lives or will live;
- where backups go;
- where source files go;
- where application outputs go;
- whether anything was created, copied, or left untouched.
