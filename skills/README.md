# OCF Skills

This page focuses on using reusable skills in an agent environment rather than copying prompts into a plain chat window. Skills are packaged agent workflows for Open Career Format. They sit beside the schema and prompts; they are not part of the schema. Skills and prompts use the same underlying OCF guidance.

Skills add local file management: where the master lives, where backups go, where sources are stored, and where each application's outputs belong. All still under your control, and fully open and readable.

Published skills use the latest guidance. Earlier versions and changes remain available in Git history. Schema versions are separate: use the latest schema unless you need to pin a specific version.

## Install OCF Skills

For ordinary local OCF use, install the complete OCF Start folder—[`SKILL.md`](ocf-start/SKILL.md) together with its bundled [`references/local-setup.md`](ocf-start/references/local-setup.md)—then begin with OCF Start.

OCF Start works out what you have and what you are trying to do, then routes the agent to the appropriate OCF workflow. Its package includes local setup guidance for creating or reusing a private home for the OCF master, source material, backups, and outputs. The agent loads that guidance only when setup is needed. You normally reuse the workspace afterward, returning to setup only when you want to choose a different workspace, repair its organization, or change where OCF files live.

Skill installation differs by agent environment and may change as those products evolve. Follow the current official instructions for your environment:

- [ChatGPT and Codex skills](https://developers.openai.com/codex/skills)
- [Claude Code skills](https://docs.anthropic.com/en/docs/claude-code/skills)

If your environment does not support reusable skills, use the [application bootstrap prompt](../prompts/application-bootstrap.md) directly. It requires no skill installation.

## Core Skill

[`ocf-start`](ocf-start/SKILL.md) is the skill to install and invoke. It decides which OCF workflow is needed and includes [local setup](ocf-start/references/local-setup.md) as bundled guidance.

The core skill intentionally stays dependency-free. It tells the agent what to read, ask, produce, validate, and save, but it does not require a local app.

## Optional Integration

[`ocf-export-career-ops`](ocf-export-career-ops/SKILL.md) is only for people who use Career-Ops, a separate local job-search workspace for evaluating opportunities, producing application materials, and managing the operational side of a search. Prefer the installed OCF connector for ongoing projection and refresh. This OCF-side skill is a one-way bootstrap fallback that exports reviewed OCF career information into new Career-Ops files. You do not need it for ordinary OCF use.

## Version Control

[`manifest.json`](manifest.json) records the canonical paths, update date, and SHA-256 hashes for each published skill package. OCF Start may use it to notice that an installed package is behind or incomplete, but updates remain user-approved and never happen silently.

The hashes detect whether installed package files differ from the canonical published files. They do not independently authenticate the OCF website or repository.
