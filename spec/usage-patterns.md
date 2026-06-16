# OCF Usage Patterns

OCF is a schema. A candidate-owned master is one important usage pattern, not the only one.

Use this file when deciding what kind of OCF file you are creating, who controls it, and how it should move through a workflow. Use `schema-commentary.md` when you need field-level guidance and JSON examples.

The top-level `person` is always the **subject** of the career record: the person whose career the file describes. The subject is not always the person or organization that controls this particular file, and is not necessarily the actor that created or edited each item.

Keep these roles separate:

- **Subject**: the person whose career is described by `person`.
- **Controller**: the person, organization, or workflow that controls this particular OCF file.
- **Editor or authoring actor**: the person, tool, recruiter, coach, LLM, importer, or workflow that created or changed specific content. Item-level `provenance` is the usual place to record this.

In a candidate-owned master, these roles often collapse: the subject is the candidate, the controller is the candidate, and editors are the candidate or tools acting for the candidate. In a recruiter or coach workflow, they may be different: the subject is still the candidate, while the controller may be a recruiter, agency, coach, employer, or tool workspace.

OCF does not define a first-class `meta.controller` field. The controller is usually contextual: the file location, application workspace, account, or workflow tells you who controls it. If a tool needs to persist controller-specific metadata inside the file, use a vendor namespace under `extensions` rather than treating the subject as the controller.

## Candidate-Owned Master

A `candidate-master` OCF is the person's private, durable career memory. It may be broad and candid if the person chooses: achievements, source artifacts, compensation history, reflections, cautions, private notes, and open questions.

Because the candidate-owned master is controlled by the person, it is the right place for long-term accumulation and high-candor material. It should not be handed out by default. Curated or export-ready files are the normal shareable layer.

Common filenames:

- `{person}.master.ocf.json` (for example, `maria-reyes.master.ocf.json`)

## Imported or Converted First Pass

An imported or converted first pass is a provisional file built from resumes, LinkedIn exports, notes, photos, transcripts, or conversations. It is useful because it gives the user a starting point, but imported content is not automatically trusted career memory.

The current schema no longer uses a separate `imported-starter` file role. A first-pass file usually uses `meta.fileRole: "candidate-master"` when it is becoming the person's working master, plus `meta.source.kind: "imported"` or `"converted"` and item-level `reviewStatus`, provenance, cautions, and open questions to show what still needs review.

If the first pass is only a temporary working artifact, use `meta.fileRole: "other"` or a tool-owned working file, and avoid naming it as a master. The trust posture lives in the items: default mined facts to `reviewStatus: "unreviewed"` or `"needs-review"` until the user accepts them.

After review, the usual path is to keep the accepted material in the `candidate-master` and preserve the original inputs as `sourceArtifacts`. Do not silently overwrite a reviewed master with a reduced, third-party, or unreviewed imported file.

Do not name a throwaway or unreviewed import artifact as a master file. Use a filename such as `{person}-{context}-{date}.imported.ocf.json`. When the user accepts the result as their durable record, use `{person}.master.ocf.json`.

An importer should:

- add `sourceArtifacts` for the inputs
- set `meta.source.kind` to `imported` or `converted`
- preserve provenance on imported items
- default mined durable items to `reviewStatus: "unreviewed"` or `"needs-review"` until accepted
- default mined items to `private` or `shared` based on source and workflow
- create `openQuestions` for uncertain dates, metrics, titles, and claims
- avoid treating raw imported notes as public

Common filenames:

- `imports/resume-2026-05-24.ocf.json`
- `imports/linkedin-export-2026-05-24.ocf.json`

## Candidate-Curated and Export-Ready Files

A `candidate-curated` or `export-ready` OCF is a reduced working set prepared from a broader file for a specific audience, role, purpose, or downstream exporter.

These files should preserve lineage back to the source file when possible, but they are intentionally narrower than the master. Curation filters, ranks, questions, and prepares content. Exporters turn prepared content into files or target schemas.

A file produced by filtering, reducing, tailoring, or exporting from a master is not a master. It must not retain `meta.fileRole: "candidate-master"` unless it is a complete, user-accepted replacement for the prior master.

Curated, export-ready, imported, or third-party working files may still surface new facts, better wording, cautions, open questions, narrative variants, or other improvements. Those changes should be proposed back to the candidate-owned master as reviewable updates with provenance, not applied by treating the reduced file as the new master.

Use `candidate-curated` for a candidate-controlled working set prepared for review, coaching, tailoring, or later export. It may still contain proposed improvements or review questions.

Use `export-ready` for a handoff to a specific exporter or downstream system. Selection and visibility review should already be done.

Example distinction:

```json
{
  "meta": {
    "fileRole": "candidate-curated",
    "targetRole": "CISO",
    "targetCompany": "Acme Health",
    "parentFileId": "c94ffaa9-31fd-40d7-96cd-a66725a9784a",
    "parentVersion": "db2a5a6fc562"
  },
  "openQuestions": [
    {
      "question": "Should the ransomware-response story name the affected clinical system?",
      "visibility": "private"
    }
  ]
}
```

The curated file is still a working set: it can carry review questions or proposed improvements.

```json
{
  "meta": {
    "fileRole": "export-ready",
    "targetRole": "CISO",
    "targetCompany": "Acme Health",
    "parentFileId": "c94ffaa9-31fd-40d7-96cd-a66725a9784a",
    "parentVersion": "db2a5a6fc562",
    "lineageNotes": "Reviewed handoff for Acme Health CISO resume exporter."
  },
  "openQuestions": []
}
```

The export-ready file is the reviewed handoff. The unresolved question has either been answered, excluded, or left behind in the working file.

A curator should:

- filter based on visibility, rules, relevance, and recency
- ask questions about gaps or inconsistencies
- rank material by relevance and impact
- suggest updates to the master when useful
- prepare export-ready content when needed

An exporter should turn export-ready input into files or target schemas. It should not decide which private career facts belong; that is curation.

Common filenames:

- `curated/acme-ciso-2026-05-24.ocf.json`
- `exports/acme-ciso-resume-2026-05-24.pdf`
- `exports/acme-ciso-cover-letter-2026-05-24.docx`
- `exports/acme-ciso-json-resume-2026-05-24.json`

## Third-Party Working OCF

A `third-party-working` OCF is an OCF-shaped working file created by a recruiter, headhunter, coach, agency, employer, or tool about a person. The top-level `person` is still the subject, but the third party may control the file and may add workflow-specific review notes, intake details, or status metadata. The subject may never actually see this file, even though it is about them.

A third-party working OCF should contain what that third party needs for their workflow, not a copy of the candidate's private master memory. The schema permits broad representation; the workflow should still practice minimization.

Visibility is relative to the file role and controller. In a candidate-owned master, `private` usually means private to the candidate's master. In a third-party working OCF, `private` may mean private to the recruiter, coach, agency, employer, or tool workflow controlling that file. A note can be about the subject without being visible to the subject. Curators and exporters should respect the visibility rules of the file they are operating on.

If content from a third-party working OCF flows back toward the candidate-owned master, it should arrive as proposed updates for the person to accept, edit, or reject. It should not silently overwrite the candidate's master.

## Movement Between Roles

Match the contents of an OCF file to the role the file is playing:

- Master to curated/export-ready: reduce, filter, and preserve lineage.
- Imported starter to master: review, correct, accept selected material into the master, and archive or retain the starter as import evidence.
- Third-party working to candidate master: propose updates, do not merge silently.
- Curated/export-ready to export file: produce the artifact without treating it as the master.
- Curated/export-ready to candidate master: propose specific improvements with provenance; do not replace the master with the reduced file.

OCF does not prescribe how users keep historical versions. Git, cloud document history, dated backups, app-managed snapshots, and plain local files are all valid. But when a tool applies accepted updates to a candidate-owned master, it should preserve `meta.id` and refresh the file's own freshness markers, such as `meta.version` and `meta.lastModified`, when it manages those fields. A curated, imported, or export-ready file should record lineage to the source master rather than pretending to be the updated master.

The principle is simple: OCF files can move through many workflows, but the candidate-owned master remains special because it is controlled by the person whose career it describes.
