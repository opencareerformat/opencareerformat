# OCF Skills

Skills are packaged agent workflows for Open Career Format. They sit beside the schema and prompts; they are not part of the schema.

Use a skill when an agent environment supports reusable skill folders, such as Codex, Claude Code, Cursor, or similar tools. Use the prompts directly when a plain chat window is the only available interface.

Skills and prompts use the same OCF guidance. The prompt works anywhere you can paste text. The skill adds local file management: where the master lives, where backups go, where sources are stored, and where each application's outputs belong. All still under your control, and fully open and readable.

OCF is not hiding changes behind the website. Git history shows what changed and when. Use the latest skills unless you intentionally need historical behavior from Git history. Schema versions are separate: use the latest schema unless you need to pin a specific version.

## Current Skills

- [`ocf-start`](ocf-start/SKILL.md): front-door router for deciding what the user has, what they are trying to do, and which OCF workflow to use next.
- [`ocf-setup`](ocf-setup/SKILL.md): create or reuse a local career/job-search folder, separate the private OCF master from sources, backups, and outputs, and prepare the workspace for later OCF workflows.

The skill intentionally stays dependency-free. It tells the agent what to read, ask, produce, validate, and save, but it does not require a local app or install step.
