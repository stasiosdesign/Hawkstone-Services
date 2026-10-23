// Compares every element's computed style between two versions of the six service pages:
// A (default: reference/, the pages as exported) and B (default: services/, the refactor).
// Needs two servers: serve.ps1 (port 5190) and serve.ps1 -Root reference -Port 5191. Serving the reference
// at the site root matters: site scripts mark current links from the address. Needs Node with Playwright
// (the Codex runtime on this computer has both):
//   node scripts/compare-pages.cjs                      JavaScript off, 8 widths
//   node scripts/compare-pages.cjs --js                 JavaScript on, frozen clock, 6 scroll positions
//   node scripts/compare-pages.cjs --pages heritage-design --widths 1440,375
//   node scripts/compare-pages.cjs --a https://hawkstone-developments-staging.webflow.io --b http://localhost:5190
// Elements are matched in document order, so it reports class and markup changes as well as styles.
const { chromium } = require(process.env.PLAYWRIGHT || require('path').join(require('path').dirname(process.execPath), 'node_modules', 'playwright'));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const JS = args.includes('--js') || args.includes('--interact');
const PAGES = opt('--pages', 'rural-conversions,heritage-design,luxury-architecture,planning-applications,3d-visualisations,project-management').split(',');
const WIDTHS = opt('--widths', '1920,1440,1280,991,768,767,479,375').split(',').map(Number);
const MAX = Number(opt('--max', 12));
const A = opt('--a', 'http://localhost:5191'), Bu = opt('--b', 'http://localhost:5190');
// --interact: after load, click through the page's interactive parts (both versions), then compare
const INTERACT = args.includes('--interact');
const ACTIONS = [
  ['[data-accordion-toggle]', 1], ['[data-accordion-toggle]', 12], ['[data-bouncy-tabs-button]', 2],
  ['[data-flick-cards-next]', 0], ['[data-layered-slider-next]', 0], ['[data-spatial-slider-control]', 3],
  ['[data-navigation-toggle="toggle"]', 0],
];
const SCROLLS = INTERACT ? [0] : JS ? [0, 0.15, 0.35, 0.55, 0.75, 1] : [0];

function collect() {
  const els = [...document.body.querySelectorAll('*')].filter((el) => !['SCRIPT', 'STYLE', 'LINK', 'TEMPLATE', 'NOSCRIPT'].includes(el.tagName));
  const sig = (cs) => { const ks = []; for (let i = 0; i < cs.length; i++) ks.push(cs[i]); ks.sort(); const o = {}; for (const p of ks) o[p] = cs.getPropertyValue(p); return JSON.stringify(o); };
  return els.map((el) => {
    const attrs = [...el.attributes].filter((a) => a.name !== 'class' && a.name !== 'aria-current' && a.name !== 'style').map((a) => a.name + '=' + a.value).sort().join(' ');
    const r = { tag: el.tagName, cls: el.getAttribute('class') || '', attrs, s: sig(getComputedStyle(el)), autoplay: !!el.closest('[data-layered-slider-init]') };
    for (const ps of ['::before', '::after']) {
      const c = getComputedStyle(el, ps);
      if (c.content && c.content !== 'none' && c.content !== 'normal') r[ps] = sig(c);
    }
    if (el.getAttribute('style')) r.inline = el.getAttribute('style');
    return r;
  });
}

async function snapshot(browser, url, width) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled: JS, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  if (JS) { await page.clock.install({ time: new Date('2026-10-18T12:00:00Z') }); await page.clock.pauseAt(new Date('2026-10-18T12:00:01Z')); }
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const shots = [];
  if (JS) await page.clock.runFor(7000);
  if (INTERACT) for (const [selector, n] of ACTIONS) {
    const clicked = await page.evaluate(([s, i]) => { const el = document.querySelectorAll(s)[i]; if (!el) return false; el.click(); return true; }, [selector, n]);
    if (clicked) await page.clock.runFor(2000);
  }
  for (const f of SCROLLS) {
    if (JS) {
      await page.evaluate((f) => { const y = (document.documentElement.scrollHeight - innerHeight) * f; if (window.lenis) window.lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y); }, f);
      await page.clock.runFor(3000);
    }
    shots.push(await page.evaluate(collect));
  }
  await ctx.close();
  return { shots, errors };
}

function close(x, y) {
  if (!JS || x === undefined || y === undefined) return false;
  const NUM = /-?\d*\.?\d+(e-?\d+)?(px)?/g;
  const nx = String(x).match(NUM) || [], ny = String(y).match(NUM) || [];
  if (nx.length !== ny.length || String(x).replace(NUM, '#') !== String(y).replace(NUM, '#')) return false;
  return nx.every((v, i) => {
    const a = parseFloat(v), b = parseFloat(ny[i]);
    return Math.abs(a - b) <= (v.endsWith('px') ? 0.5 : Math.max(0.006, 0.0005 * Math.abs(a)));
  });
}
function diffProps(a, b) {
  const ma = JSON.parse(a), mb = JSON.parse(b), out = [];
  for (const k of new Set([...Object.keys(ma), ...Object.keys(mb)])) if (ma[k] !== mb[k] && !close(ma[k], mb[k])) out.push(`${k}: ${ma[k]} → ${mb[k]}`);
  return out;
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  let total = 0;
  for (const p of PAGES) {
    for (const w of WIDTHS) {
      const [ra, rb] = await Promise.all([snapshot(browser, `${A}/services/${p}`, w), snapshot(browser, `${Bu}/services/${p}`, w)]);
      const lines = [];
      if (rb.errors.length !== ra.errors.length || rb.errors.some((e, i) => e !== ra.errors[i])) lines.push(`  page errors A=${JSON.stringify(ra.errors)} B=${JSON.stringify(rb.errors)}`);
      ra.shots.forEach((sa, si) => {
        const sb = rb.shots[si];
        if (sa.length !== sb.length) { lines.push(`  [scroll ${SCROLLS[si]}] element count ${sa.length} vs ${sb.length}`); }
        const n = Math.min(sa.length, sb.length);
        let shown = 0, count = 0;
        for (let i = 0; i < n; i++) {
          const a = sa[i], b = sb[i];
          const probs = [];
          if (a.tag !== b.tag) probs.push(`tag ${a.tag} vs ${b.tag}`);
          if (a.attrs !== b.attrs) probs.push(`attrs: ${a.attrs} | ${b.attrs}`);
          const ANIMATED = /^(transform|opacity|z-index|translate|scale|rotate|perspective-origin|transform-origin)$/;
          const skipAnim = JS && a.autoplay && b.autoplay; // layered slider autoplay drifts by a frame between runs
          if (a.s !== b.s) probs.push(...diffProps(a.s, b.s).filter((d) => !(skipAnim && ANIMATED.test(d.split(':')[0]))));
          for (const ps of ['::before', '::after']) if ((a[ps] || '') !== (b[ps] || '')) probs.push(`${ps} ` + (a[ps] && b[ps] ? diffProps(a[ps], b[ps]).join(', ') : 'presence differs'));
          if (!skipAnim && (a.inline || '') !== (b.inline || '') && !close(a.inline, b.inline)) probs.push(`inline: ${a.inline} | ${b.inline}`);
          if (probs.length) {
            count++;
            if (shown++ < MAX) lines.push(`  [scroll ${SCROLLS[si]}] #${i} <${a.tag.toLowerCase()} class="${a.cls}"> → class="${b.cls}"\n      ` + probs.slice(0, 6).join('\n      ') + (probs.length > 6 ? `\n      … +${probs.length - 6}` : ''));
          }
        }
        if (count) lines.push(`  [scroll ${SCROLLS[si]}] ${count} elements differ`);
        total += count;
      });
      console.log(`${lines.length ? '✗' : '✓'} ${p} @${w}${JS ? ' (js)' : ''}` + (lines.length ? '\n' + lines.join('\n') : ''));
    }
  }
  await browser.close();
  console.log(total ? `\nTOTAL differing elements: ${total}` : '\nALL IDENTICAL');
})();
