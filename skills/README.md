# OCF Skills

Skills are packaged agent workflows for Open Career Format. They sit beside the schema and prompts; they are not part of the schema.

Use a skill when an agent environment supports reusable skill folders, such as Codex, Claude Code, Cursor, or similar tools. Use the prompts directly when a plain chat window is the only available interface.

Skills and prompts use the same OCF guidance. The prompt works anywhere you can paste text. The skill adds local file management: where the master lives, where backups go, where sources are stored, and where each application's outputs belong. All still under your control, and fully open and readable.

OCF is not hiding changes behind the website. Git history shows what changed and when. Use the latest skills unless you intentionally need historical behavior from Git history. Schema versions are separate: use the latest schema unless you need to pin a specific version.

[`manifest.json`](manifest.json) records the canonical path, update date, and SHA-256 hash for each published skill. OCF Start may use it to notice that an installed copy is behind, but updates remain user-approved and never happen silently.

The hash detects whether an installed copy differs from the canonical published file. It does not independently authenticate the OCF website or repository.

## Current Skills

- [`ocf-start`](ocf-start/SKILL.md): front-door router for deciding what the user has, what they are trying to do, and which OCF workflow to use next.
- [`ocf-setup`](ocf-setup/SKILL.md): create or reuse a local career/job-search folder, separate the private OCF master from sources, backups, and outputs, and prepare the workspace for later OCF workflows.
- [`ocf-export-career-ops`](ocf-export-career-ops/SKILL.md): create or update a Career-Ops workspace from an OCF file, including broad CV source files and transient job-search overlay settings that should not usually be stored in OCF.

The skills intentionally stay dependency-free. They tell the agent what to read, ask, produce, validate, and save, but they do not require a local app or install step.
