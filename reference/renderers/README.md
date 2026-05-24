# Reference Renderers

This directory is intentionally empty for now.

Importers, curators, and exporters can be demonstrated with minimal bare-bones scripts because their outputs are structured data or paste bundles. A renderer is different: a resume renderer is only useful if it can produce a reasonable-looking PDF or other human-facing document with credible typography, spacing, ordering, and pagination.

A toy renderer that emits an unattractive or poorly paginated PDF would not prove much about OCF and could make the project look less useful than it is. The first reference renderer should be good enough to produce a resume someone would plausibly review, edit, and send.

Planned future work:

- choose a practical rendering stack
- render a derived OCF into a clean PDF resume
- handle page breaks and section ordering deliberately
- keep the rendered output clearly separate from the master and derived OCF files
- remind users to review every word before sending
