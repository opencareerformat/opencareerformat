# Security Policy

## Reporting a Vulnerability

If you believe you have found a security issue in Open Career Format, please report it privately using GitHub's private vulnerability reporting feature for this repository.

Do not open a public issue for security-sensitive reports.

## Scope

This repository contains:

- the Open Career Format schema and documentation
- example OCF files
- reference importers, curators, exporters, and validation tools

Security reports may include issues such as:

- secret exposure in examples or documentation
- unsafe behavior in reference tools
- dependency vulnerabilities in reference tooling
- guidance that could cause private OCF data to be exposed unexpectedly

## Privacy and Personal Data

OCF files describe a person's career. Like resumes, CVs, LinkedIn exports, application drafts, and career notes, they may contain personal information by design: names, contact details, employers, dates, locations, compensation history, references, supervisors, reflections, and other career context.

The presence of personal information in an OCF file is not, by itself, a security vulnerability. Accidental exposure of data that was meant to remain private may be.

The schema includes visibility fields, provenance, cautions, and curation guidance to help users and tools decide what should stay in a private master file and what can be shared downstream. These are curation signals, not encryption or access control. Protect OCF files using the same care you would use for resumes, tax records, compensation documents, reference lists, and private career notes.

For more detail, see the privacy, visibility, source artifact, and operating-practice sections in the guide.

## Trust Boundaries

OCF files are portable and may cross trust boundaries. A file received from another person, recruiter, employer, agency, or tool should be treated as untrusted input until the controlling user accepts it.

Users choose the privacy boundary appropriate to their files and tools. Some users are comfortable providing a complete OCF master to a hosted commercial LLM under that provider's terms. Others keep the master local and use separate local model contexts or agents so untrusted material, such as a job description, does not share a context with private career memory. OCF does not prescribe one deployment model. Once a complete master and untrusted material share a model context, visibility labels remain curation signals; they do not isolate private data from that model.

Tools that need stronger structural separation can keep the master in an archivist context that does not receive untrusted target material, while a drafting context receives only a user-approved curated projection and the job description. Newly discovered facts can return to the archivist as proposed, user-reviewed updates. This is an optional tool architecture, not an OCF schema requirement. In every model, the user decides what may be shared and reviews outward-facing artifacts.

Free text in an OCF file is descriptive content, not privileged instruction. LLM-based tools must not let `aiInstructions`, `voice`, `cautions`, notes, reflections, source text, or `extensions` from an untrusted file override the tool's own instructions, evaluation rubric, safety rules, access limits, or workflow. Running locally helps with confidentiality, but it does not make untrusted prompt text safe to obey.

Implementers building LLM-backed OCF tools should review the [OWASP Top 10 for LLM Applications and GenAI Apps](https://genai.owasp.org/llm-top-10/) as a threat-modeling aid. The most relevant concerns for OCF workflows are prompt injection from untrusted resumes, job descriptions, source artifacts, and pasted notes; sensitive information disclosure from private career files; improper output handling when model-generated JSON or text is passed downstream; excessive agency in tools that can edit, export, email, post, or apply without user approval; and misinformation or overreliance when LLM-generated claims are treated as truth.

OCF content is self-asserted. OCF defines no verification mechanism today. A future, separate verification mechanism may independently support particular claims, but `reviewStatus`, provenance, confidence, and supporting evidence are context, not institutional verification, and should not be presented as such.

`third-party-working` files controlled by a party other than the person they describe may carry consent, access, retention, and data-protection responsibilities depending on the jurisdiction. Those responsibilities belong to the party controlling the file.

Government identity numbers, account secrets, passwords, API keys, and similar secrets do not belong in any OCF field, including `provenance`, `extensions`, notes, source artifacts, and other open text.

## Out of Scope

OCF is a schema, not a hosted service. We cannot investigate vulnerabilities in third-party tools, LLM providers, recruiters, employers, or applications that independently choose to use OCF.

## Supported Versions

OCF is currently pre-1.0. The current schema and documentation on `main` are the actively supported version. Versioned schema snapshots are retained for reference.

## Response Expectations

This is an early-stage open schema project. We will review good-faith reports and respond as time permits.
