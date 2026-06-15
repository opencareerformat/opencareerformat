# OCF to Career-ops Mapping

Career-ops is a tool/workspace, not a data format. It is an open-source, local-first job-search system that runs through an AI coding CLI. It evaluates listings against a CV, generates tailored resumes, drafts application answers, and tracks a pipeline. This document describes how an OCF file can map to and from the user-owned files career-ops reads and writes, so an OCF exporter or importer can integrate without either project depending on the other.

Project website: <https://career-ops.org/>

GitHub repository: <https://github.com/santifer/career-ops>

Unlike the JSON Resume or Schema.org mappings, the target here is not a single document schema. Career-ops keeps candidate data in several plain-text files on disk, separated by its data contract into a User Layer and a System Layer. OCF maps onto the User Layer. The System Layer -- scoring logic, evaluation prompts, portal scanning, and scripts -- is career-ops behavior and has no OCF representation by design: scoring an opportunity is an OCF non-goal.

## Direction

Primary direction: `OCF curated/export-ready file -> career-ops User Layer files`.

An exporter renders the candidate-owned master, or preferably a curated child file, into the specific files career-ops expects. Career-ops then consumes those files exactly as it would hand-written files; it does not need to know OCF exists.

Reverse direction: `career-ops User Layer artifacts -> OCF master enrichment`.

As career-ops runs, the candidate may accumulate durable material outside `cv.md`: a refined profile, proof points, writing samples, and STAR+R stories. These can be valuable OCF content when imported back as reviewed enrichment, so the career memory does not live only inside one tool's working directory.

Both directions follow the general principles in this directory: export from an export-ready or curated file, preserve the master as source of truth, respect `visibility`, keep facts separate from display wording, and never invent facts to satisfy the target.

## Integration Shapes

**File generation.** An OCF exporter writes career-ops User Layer files directly, such as `cv.md`, `config/profile.yml`, `modes/_profile.md`, `interview-prep/story-bank.md`, `article-digest.md`, and selected `jds/*`. This works with career-ops as a local workspace because those files are plain Markdown and YAML and are treated as user-owned data. This is the pragmatic first integration and belongs in OCF's exporter category.

**Native OCF ingestion.** A future career-ops mode could read an OCF file directly as the candidate source instead of `cv.md` plus profile files. This is cleaner and avoids a generation step, but it requires upstream support from career-ops. File generation is the practical path; native ingestion is a possible later integration.

## User Layer Mapping

| OCF | career-ops file | Notes |
|---|---|---|
| Curated/export-ready resume content: `person`, `skills`, `experience[].positions[]`, selected `achievements[]`, `education`, `certifications`, `projects` | `cv.md` | Render selected, visible OCF content into resume-shaped Markdown. This is the primary integration point. |
| `person` identity, `goals`, target-role direction, work authorization display text | `config/profile.yml` | Identity, target roles, location preferences, and operational job-search settings. Some career-ops fields are preferences rather than durable career facts. |
| `positioningVariants[]`, `talkingPoints[]`, `voice`, `aiInstructions`, `cautions` | `modes/_profile.md` | Archetypes, narrative, and writing/negotiation guidance. `positioningVariants` map to target positioning; `talkingPoints` map to narrative through-lines; `voice` and `aiInstructions` map to tone/process guidance. |
| Position and experience `reflections[]`; `talkingPoints[]` with interview-oriented `uses` | `interview-prep/story-bank.md` | Strong fit. OCF reflections and interview-oriented talking points can seed STAR+R stories, and story-bank entries can import back as reflections or talking points after review. |
| `achievements[].metrics`, `supportingFacts[]`, high-evidence `achievements[]` | `article-digest.md` | Proof points and portfolio evidence used to ground claims and prevent invention. |
| Selected `sourceArtifacts[]` of kind `job-description` | `jds/*` | Job descriptions can be source artifacts when they explain a curation pass, reveal a gap, or prompt a story. OCF should not manage large numbers of JDs as pipeline state. |
| `voice` calibration, writing samples referenced as source artifacts | `writing-samples/*` | Style calibration inputs map to OCF `voice` and source artifacts. |

## `cv.md`

`cv.md` is career-ops' candidate source. Treat it the way the JSON Resume mapping treats an export: render from a curated or export-ready OCF file, select only visible items, use canonical facts for claims and selected `narrativeVariants` / `titleVariants` for wording, and never emit `private` content.

Do not overwrite a user-owned `cv.md` without explicit user action. Career-ops' update contract protects User Layer files from automatic upstream updates, but an agent or exporter may still help the user create or revise them. An OCF exporter should make that write deliberate and reviewable.

Because career-ops re-reads `cv.md` on each evaluation, regenerating it from OCF after accepted master updates can keep the working directory in sync without making `cv.md` the durable source of truth.

## Story Bank And Reflections

Career-ops accumulates STAR+R stories in `interview-prep/story-bank.md`. This is the most natural round-trip in the integration.

An OCF master with populated reflections can seed the story bank directly. Stories developed inside career-ops are high-value reflections or interview-oriented talking points to import back. In OCF, they can carry `visibility`, provenance, source artifact references, `supportingItemIds`, and `reviewStatus`; that makes them more portable than a story bank tied to one working directory.

When importing from a career-ops story bank, preserve the user's wording where possible, mark new durable items `reviewStatus: "unreviewed"` or `"needs-review"` until confirmed, and do not polish raw stories into resume prose without review.

## Job Descriptions

Job descriptions can be OCF source artifacts, but only in context. A JD may identify a gap, trigger an open question, or prompt a story that improves the master. In those cases, register the JD or a pointer to it as a `sourceArtifacts[]` item with `kind: "job-description"` and use provenance to explain what it affected.

Do not use the OCF master as a bulk JD archive or application tracker. Large collections of JDs, application statuses, follow-up history, and scan history belong to the job-search workspace, not the career-memory master.

## Out Of Scope

Career-ops owns several artifacts that OCF deliberately does not model:

- `data/applications.md`, `data/pipeline.md`, `data/scan-history.tsv`, `data/follow-ups.md`: application pipeline and tracker state. OCF is a candidate-owned career record, not a job-search workflow tracker.
- `reports/*`: per-job evaluations and scores. Scoring an opportunity against a candidate is an OCF non-goal; these are derivations about opportunities, not career facts.
- `output/*`: generated tailored PDFs. These are exporter outputs, the same category as any rendered resume.
- portal scanning, liveness checks, dashboards, batch processing, and command modes: tool behavior, not career data.

Keeping these out of OCF is correct. OCF supplies the durable candidate substrate; career-ops supplies elicitation, scoring, workflow, and rendering.

## Gaps And Watch Items

The integration surfaces concepts career-ops needs that OCF may not have a canonical home for:

- **Compensation expectations / target comp range.** Career-ops needs this operationally for scoring and filtering. OCF can preserve durable compensation history, but current target compensation may be too transient for OCF core. For now, keep it in career-ops or a private extension unless the user explicitly wants durable notes with date and provenance.
- **Target archetypes.** Career-ops archetypes are scoring/application preferences. They overlap with OCF `goals` and `positioningVariants`, but they are not the same as a possible future career-track model.
- **Negotiation scripts.** These are partly expressible through `aiInstructions`, `cautions`, and `voice`, but OCF does not have a dedicated negotiation-script field.

These are useful evidence for future OCF or companion-tool backlog work, not blockers for integration.

## Import Guidance

When importing career-ops artifacts back into an OCF master:

- Register `cv.md` and relevant `jds/*` files as source artifacts when they materially support imported changes.
- Treat new `story-bank.md` entries as candidate reflections or interview-oriented `talkingPoints`, marked `reviewStatus: "unreviewed"` until the candidate confirms them.
- Treat refined `article-digest.md` proof points as evidence for existing achievements and `supportingFacts`, not as new standalone claims, unless the candidate confirms them.
- Do not import career-ops `reports/*` or scores into the master; they are derivations about opportunities, not career facts.
- Do not overwrite master content from a career-ops working directory without user review; the working directory is a tool context relative to the master.

## Principle Alignment

The two projects share useful values: local-first data, user review, generated outputs separate from source files, and no invented experience or metrics. That lowers integration risk. The mapping does not need to reconcile conflicting philosophies; it mostly needs to preserve the boundary between durable career memory and operational job-search workflow.
