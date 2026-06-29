# OCF And Career-Ops

Career-Ops and Open Career Format appear complementary.

Career-Ops runs a local-first job-search workflow: candidate context, job search, matching, scoring, reports, generated application materials, and pipeline activity. OCF preserves candidate-owned career memory: durable facts, evidence, variants, cautions, stories, goals, and provenance that can travel across tools.

The useful boundary is simple:

- **OCF is the career substrate.** It stores what the candidate wants to remember, question, curate, and reuse.
- **Career-Ops is the job-search workflow.** It can run searches, evaluate opportunities, generate outputs, and manage operational search state.

OCF deliberately avoids key Career-Ops concerns such as application pipeline, scoring, reports, portal scanning, and workflow automation. Those belong in Career-Ops or another job-search tool.

## First Step: OCF Export To Career-Ops Files

As a first step, OCF includes a simple OCF-side skill that helps curate and export files into the format and directory structure Career-Ops expects. The goal is modest: let someone with an OCF file seed a Career-Ops workspace, which can then operate without caring where the data came from.

The skill is:

- [`skills/ocf-export-career-ops/SKILL.md`](../skills/ocf-export-career-ops/SKILL.md)

The detailed mapping notes are:

- [`mappings/career-ops.md`](career-ops.md)

The skill is intentionally adaptive. It should inspect the installed Career-Ops workspace's own examples/templates before writing files, because Career-Ops may change its expected file shapes over time. OCF should not copy or freeze Career-Ops templates.

## What The Skill Exports

The skill prepares Career-Ops user-layer files, such as:

- `cv.md`;
- `config/profile.yml`;
- `modes/_profile.md`;
- `interview-prep/story-bank.md`;
- `article-digest.md`;
- selected `jds/*` files when relevant.

For Career-Ops, `cv.md` should be treated as a broad candidate source, not a two-page human resume. A normal resume export should curate hard. A Career-Ops source file may include more visible roles, achievements, skills, stories, and proof points so Career-Ops has enough context to score, tailor, and generate narrower outputs.

The skill asks what type of role the Career-Ops workspace should aim for before choosing content. That target role track is especially important for OCF variants:

- `positioningVariants`;
- `narrativeVariants`;
- `titleVariants`;
- `talkingPoints`;
- cautions, goals, and provenance relevant to the track.

If someone is running multiple searches, such as customer success leadership and solutions consulting, the skill should avoid blending them into one ambiguous candidate profile. Separate Career-Ops workspaces or clearly separated output folders may be better today; a future deeper integration could let Career-Ops choose from OCF's track-specific variants directly.

## Example: Maria Starts A Career-Ops Search

OCF uses a fictional candidate, Maria E. Reyes, as a worked example for showing how a source resume and job description can become richer career memory. See the [`Maria sample overview`](../spec/examples/sample-resume.md) and the [`fully worked walkthrough`](../spec/examples/worked-example-walkthrough.md).

Specifically for Career-Ops, the OCF export skill can use Maria's sample OCF as the starting point for a Career-Ops search workspace instead of asking Career-Ops to rediscover her whole career from a flat resume.

For a healthcare cybersecurity director search, the OCF export skill would start from:

- [`spec/examples/sample-resume.ocf.json`](../spec/examples/sample-resume.ocf.json) as the OCF source;
- [`spec/examples/sample-job-description.txt`](../spec/examples/sample-job-description.txt) as the first relevant JD;
- the role track `healthcare-security` or `cybersecurity director`.

That track would steer the export toward Maria's healthcare-security headline:

> Healthcare cybersecurity leader protecting clinical continuity through incident response, compliance, and SOC maturity

It would also pull broad Career-Ops source material from her ransomware recovery, SOC buildout, HITRUST/SOC 2 work, executive-risk communication, healthcare data-protection scope, and relevant Army cyber background. A federal or defense search would choose different wording, including rank and MOS details that are useful for that audience but often unnecessary for a healthcare-sector resume.

The likely Career-Ops starting files would be:

- `cv.md`: a broad search source for Maria, not a two-page resume;
- `config/profile.yml`: identity plus current search overlay values Maria chooses to provide;
- `modes/_profile.md`: healthcare-security positioning, cautions, and target-specific framing;
- `interview-prep/story-bank.md`: only visible or explicitly approved story material, because some OCF talking points and reflections are private by default;
- `jds/healthcare-cybersecurity-director.md`: the sample healthcare cybersecurity JD.

This is the useful handoff: OCF provides durable career memory and target-aware variants; Career-Ops can then run the search, scoring, reporting, and application workflow from those starting files.

## Operational Overlay

Some Career-Ops configuration values are useful for a current search but are not normally durable OCF career facts. Examples include:

- expected compensation range;
- remote, hybrid, on-site, relocation, and travel preferences;
- target or excluded locations;
- preferred or excluded industries;
- urgency or availability;
- current search-specific dealbreakers.

An OCF skill may ask for those values and write them to Career-Ops configuration files for the current workspace. It should not save them back to the OCF master unless the user explicitly asks to preserve them as reviewed goals or preferences with visibility and provenance.

## Deeper Integration: Career-Ops As Curator And Exporter

A deeper integration could be more interesting than file export.

OCF already stores stable career facts separately from target/audience-specific variants: positioning, narrative variants, talking points, cautions, goals, and provenance. Career-Ops could potentially use OCF as the candidate's career substrate, curate and export what it needs for a given search track, run its job-search workflow, and then feed user-approved career-history improvements back into the OCF file.

The back channel to OCF should be limited to reusable career memory, such as:

- improved `narrativeVariants`;
- improved `positioningVariants`;
- new or refined `talkingPoints`;
- cautions about risky or weak claims;
- open questions surfaced by repeated job requirements;
- provenance or evidence notes that make a claim more defensible;
- user-approved story-bank material that belongs in OCF as reflections or talking points.

It should not import Career-Ops runtime state back into OCF:

- job scores;
- pipeline state;
- application status;
- portal scan results;
- batch reports;
- transient ranking metadata;
- generated files that are not user-reviewed career memory.

## Shared Values

The projects appear to share useful values:

- local-first files;
- user-owned data;
- AI-assisted workflows with review;
- generated outputs separate from source memory;
- no invented experience, metrics, or claims.

The integration should preserve those values. OCF can help Career-Ops start from richer, more durable candidate context. Career-Ops can help OCF improve through real search workflows, as long as the improvements are reviewed by the user and stay focused on career memory rather than job-search runtime state.

## Project Links

- Career-Ops website: <https://career-ops.org/>
- Career-Ops GitHub: <https://github.com/santifer/career-ops>
- Open Career Format website: <https://opencareerformat.org/>
- Open Career Format GitHub: <https://github.com/opencareerformat/opencareerformat>
