// Static build for hosting (Vercel): writes the site exactly as serve.ps1 serves it into dist/.
// - Pages: the six service pages (dist/services/<slug>.html), the Service Pages overview (dist/services.html) and
//   the shared placeholder (dist/placeholder.html, also dist/404.html). vercel.json maps every other page address to
//   the placeholder, as serve.ps1 does, and serves clean URLs.
// - Includes: <!--#include file="..." name="value" --> expanded with serve.ps1's rules ({{name}}, {{#name}}...{{/name}},
//   {{^name}}...{{/name}}), and links to the page itself marked w--current / aria-current="page".
// - Assets: global/, shared/, services/css/, images/ and dev/css/ copied as they are.
// No dependencies; run with `node scripts/build.mjs` (Vercel: `npm run build`).
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const servicePages = ['rural-conversions', 'heritage-design', 'luxury-architecture', 'planning-applications', '3d-visualisations', 'project-management'];

const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39|apos);/g, (m, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" })[e]);
const has = (params, k) => Boolean(params[k]);

function expandIncludes(html, params, depth) {
  if (depth > 8) throw new Error('Includes nested too deeply');
  if (params && Object.keys(params).length) {
    html = html.replace(/\{\{#([\w-]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (m, k, body) => (has(params, k) ? body : ''));
    html = html.replace(/\{\{\^([\w-]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (m, k, body) => (has(params, k) ? '' : body));
    html = html.replace(/\{\{([\w-]+)\}\}/g, (m, k) => params[k] ?? '');
  }
  return html.replace(/<!--#include\s+file="([^"]+)"((?:\s+[\w-]+="[^"]*")*)\s*-->/g, (m, file, attrs) => {
    const path = join(root, file.replace(/^\/+/, ''));
    if (!existsSync(path)) throw new Error(`Include not found: ${file}`);
    const p = {};
    for (const a of attrs.matchAll(/([\w-]+)="([^"]*)"/g)) p[a[1]] = decode(a[2]);
    return expandIncludes(readFileSync(path, 'utf8'), p, depth + 1);
  });
}

function setCurrentLinks(html, path) {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`<a\\b[^>]*\\bhref="${escaped}"[^>]*>`, 'g'), (tag) => {
    if (tag.includes('w--current')) return tag;
    if (/ class="/.test(tag)) return tag.replace(/ class="([^"]*)"/, ' aria-current="page" class="$1 w--current"');
    return tag.replace(/>$/, ' aria-current="page" class="w--current">');
  });
}

function page(src, dest, path) {
  let html = expandIncludes(readFileSync(join(root, src), 'utf8'), null, 0);
  if (path) html = setCurrentLinks(html, path);
  const file = join(out, dest);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const slug of servicePages) page(`services/${slug}.html`, `services/${slug}.html`, `/services/${slug}`);
page('dev/service-overview.html', 'services.html', '/services');
page('dev/placeholder.html', 'placeholder.html', null);
page('dev/placeholder.html', '404.html', null);
// Partials are include sources, already expanded into the pages; they are not served on their own.
const notPartial = (src) => !/[\\/]partials([\\/]|$)/.test(src);
for (const dir of ['global', 'shared', 'services/css', 'images', 'dev/css']) cpSync(join(root, dir), join(out, dir), { recursive: true, filter: notPartial });
console.log(`Built ${servicePages.length} service pages, the overview and the placeholder into dist/`);
