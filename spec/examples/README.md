# OCF Examples

These examples show different parts of Open Career Format. Each OCF JSON file declares the schema version it uses and should be validated against that version.

## Maria Reyes: A Complete Teaching Example

Start with **[Maria Reyes: An OCF Growing Through Conversation](maria-reyes/Maria.md)**.

It is the single entry point for Maria's fictional OCF 0.3 example: the source resume, two target job descriptions, Conversations One through Seven, complete OCF revisions 6 and 7, and optional implementation details. The main page shows the full text of Conversations One, Five, and Seven; supporting files appear where the conversation uses them.

The Maria set is intentionally frozen to OCF 0.3. Revision 6 contains unresolved claims that Conversation Seven discovers; revision 7 is the current reference file after Maria's corrections. Reference tools should use `maria-reyes/maria-reyes-revision-7.ocf.json` unless they are specifically demonstrating the comparison.

## Focused Examples

| File | Description |
|---|---|
| [`repeated-organization-variants.json`](repeated-organization-variants.json) | Two tenures at one organization, reusable organization records, source artifacts, narrative variants, and title variants. |
| [`sales-compensation-private.json`](sales-compensation-private.json) | Private compensation and quota history alongside shareable sales achievements. |
| [`open-source-project.json`](open-source-project.json) | Independent open-source work represented as a top-level project with public achievements and skills. |

The examples are fictional. Do not infer real people, employers, or events from them.
