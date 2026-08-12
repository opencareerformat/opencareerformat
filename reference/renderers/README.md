# Reference Renderers

This directory contains thin wrappers around established rendering engines. OCF owns career memory and curation; a renderer owns typography, layout, pagination, and presentation file generation.

## RenderCV

First export a reviewed `export-ready` OCF snapshot to RenderCV YAML:

```bash
node reference/exporters/rendercv.js path/to/resume.export-ready.ocf.json /tmp/resume.rendercv.yaml
```

If RenderCV is already installed locally, render selected formats:

```bash
node reference/renderers/rendercv.js /tmp/resume.rendercv.yaml /tmp/resume-rendered \
  --theme classic \
  --formats pdf,html,png
```

Supported wrapper format names are `pdf`, `typst`, `markdown`, `html`, and `png`. The default is all five. `--stem` controls output filenames, and `RENDERCV_BIN` can point to an explicit local executable.

The wrapper:

- creates the requested local output directory;
- invokes RenderCV without a shell;
- uses explicit output paths;
- does not install dependencies or call a hosted rendering service;
- returns RenderCV's exit status.

The RenderCV dependency is deliberately not bundled. Installing or updating it is supply-chain work and should be an explicit local choice. The OCF-to-YAML export remains usable without RenderCV so users can inspect or edit the handoff first.

Rendered artifacts must remain separate from the master and export-ready OCF files. A content change returns to curation and produces a revised export-ready snapshot; a theme-only change may rerender the same approved content.
