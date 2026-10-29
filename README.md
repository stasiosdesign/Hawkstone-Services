# Hawkstone service pages (local)

The six service pages from the Webflow site, rebuilt locally for design iteration before they go back into Webflow. The refactored structure is aimed at that rebuild: shared service classes, isolated custom code, and global components kept exactly as Webflow has them. The refactor was verified element by element to look and behave exactly like the Webflow export. A responsive design pass followed: a fixed mobile/tablet logo, readable text sizes below 992px, balanced headings, and readable content kept within the 1800px column on large monitors. See [docs/webflow-migration.md](docs/webflow-migration.md#3a-responsive-design-pass-after-the-refactor).

| Page | Local URL |
| --- | --- |
| Rural Conversions | http://localhost:5190/services/rural-conversions |
| Heritage Design | http://localhost:5190/services/heritage-design |
| Luxury Architecture | http://localhost:5190/services/luxury-architecture |
| Planning Applications | http://localhost:5190/services/planning-applications |
| 3D Visualisations | http://localhost:5190/services/3d-visualisations |
| Project Management | http://localhost:5190/services/project-management |

The overview of all six is at http://localhost:5190/services. The pages as exported, before the refactor, are served by the reference server on port 5191 (see Checking changes below).

## Moving to Webflow

The plan for rebuilding these pages in Webflow (which sections become Webflow Components and with which properties,
which are CMS-powered, the custom code, what to confirm and decide first) is in
[docs/webflow/README.md](docs/webflow/README.md). Every section in the markup carries `data-migrate-*` attributes that
tie it to that plan; after a design change run `npm run migration:inventory` (or
`node scripts/migration-check.mjs --write`) and fix whatever it reports.

## Running it

```
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```

Serves this folder on http://localhost:5190 (`-Port` to change it). `Site Export/.claude/launch.json` has it as `hawkstone-service-pages`. There's no build step: edit, then reload. The server also does the jobs Webflow does when it publishes:

- **Clean URLs:** `/services/heritage-design` serves `services/heritage-design.html`, and a trailing slash redirects.
- **Includes:** `<!--#include file="/global/partials/footer.html" -->` is replaced by that file. Extra attributes are parameters, used in the file as `{{name}}`, with `{{#name}}…{{/name}}` kept only when the parameter is set and `{{^name}}…{{/name}}` only when it isn't.
- **Current page:** links to the open page get `w--current` and `aria-current="page"`.

## Hosting (Vercel)

`npm run build` (`scripts/build.mjs`, no dependencies) writes the site as `serve.ps1` serves it into `dist/`: the six pages, the overview and the placeholder with their includes expanded, plus the assets. `vercel.json` makes Vercel run it and serve `dist/` with the same clean URLs. Every other page address shows the placeholder, and every response is sent with `X-Robots-Tag: noindex`, so the copies are never indexed beside the live site. GitHub: `stasiosdesign/Hawkstone-Services`. `main` is the production deployment; `comments` is a second branch for a separate preview used for Vercel comments.

Open the pages through the server, not as files: without it the includes don't expand. The build is dedicated to the six service pages: every other address (Home, Contact, Projects, locations…) shows one shared placeholder (`dev/placeholder.html`) with a "Service Pages" button to the overview (`/services`, `dev/service-overview.html`). Both are local only and not part of the Webflow rebuild; `index.html` is no longer served. The pages need an internet connection for jQuery, GSAP, Lenis and the Adobe Fonts kit.

## Structure

```
global/                    The rest of the website, mirrored from Webflow. Never edit.
  css/                     normalize.css, webflow.css, and the Webflow site stylesheet minus service-only rules
  js/webflow.js            Webflow runtime and site interactions
  partials/                Global components: navigation (desktop + floating), Global Code, page transition,
                           Client Success testimonials, Final CTA, footer, site head and footer code
shared/                    Shared by the six service pages
  css/service-pages.css    Native classes (recreate in Webflow Designer), grouped by section
  custom-css/              Custom CSS by effect (Webflow: Embed element)
  custom-js/               Custom JavaScript by effect (Webflow: Page settings, before </body>)
  partials/                Shared service components: service-hero, service-projects (page passes its temporary
                           project data as parameters), service-cta-bar, service-logo
services/
  <page>.html              Page content; each section is marked "Shared section" or "Page section"
  css/<page>.css           Native classes used only on that page
dev/                       Local only, not migrated: the Service Pages overview, the shared placeholder and their CSS
reference/                 The pages as exported, unchanged (comparison only)
images/                    Logos, icons, the footer placeholder and the temporary photos
scripts/                   compare-pages.cjs (style comparison), import-from-export.mjs (rebuilds reference/),
                           migration-check.mjs (checks the Webflow mapping, writes docs/webflow/inventory.md)
docs/webflow/              The Webflow migration plan: start at README.md (components, CMS, one file per page)
docs/                      webflow-migration.md (design history, class conventions), class-map.md (every rename)
```

## Editing

- **One page only:** edit `services/<page>.html` and `services/css/<page>.css`. Nothing else is affected.
- **All six pages:** edit the shared class in `shared/css/service-pages.css`, or an effect in `shared/custom-css/` or `shared/custom-js/`.
- **Never:** edit `global/`, or change a global class from service CSS. If a service page needs a global class to look different, add a combo (`is-service…`, `is-[page]`) and style that.
- **New classes:** follow the conventions in [docs/webflow-migration.md](docs/webflow-migration.md#2-naming-conventions):
  - `service-[block]_[element]` for shared blocks;
  - `[page]-[block]_[element]` for one page (pages `rural`, `heritage`, `luxury`, `planning`, `visuals`, `pm`);
  - `is-…` for combos.

  Keep layout and type in native classes; use custom code only for effects.

## Checking changes

`scripts/compare-pages.cjs` loads the reference pages and the refactored pages in headless Edge, then compares every element's computed style at eight widths (1920 to 375 px). Use it to confirm a structural change made no visual difference, or, later, to compare the Webflow rebuild against these pages.

It needs the reference served at the site root on a second port: site scripts mark the current navigation link from the address, so `/reference/services/…` on port 5190 shows a slightly different nav dot. `Site Export/.claude/launch.json` has both servers. Node isn't on PATH on this computer, so in PowerShell put the Codex Node runtime first:

```
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1 -Root reference -Port 5191 -AllPages
$env:Path = 'C:\Users\Anast\AppData\Local\OpenAI\Codex\runtimes\cua_node\a5a02988362ca169\bin;' + $env:Path
node scripts/compare-pages.cjs              # JavaScript off
node scripts/compare-pages.cjs --js         # JavaScript on, frozen clock, scrolled to six positions
node scripts/compare-pages.cjs --interact   # clicks an FAQ, process step, tab, slider arrows and the mobile menu first
```

Once you start changing designs on purpose, the comparison will report those differences too: that's expected.

## Notes

- The CMS lists (nav dropdowns, project cards, testimonials, the Planning approvals slider, the "Looking for something else?" rows) are static copies of the published staging site (how they bind in Webflow: [docs/webflow/cms.md](docs/webflow/cms.md)); the photos are temporary (`images/hero-farmhouse-aerial-*.avif` and `images/temp-*.avif`), chosen from the client's own project photos until the real ones are picked.
- Every page has a fixed "Book a free consultation" bar with a back-to-top button (`shared/partials/service-cta-bar.html`, `shared/custom-js/service-cta-bar.js`); it hides while the footer is in view.
- Google Analytics and Ahrefs are left out so local visits aren't recorded.
- Luxury Architecture still links to two pages on the old `hawkstone-developments-testing.vercel.app` prototype, as on the live site.
