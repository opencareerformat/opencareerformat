#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const docs = [
  {
    source: "spec/usage-patterns.md",
    title: "OCF Usage Patterns",
    description: "File-role and workflow patterns for Open Career Format.",
  },
  {
    source: "spec/implementer-quick-reference.md",
    title: "OCF Implementer Quick Reference",
    description: "A compact tool-builder view of Open Career Format.",
  },
  {
    source: "spec/language-and-translation.md",
    title: "OCF Language And Translation",
    description: "Guidance for translated OCF documentation and translated career-content sidecars.",
  },
  {
    source: "spec/ocf-vs-resume-linkedin.md",
    title: "OCF Vs Resumes, LinkedIn, And LLM Chats",
    description: "How Open Career Format relates to resumes, LinkedIn profiles, JSON Resume, and LLM resume workflows.",
  },
  {
    source: "spec/schema-commentary.md",
    title: "OCF Schema Commentary",
    description: "Annotated Open Career Format schema commentary with examples and common pitfalls.",
  },
  {
    source: "spec/v0.3-planning.md",
    title: "OCF v0.3 Planning Notes",
    description: "Non-normative planning notes for likely next Open Career Format schema concepts.",
  },
  {
    source: "spec/v0.4-planning.md",
    title: "OCF v0.4 Planning Notes",
    description: "Early parking-lot notes for larger Open Career Format concepts deferred beyond v0.3.",
  },
  {
    source: "mappings/README.md",
    output: "mappings/index.html",
    title: "OCF Format Mappings",
    description: "Mappings between Open Career Format and related career, resume, and profile formats.",
  },
  {
    source: "mappings/career-ops-integration.md",
    title: "OCF And Career-Ops",
    description: "How Open Career Format and Career-Ops can work together while keeping career memory separate from job-search workflow state.",
  },
  {
    source: "spec/examples/README.md",
    output: "spec/examples/index.html",
    title: "OCF Example Files",
    description: "Canonical example Open Career Format files used by validators and tool authors.",
  },
  {
    source: "spec/examples/worked-example-walkthrough.md",
    title: "Worked Example Walkthrough",
    description: "A narrative walkthrough of the Open Career Format example lifecycle.",
    alternates: [
      { lang: "en", href: "https://opencareerformat.org/spec/examples/worked-example-walkthrough.html" },
      { lang: "es", href: "https://opencareerformat.org/spec/examples/worked-example-walkthrough.es.html" },
      { lang: "x-default", href: "https://opencareerformat.org/spec/examples/worked-example-walkthrough.html" },
    ],
  },
  {
    source: "spec/examples/worked-example-walkthrough.es.md",
    title: "Ejemplo Trabajado",
    description: "Recorrido narrativo en español del ciclo de ejemplo de Open Career Format.",
    lang: "es",
    alternates: [
      { lang: "en", href: "https://opencareerformat.org/spec/examples/worked-example-walkthrough.html" },
      { lang: "es", href: "https://opencareerformat.org/spec/examples/worked-example-walkthrough.es.html" },
      { lang: "x-default", href: "https://opencareerformat.org/spec/examples/worked-example-walkthrough.html" },
    ],
  },
  {
    source: "spec/examples/sample-resume.md",
    title: "Sample Resume Review Notes",
    description: "Explanation and review history for the fictional Maria E. Reyes sample set.",
  },
];

const generatedBySource = new Map(
  docs.map((doc) => [
    normalize(doc.source),
    normalize(doc.output || doc.source.replace(/\.md$/, ".html")),
  ]),
);

for (const doc of docs) {
  const sourcePath = path.join(root, doc.source);
  const outputRel = doc.output || doc.source.replace(/\.md$/, ".html");
  const outputPath = path.join(root, outputRel);
  const markdown = fs.readFileSync(sourcePath, "utf8");
  const html = renderPage(doc, outputRel, markdown);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log(`${doc.source} -> ${outputRel}`);
}

function renderPage(doc, outputRel, markdown) {
  const outputDir = path.dirname(outputRel);
  const toRoot = relativeHref(outputDir, ".");
  const logoHref = relativeHref(outputDir, "spec/assets/ocf-logo.png");
  const sourceHref = relativeHref(outputDir, doc.source);
  const canonical = `https://opencareerformat.org/${outputRel}`;
  const alternateLinks = (doc.alternates || [])
    .map((alternate) => `<link rel="alternate" hreflang="${escapeHtml(alternate.lang)}" href="${escapeHtml(alternate.href)}">`)
    .join("\n");
  const content = markdownToHtml(markdown, doc.source);

  return `<!DOCTYPE html>
<html lang="${escapeHtml(doc.lang || "en")}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(doc.title)} — Open Career Format</title>
<meta name="description" content="${escapeHtml(doc.description)}">
<link rel="canonical" href="${canonical}">
${alternateLinks ? `${alternateLinks}\n` : ""}<link rel="icon" type="image/png" href="${logoHref}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(doc.title)}">
<meta property="og:description" content="${escapeHtml(doc.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://opencareerformat.org/spec/assets/ocf-logo.png">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escapeHtml(doc.title)}">
<meta name="twitter:description" content="${escapeHtml(doc.description)}">
<meta name="twitter:image" content="https://opencareerformat.org/spec/assets/ocf-logo.png">
<script type="application/ld+json">
${JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    name: doc.title,
    url: canonical,
    description: doc.description,
    inLanguage: doc.lang || "en",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://opencareerformat.org/#website",
      name: "Open Career Format",
      url: "https://opencareerformat.org/",
    },
    about: {
      "@type": "CreativeWork",
      "@id": "https://opencareerformat.org/#spec",
      name: "Open Career Format",
      alternateName: "OCF",
      url: "https://opencareerformat.org/",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
  null,
  2,
)}
</script>
<style>
  :root {
    --bg: #fafaf9;
    --fg: #1c1917;
    --muted: #57534e;
    --accent: #2563eb;
    --accent-light: #dbeafe;
    --border: #d6d3d1;
    --code-bg: #f5f5f4;
    --card-bg: #ffffff;
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: var(--fg);
    line-height: 1.7;
    max-width: 780px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 5rem;
  }
  .site-header {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: 2rem;
  }
  .site-header img {
    width: 48px;
    height: 48px;
    border-radius: 10px;
  }
  .site-header a {
    color: var(--fg);
    text-decoration: none;
    font-weight: 700;
  }
  .doc-meta {
    color: var(--muted);
    font-size: 0.94rem;
    margin-bottom: 2rem;
  }
  h1 {
    font-size: 2.05rem;
    line-height: 1.2;
    margin: 0 0 0.75rem;
  }
  h2 {
    font-size: 1.45rem;
    line-height: 1.25;
    margin: 2.25rem 0 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
  }
  h3 {
    font-size: 1.1rem;
    margin: 1.5rem 0 0.5rem;
  }
  h4 {
    font-size: 1rem;
    margin: 1.25rem 0 0.5rem;
  }
  p, ul, ol, table, pre, blockquote {
    margin: 0 0 1rem;
  }
  ul, ol {
    padding-left: 1.4rem;
  }
  li + li {
    margin-top: 0.25rem;
  }
  a {
    color: var(--accent);
  }
  code {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.1rem 0.25rem;
    font-size: 0.92em;
  }
  pre {
    overflow-x: auto;
    background: #1c1917;
    color: #fafaf9;
    border-radius: 8px;
    padding: 1rem;
  }
  pre code {
    background: transparent;
    border: 0;
    color: inherit;
    padding: 0;
  }
  blockquote {
    border-left: 4px solid var(--accent-light);
    color: var(--muted);
    padding-left: 1rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    display: block;
    overflow-x: auto;
  }
  th, td {
    border: 1px solid var(--border);
    padding: 0.55rem 0.7rem;
    vertical-align: top;
    text-align: left;
  }
  th {
    background: var(--card-bg);
  }
  hr {
    border: 0;
    border-top: 1px solid var(--border);
    margin: 2rem 0;
  }
  .source-link {
    border-top: 1px solid var(--border);
    margin-top: 3rem;
    padding-top: 1rem;
    color: var(--muted);
    font-size: 0.94rem;
  }
</style>
</head>
<body>
<header class="site-header">
  <a href="${toRoot}"><img src="${logoHref}" alt="Open Career Format logo"></a>
  <a href="${toRoot}">Open Career Format</a>
</header>
<main>
<p class="doc-meta">Readable HTML version. <a href="${sourceHref}">View the Markdown source</a>.</p>
${content}
</main>
<footer class="source-link">
  <p>This page is generated from <a href="${sourceHref}"><code>${escapeHtml(doc.source)}</code></a>.</p>
</footer>
</body>
</html>
`;
}

function markdownToHtml(markdown, sourceRel) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const fence = line.match(/^```([A-Za-z0-9_-]*)\s*$/);
    if (fence) {
      const lang = fence[1] ? ` class="language-${escapeHtml(fence[1])}"` : "";
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].match(/^```\s*$/)) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      out.push(`<pre><code${lang}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2], sourceRel)}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      out.push("<hr>");
      i += 1;
      continue;
    }

    if (isTableStart(lines, i)) {
      const tableLines = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        tableLines.push(lines[i]);
        i += 1;
      }
      out.push(renderTable(tableLines, sourceRel));
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote>${markdownToHtml(quote.join("\n"), sourceRel)}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      out.push(`<ul>\n${items.map((item) => `<li>${inline(item, sourceRel)}</li>`).join("\n")}\n</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      out.push(`<ol>\n${items.map((item) => `<li>${inline(item, sourceRel)}</li>`).join("\n")}\n</ol>`);
      continue;
    }

    const para = [line.trim()];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].match(/^```/) &&
      !lines[i].match(/^(#{1,6})\s+/) &&
      !isTableStart(lines, i) &&
      !lines[i].match(/^>\s?/) &&
      !lines[i].match(/^\s*[-*]\s+/) &&
      !lines[i].match(/^\s*\d+\.\s+/)
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    out.push(`<p>${inline(para.join(" "), sourceRel)}</p>`);
  }

  return out.join("\n\n");
}

function renderTable(lines, sourceRel) {
  const rows = lines
    .filter((line, index) => index !== 1)
    .map((line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()));

  const head = rows[0] || [];
  const body = rows.slice(1);
  return `<table>
<thead><tr>${head.map((cell) => `<th>${inline(cell, sourceRel)}</th>`).join("")}</tr></thead>
<tbody>
${body.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell, sourceRel)}</td>`).join("")}</tr>`).join("\n")}
</tbody>
</table>`;
}

function isTableStart(lines, index) {
  return (
    index + 1 < lines.length &&
    /^\|.*\|\s*$/.test(lines[index]) &&
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])
  );
}

function inline(value, sourceRel) {
  const tokens = [];
  let text = value.replace(/`([^`]+)`/g, (_, code) => {
    const token = `\u0000${tokens.length}\u0000`;
    tokens.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  text = escapeHtml(text);

  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, href) => {
    return `<img src="${escapeHtml(rewriteHref(href, sourceRel))}" alt="${alt}">`;
  });

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    return `<a href="${escapeHtml(rewriteHref(href, sourceRel))}">${label}</a>`;
  });

  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  for (let index = 0; index < tokens.length; index += 1) {
    text = text.replace(`\u0000${index}\u0000`, tokens[index]);
  }

  return text;
}

function rewriteHref(href, sourceRel) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("#")) {
    return href;
  }
  const [pathPart, anchor = ""] = href.split("#");
  if (!pathPart.endsWith(".md")) {
    return href;
  }

  const sourceDir = path.dirname(sourceRel);
  const target = normalize(path.join(sourceDir, pathPart));
  const generatedTarget = generatedBySource.get(target);
  if (!generatedTarget) {
    return href;
  }

  const outputRel = generatedBySource.get(normalize(sourceRel));
  const outputDir = path.dirname(outputRel);
  const rewritten = relativeHref(outputDir, generatedTarget);
  return anchor ? `${rewritten}#${anchor}` : rewritten;
}

function relativeHref(fromDir, toRel) {
  let rel = path.relative(fromDir, toRel).replace(/\\/g, "/");
  if (!rel || rel === "") return ".";
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

function normalize(value) {
  return value.replace(/\\/g, "/").replace(/^\.\//, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
