// Webflow migration check. Reads the six service pages (includes expanded as serve.ps1 does), maps every section to
// what it becomes in Webflow from the data-migrate-* annotations in the markup, and checks that against docs/webflow/:
// every section mapped, every component and item name described in docs/webflow/components.md, every page's section
// table (docs/webflow/pages/<page>.md) in the same order as the page. With --write it also regenerates
// docs/webflow/inventory.md: per page, each section with its heading, photos and slot items, taken from the markup.
//   node scripts/migration-check.mjs            check only; exits with 1 on a problem
//   node scripts/migration-check.mjs --write    check, then rewrite docs/webflow/inventory.md
// Annotations (local only; leave them out in Webflow, see docs/webflow/README.md):
//   data-migrate-component="Name"   root of a Webflow component (a section, or a component nested in one)
//   data-migrate-wrapper            a plain Webflow Section that only holds one component (same component used nested)
//   data-migrate-cms="Collection"   root of a CMS-powered section (not a component)
//   data-migrate-slot="Slot"        the element whose children are the slot's items
//   data-migrate-item="Name"        a slot item (an instance of that item component)
//   data-migrate-list="Collection"  the element that becomes the Collection List (its items: data-migrate-list-item)
// No dependencies.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs', 'webflow');
const WRITE = process.argv.includes('--write');
const pages = [
  ['rural-conversions', 'Rural Conversions'],
  ['heritage-design', 'Heritage Design'],
  ['luxury-architecture', 'Luxury Architecture'],
  ['planning-applications', 'Planning Applications'],
  ['3d-visualisations', '3D Visualisations'],
  ['project-management', 'Project Management'],
];
// Global components (global/partials, already in Webflow, reused as they are) that sit inside the page wrapper
const GLOBAL = {
  'client-success': 'Section - Testimonials',
  'final-cta': 'Section - Final CTA',
  footer: 'Section - Footer',
};

// ---- Includes, as serve.ps1 and scripts/build.mjs expand them; global partials become markers ----
const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39|apos);/g, (m, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" })[e]);
function expand(html, params) {
  if (params) {
    let before;
    do {
      before = html;
      html = html.replace(/\{\{#([\w-]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (m, k, body) => (params[k] ? body : ''));
      html = html.replace(/\{\{\^([\w-]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (m, k, body) => (params[k] ? '' : body));
    } while (html !== before);
    html = html.replace(/\{\{([\w-]+)\}\}/g, (m, k) => params[k] ?? '');
  }
  return html.replace(/<!--#include\s+file="([^"]+)"((?:\s+[\w-]+="[^"]*")*)\s*-->/g, (m, file, attrs) => {
    const g = file.match(/^\/global\/partials\/([\w-]+)\.html$/);
    if (g && GLOBAL[g[1]]) return `<migrate-global name="${GLOBAL[g[1]]}"></migrate-global>`;
    if (/\.css$/.test(file) || file.startsWith('/global/')) return '';
    const p = {};
    for (const a of attrs.matchAll(/([\w-]+)="([^"]*)"/g)) p[a[1]] = decode(a[2]);
    return expand(readFileSync(join(root, file.replace(/^\/+/, '')), 'utf8'), p);
  });
}

// ---- A small tolerant HTML parser (the pages are well formed) ----
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
function parse(html) {
  const top = { tag: '#root', attrs: {}, children: [] };
  const stack = [top];
  const re = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[^\s=>/]+(?:="[^"]*")?)*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const parent = stack[stack.length - 1];
    if (m[2]) {
      const i = stack.map((n) => n.tag).lastIndexOf(m[2].toLowerCase());
      if (i > 0) stack.length = i;
    } else if (m[3]) {
      const attrs = {};
      for (const a of m[4].matchAll(/([^\s=]+)(?:="([^"]*)")?/g)) attrs[a[1]] = a[2] ?? '';
      const node = { tag: m[3].toLowerCase(), attrs, children: [], parent };
      parent.children.push(node);
      if (!VOID.has(node.tag) && !m[5]) stack.push(node);
    } else if (m[6]) parent.children.push({ text: m[6] });
  }
  return top;
}
const elements = (n) => n.children.filter((c) => c.tag);
const cls = (n) => (n.attrs?.class || '').split(/\s+/);
function* walk(n) { for (const c of elements(n)) { yield c; yield* walk(c); } }
const find = (n, test) => { for (const c of walk(n)) if (test(c)) return c; return null; };
const text = (n) => (n.text !== undefined ? n.text : n.tag === 'br' ? ' ' : n.children.map(text).join(''));
const clean = (s) => s.replace(/&nbsp;/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
// A section's or item's heading: its first h1-h4 that isn't a small label; else its first label, title or paragraph;
// else its link or photo
const NAMED = /(^|[_-])(label|title|name|text|link)$|__item-label|tab-name/;
function heading(n) {
  const h = find(n, (c) => /^h[1-4]$/.test(c.tag) && !cls(c).includes('label'))
    || find(n, (c) => cls(c).some((k) => NAMED.test(k)) && clean(text(c)))
    || find(n, (c) => c.tag === 'p' && clean(text(c)));
  if (h) return clean(text(h));
  const a = find(n, (c) => c.tag === 'a' && c.attrs.href);
  return a ? a.attrs.href : photos(n)[0] || '';
}
const short = (s, max = 70) => (s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s);
const photos = (n) => [...new Set([...walk(n)].filter((c) => c.tag === 'img' && /\.avif$/.test(c.attrs.src || ''))
  .map((c) => c.attrs.src.replace(/^.*\//, '').replace(/-\d+\.avif$/, '')))];
// Annotated descendants of n, not looking inside another annotated element of the same kind
function annotated(n, attr) {
  const out = [];
  for (const c of elements(n)) { if (attr in c.attrs) out.push(c); else out.push(...annotated(c, attr)); }
  return out;
}

// ---- Docs ----
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const catalogue = read(join(docs, 'components.md')) || '';
const described = new Set([...catalogue.matchAll(/^###\s+(.+?)\s*$/gm)].map((m) => m[1]));
const cmsDoc = read(join(docs, 'cms.md')) || '';
const problems = [];
const used = new Set();
const report = [];

for (const [slug, title] of pages) {
  const html = expand(readFileSync(join(root, 'services', `${slug}.html`), 'utf8'), null);
  const doc = parse(html);
  const wrapper = find(doc, (n) => cls(n).includes('page-wrapper'));
  if (!wrapper) { problems.push(`${slug}: no page-wrapper`); continue; }
  for (const c of walk(doc)) for (const k of ['data-migrate-component', 'data-migrate-item']) if (k in c.attrs) used.add(c.attrs[k]);
  // Components fixed to the screen, outside the page wrapper (logo, consultation bar)
  const fixed = [];
  for (const c of walk(doc)) {
    if (c === wrapper) break;
    if ('data-migrate-component' in c.attrs) fixed.push(c.attrs['data-migrate-component']);
  }
  const rows = [];
  for (const sec of elements(wrapper)) {
    const a = sec.attrs;
    let kind, name, comp = sec;
    if (sec.tag === 'migrate-global') { kind = 'Global component'; name = a.name; }
    else if (a['data-nav-show-after'] === 'true' && !elements(sec).length) { kind = 'Page element'; name = 'Nav Trigger'; }
    else if ('data-migrate-cms' in a) { kind = 'CMS section'; name = `CMS: ${a['data-migrate-cms']}`; }
    else if ('data-migrate-component' in a) { kind = 'Component'; name = a['data-migrate-component']; }
    else if ('data-migrate-wrapper' in a) {
      const inner = annotated(sec, 'data-migrate-component');
      if (inner.length !== 1) problems.push(`${slug}: a section wrapper must hold exactly one component (holds ${inner.length})`);
      kind = 'Section + component'; name = inner[0]?.attrs['data-migrate-component'] || '?'; comp = inner[0] || sec;
    } else { problems.push(`${slug}: section not mapped: <${sec.tag} class="${a.class || ''}"> "${short(heading(sec), 50)}"`); continue; }
    if (kind === 'Component' || kind === 'Section + component') used.add(name);
    const nested = annotated(comp, 'data-migrate-component').map((c) => c.attrs['data-migrate-component']);
    nested.forEach((n) => used.add(n));
    const slots = [sec, ...walk(sec)].filter((c) => 'data-migrate-slot' in c.attrs).map((s) => {
      const items = elements(s).filter((c) => 'data-migrate-item' in c.attrs);
      if (!items.length) problems.push(`${slug}: slot "${s.attrs['data-migrate-slot']}" has no data-migrate-item children`);
      const names = [...new Set(items.map((i) => i.attrs['data-migrate-item']))].join(' / ');
      // The slot belongs to the nearest component or slot item around it
      let p = s;
      while (p && !(p.attrs && ('data-migrate-component' in p.attrs || 'data-migrate-item' in p.attrs))) p = p.parent;
      const owner = p ? p.attrs['data-migrate-component'] || p.attrs['data-migrate-item'] : name;
      return `${owner} › ${s.attrs['data-migrate-slot']}: ${items.length} × ${names} (${items.map((i) => short(heading(i), 40)).join('; ')})`;
    });
    const lists = [...walk(sec)].filter((c) => 'data-migrate-list' in c.attrs).map((l) => {
      const items = elements(l).filter((c) => 'data-migrate-list-item' in c.attrs);
      return `Collection List (${l.attrs['data-migrate-list']}): ${items.length} static items now (${items.map((i) => short(heading(i), 40)).join('; ')}), from the CMS in Webflow`;
    });
    const plain = kind === 'Global component' || kind === 'Page element';
    rows.push({ kind, name, heading: plain ? '' : heading(sec), photos: photos(sec), nested, slots, lists });
  }

  // Page doc: the section table rows "| n | Section | Built as | Name | ... |" in page order
  const pageDoc = read(join(docs, 'pages', `${slug}.md`));
  if (!pageDoc) problems.push(`${slug}: docs/webflow/pages/${slug}.md is missing`);
  else {
    const documented = [...pageDoc.matchAll(/^\|\s*(\d+)\s*\|[^|]*\|[^|]*\|\s*([^|]+?)\s*\|/gm)].map((m) => m[2].replace(/`/g, ''));
    const actual = rows.map((r) => r.name);
    if (documented.join('\n') !== actual.join('\n')) {
      problems.push(`${slug}: the section table in docs/webflow/pages/${slug}.md doesn't match the page.\n    page: ${actual.join(' | ')}\n    docs: ${documented.join(' | ')}`);
    }
  }
  report.push({ slug, title, rows, fixed });
}

for (const n of used) if (!described.has(n)) problems.push(`"${n}" is used on a page but has no "### ${n}" entry in docs/webflow/components.md`);
for (const n of described) if (!used.has(n)) problems.push(`docs/webflow/components.md describes "${n}", which no page uses (stale entry?)`);
for (const c of ['Projects', 'Services']) if (!cmsDoc.includes(c)) problems.push(`docs/webflow/cms.md doesn't cover the ${c} collection`);

if (WRITE) {
  const out = ['# Generated inventory', '',
    'Generated from the markup by `node scripts/migration-check.mjs --write`; do not edit by hand. Regenerate after any',
    'design change, so the migration works from what the pages hold now. Headings are the default content of each',
    'section (full copy: the page file); photos are the temporary image files in `images/` (-800/-1400 or -960/-1600 .avif).',
    'Component names: [components.md](components.md); CMS sections: [cms.md](cms.md); page decisions: [pages/](pages/).', ''];
  for (const p of report) {
    out.push(`## ${p.title}`, '', `\`services/${p.slug}.html\` · decisions: [pages/${p.slug}.md](pages/${p.slug}.md) · fixed to the screen, outside the page wrapper: ${p.fixed.join(', ')}`, '',
      '| # | Built as | Name | Heading (default) | Photos |', '|---|---|---|---|---|');
    p.rows.forEach((r, i) => out.push(`| ${i + 1} | ${r.kind} | ${r.name} | ${r.heading.replace(/\|/g, '\\|')} | ${r.photos.join(', ')} |`));
    out.push('');
    p.rows.forEach((r, i) => {
      const lines = [...(r.nested.length ? [`contains ${r.nested.join(', ')}`] : []), ...r.slots, ...r.lists];
      if (lines.length) out.push(`- **${i + 1}. ${r.name}:** ${lines.join('; ')}`);
    });
    out.push('');
  }
  writeFileSync(join(docs, 'inventory.md'), out.join('\n'));
}

for (const p of report) console.log(`${p.title}: ${p.rows.length} sections (${p.rows.filter((r) => r.kind === 'CMS section').length} CMS)`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`\nAll sections mapped; ${used.size} component names, all described in docs/webflow/components.md.${WRITE ? ' Wrote docs/webflow/inventory.md.' : ''}`);
