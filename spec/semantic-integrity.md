# OCF Semantic Integrity Contract

JSON Schema validates the shape of an OCF file. Some relationships require whole-document checks that JSON Schema does not express conveniently: local ID uniqueness, references to existing items, organization-registry references, lineage-aware references, and cycles through replacement links.

[`semantic-integrity.json`](semantic-integrity.json) is the authoritative machine-readable companion contract for those classifications. It defines which ID-shaped fields are local references, what kind of item each reference targets, which references may resolve through parent lineage, which ID-shaped fields are external identifiers rather than OCF references, and which `id` fields do not define durable OCF items.

The generated [`reference/schema-index.json`](../reference/schema-index.json) combines these classifications with paths discovered from the current schema. The reference validator then checks the resulting whole-document rules. Implementations may use another mechanism, but should preserve the same semantics for the declared OCF version.

This contract does not verify that a career claim is true, authorize disclosure, or replace visibility filtering. It verifies relationships inside the OCF document. Changes to it can alter validation and filtering behavior and should receive the same compatibility review as schema changes.
