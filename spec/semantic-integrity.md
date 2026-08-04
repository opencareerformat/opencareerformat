# OCF Semantic Integrity Contract

JSON Schema validates the shape of an OCF file. Some relationships require whole-document checks that JSON Schema does not express conveniently: local ID uniqueness, references to existing items, organization-registry references, lineage-aware references, and cycles through replacement links.

[`semantic-integrity.json`](semantic-integrity.json) is the authoritative machine-readable companion contract for those classifications. It defines which ID-shaped fields are local references, what kind of item each reference targets, which references may resolve through parent lineage, which ID-shaped fields are external identifiers rather than OCF references, and which `id` fields do not define durable OCF items.

## Required Whole-Document Rules

Implementations must apply these rules to the complete OCF document after structural schema validation:

1. **Local ID uniqueness.** Every `id` at a defining path in the generated schema index participates in one document-wide namespace. Reusing the same value at any two defining paths is an error, even when the items have different types. Paths listed in `nonDefiningIdPaths` contain external or embedded identifiers and do not enter this namespace.
2. **Typed local references.** Each field in `referenceFields` must resolve to the declared target group. `any-id` may resolve to any defining local ID; `source-artifact`, `experience`, `project`, and `achievement` resolve only to IDs classified in that group; `organization-key` resolves to a key in the top-level `organizations` registry. A plural reference checks every string in its array.
3. **Parent-lineage leniency.** A reference marked `allowParentLineage` may remain unresolved in a derived file only when `meta.parentFileId` is present. This means “the target may exist in the declared parent lineage”; it does not prove that the parent exists or contains the target. References without that flag must resolve in the current file, including organization references and the typed `related*Ids` fields.
4. **Supersession cycles.** Treat locally resolvable `supersededById` values as directed edges from the item carrying the field to its replacement. A self-reference or any longer directed cycle is an error. Report a detected cycle once regardless of which member traversal encounters first. A chain that ends at an item with no replacement is valid; a lineage-permitted edge whose target is absent from the current file cannot participate in a locally detectable cycle.
5. **Reference-like field coverage.** Schema maintenance must classify every field whose name ends in `Id`, `Ids`, or `Ref` as either a local reference or an intentionally ignored external/non-local identifier. Generation must fail when a new reference-like field lacks that classification.

These rules make uniqueness and reference scope local to one OCF lineage, not global across unrelated people or files. Tools that load a parent may perform stronger cross-file validation, but must not claim that the child-only leniency check verified the parent.

The generated [`reference/schema-index.json`](../reference/schema-index.json) combines these classifications with paths discovered from the current schema. The reference validator then checks the resulting whole-document rules. Implementations may use another mechanism, but should preserve the same semantics for the declared OCF version.

This contract does not verify that a career claim is true, authorize disclosure, or replace visibility filtering. It verifies relationships inside the OCF document. Changes to it can alter validation and filtering behavior and should receive the same compatibility review as schema changes.
