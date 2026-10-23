// Builds reference/: the six service pages as Webflow exported them, before the refactor.
// It never touches the refactored pages in services/; use reference/ to compare against
// (http://localhost:5190/reference/services/<page>, or scripts/compare-pages.cjs).
//
//   node scripts/import-from-export.mjs           refuses to overwrite an existing reference/
//   node scripts/import-from-export.mjs --force   rebuilds reference/ from a newer export
//
// For each of the six service pages it takes the exported HTML as the base and:
// 1. fills the CMS lists (empty in a Webflow export) with the same lists from the
//    published staging page (hawkstone-developments-staging.webflow.io);
// 2. swaps every photo for images/placeholder.svg (logos and SVG icons are kept);
// 3. rewrites internal links to Webflow-style clean URLs (/services/heritage-design);
// 4. drops the Google Analytics and Ahrefs tags so local visits are not tracked.
// It also copies the shared CSS, webflow.js and the kept images.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPORT = path.resolve(ROOT, '..');
const STAGING = 'https://hawkstone-developments-staging.webflow.io';
const FORCE = process.argv.includes('--force');

export const PAGES = [
  'rural-conversions',
  'heritage-design',
  'luxury-architecture',
  'planning-applications',
  '3d-visualisations',
  'project-management',
];

const KEPT_IMAGES = [
  'arrow-black.svg',
  'arrow-white.svg',
  'Vector.svg',
  'Hawkstone-Logo-Black.avif',
  'Transparent-Logo-Thin-2.avif',
  'Transparent-Logo-Thin-2_1.avif',
  'favicon.png',
  'webclip.png',
];
const PLACEHOLDER = '../images/placeholder.svg';

// Returns [start, end) of every <div> whose class list contains `cls`, in document order.
function findDivs(html, cls) {
  const out = [];
  const open = new RegExp(`<div\\b[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'g');
  let m;
  while ((m = open.exec(html))) {
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = m.index;
    let depth = 0;
    let t;
    while ((t = tag.exec(html))) {
      depth += t[0].startsWith('</') ? -1 : 1;
      if (depth === 0) break;
    }
    if (!t) throw new Error(`Unbalanced <div> for .${cls} at ${m.index}`);
    out.push([m.index, tag.lastIndex]);
    open.lastIndex = tag.lastIndex; // CMS lists are never nested in each other
  }
  return out;
}

function classOf(html, [start]) {
  return html.slice(start, html.indexOf('>', start)).match(/class="([^"]*)"/)[1];
}

function fillCmsLists(exported, staging, page) {
  const a = findDivs(exported, 'w-dyn-list');
  const b = findDivs(staging, 'w-dyn-list');
  if (a.length !== b.length) {
    throw new Error(`${page}: ${a.length} CMS lists in the export, ${b.length} on staging`);
  }
  a.forEach((r, i) => {
    if (classOf(exported, r) !== classOf(staging, b[i])) {
      throw new Error(`${page}: CMS list ${i} is .${classOf(exported, r)} in the export, .${classOf(staging, b[i])} on staging`);
    }
  });
  let html = exported;
  for (let i = a.length - 1; i >= 0; i--) {
    html = html.slice(0, a[i][0]) + staging.slice(b[i][0], b[i][1]) + html.slice(a[i][1]);
  }
  return { html, count: a.length };
}

function placeholderImages(html) {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    const src = (tag.match(/\ssrc="([^"]*)"/) || [])[1] ?? '';
    if (KEPT_IMAGES.some((f) => src === `../images/${f}`)) return tag;
    return tag
      .replace(/\s(srcset|sizes)="[^"]*"/g, '')
      .replace(/\ssrc="[^"]*"/, ` src="${PLACEHOLDER}"`);
  });
}

function cleanUrl(target) {
  const p = target.replace(/^(\.\.\/)+/, '').replace(/\.html$/, '');
  if (p === 'index') return '/';
  return '/' + p;
}

function rewriteLinks(html) {
  // Export-relative links: ../contact.html, ../services/heritage-design.html#faq
  html = html.replace(/href="((?:\.\.\/)+[^"#?]+?\.html)([#?][^"]*)?"/g, (_, t, rest = '') => `href="${cleanUrl(t)}${rest}"`);
  // Staging CMS items link with absolute staging URLs in a few places.
  return html.replaceAll(`href="${STAGING}/`, 'href="/');
}

function dropAnalytics(html) {
  return html
    .replace(/\s*<script async="" src="https:\/\/www\.googletagmanager\.com\/gtag\/js[^"]*"><\/script>\s*<script>\s*window\.dataLayer[\s\S]*?<\/script>/, '')
    .replace(/\s*<script src="https:\/\/analytics\.ahrefs\.com\/analytics\.js"[^>]*><\/script>/, '');
}

async function main() {
  const out = (...p) => path.join(ROOT, 'reference', ...p);
  if (!FORCE && PAGES.some((p) => fs.existsSync(out('services', `${p}.html`)))) {
    console.error('reference/ already exists. Re-run with --force to rebuild it from the export.');
    process.exit(1);
  }

  for (const dir of ['css', 'js', 'images', 'services']) fs.mkdirSync(out(dir), { recursive: true });

  for (const f of ['normalize.css', 'webflow.css']) fs.copyFileSync(path.join(EXPORT, 'css', f), out('css', f));
  const siteCss = fs.readFileSync(path.join(EXPORT, 'css', 'hawkstone-developments-staging.webflow.css'), 'utf8');
  fs.writeFileSync(out('css', 'hawkstone-developments-staging.webflow.css'), siteCss.replaceAll("url('../images/MAP.avif')", "url('../images/placeholder.svg')"));
  fs.copyFileSync(path.join(EXPORT, 'js', 'webflow.js'), out('js', 'webflow.js'));
  for (const f of KEPT_IMAGES) fs.copyFileSync(path.join(EXPORT, 'images', f), out('images', f));
  fs.copyFileSync(path.join(ROOT, 'images', 'placeholder.svg'), out('images', 'placeholder.svg'));

  for (const page of PAGES) {
    const exported = fs.readFileSync(path.join(EXPORT, 'services', `${page}.html`), 'utf8');
    const res = await fetch(`${STAGING}/services/${page}`);
    if (!res.ok) throw new Error(`${page}: staging returned ${res.status}`);
    const staging = await res.text();

    let { html, count } = fillCmsLists(exported, staging, page);
    html = placeholderImages(html);
    html = rewriteLinks(html);
    html = dropAnalytics(html);

    const leftovers = html.match(/https:\/\/cdn\.prod\.website-files\.com\/(?!gsap\/)[^"' )]+/g) || [];
    fs.writeFileSync(out('services', `${page}.html`), html);
    console.log(`${page}: ${count} CMS lists filled${leftovers.length ? `, ${leftovers.length} remote asset URLs left` : ''}`);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
