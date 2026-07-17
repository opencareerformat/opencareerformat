# Maria Reyes OCF Example Set

This directory contains a complete teaching example showing how an Open Career Format file can be created from ordinary source material and grow through repeated conversations. Maria E. Reyes, most of her employers, and the specific events are fictional, but the conversations are based on credible interactions with modern LLMs.

Start with **[Maria Reyes: OCF in Practice](conversation.md)**. It follows Maria from a conventional resume and first job application through later conversations that recover more context, preserve corrections, and improve the same career-memory file.

The conversation is easier to read in the [rendered web version](https://opencareerformat.org/spec/examples/maria-reyes/). Readers who want to see how the conversations become structured JSON can continue [Inside Maria's OCF](inside-the-ocf.md).

## Files In This Example

### Main Teaching Pages

| File | Purpose |
|---|---|
| [`conversation.md`](conversation.md) | The primary conversation-based walkthrough. |
| [`index.html`](index.html) | The rendered web version of `conversation.md`. |
| [`inside-the-ocf.md`](inside-the-ocf.md) | The OCF structures and JSON changes behind the conversations. |
| [`inside-the-ocf.html`](inside-the-ocf.html) | The rendered web version of the JSON details. |

### Source Material

| File | Purpose |
|---|---|
| [`source-resume.txt`](source-resume.txt) | Maria's conventional source resume. |
| [`healthcare-job-description.txt`](healthcare-job-description.txt) | The target used when Maria creates her first OCF. |
| [`government-contractor-job-description.txt`](government-contractor-job-description.txt) | The later target used to demonstrate reuse, correction, and audience-specific curation. |

### OCF Revisions

| File | Purpose |
|---|---|
| [`maria-reyes-revision-1.ocf.json`](maria-reyes-revision-1.ocf.json) | A teaching reconstruction of the provisional OCF created in Conversation One. |
| [`maria-reyes-revision-6.ocf.json`](maria-reyes-revision-6.ocf.json) | Maria's accumulated OCF before Conversation Seven. |
| [`maria-reyes-revision-7.ocf.json`](maria-reyes-revision-7.ocf.json) | The complete OCF after the accepted corrections and additions from Conversation Seven. |

The set is pinned to OCF 0.3 so the conversations and JSON remain a stable teaching example. The complete revision files are included so readers can inspect the claims and verify the differences directly.
