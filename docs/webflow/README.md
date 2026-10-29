# Webflow migration: start here

How the six service pages become native Webflow pages through the Webflow MCP: which sections become Webflow
Components (with which properties, slots and variants), which are CMS-powered, what custom code goes where, what must
be confirmed in Webflow first and what the user still has to decide. Prepared on 29 October 2026. **Nothing has been
built in Webflow.** The designs may still change before the migration: after any change, run the check (below) and
update these files.

| File | What it holds |
|---|---|
| [README.md](README.md) | This guide: rules, conventions, procedure, capabilities to confirm, open decisions |
| [components.md](components.md) | Every component and slot item: properties, slots, variants, behaviour, limits |
| [cms.md](cms.md) | The CMS-powered sections (Recent Projects, Recent Approvals, Looking for something else?) |
| [pages/](pages/) | One file per page: section order, each instance's settings, page code, interactions to keep |
| [inventory.md](inventory.md) | Generated from the markup: per page, each section's heading, photos and slot items |
| [environment.md](environment.md) | The Webflow side: site, page, collection and component IDs, domains, plan limits, the staging-only publishing guard, how to check work visually |
| [../webflow-migration.md](../webflow-migration.md), [../class-map.md](../class-map.md) | Older: the design history, class conventions (Client-First), native-vs-custom code, limitations. Its sections 5 and 7a are replaced by these files. |

## Ground rules

- Don't change anything in Webflow or on the live site until the user says the migration starts. Build new pages as
  drafts first; replacing the live pages is the user's call (see *Procedure*).
- Publish only to the Webflow staging subdomain, never to production or a custom domain; a hook enforces it
  ([environment.md](environment.md#publishing-staging-only-guard)). The site isn't on Enterprise, so every publish is
  a whole-site publish.
- The pages sit in the existing site. Reuse its global components as they are and never edit them or their classes:
  Navigation Desktop, Navigation [2], Global Code, Page Transition, Main CTA, Sub Heading, Section - Testimonials
  (Client Success), Section - Final CTA, Section - Footer. Where a service page needs something different, use the
  combos in the local CSS (`is-service…`, `is-[page]`).
- Never reword, shorten or add copy: it is keyword-optimised. Sentence case, no all-caps text.
- Native first: layout and type as classes in Designer; custom CSS only for the effects listed under *Custom code*.

## How the markup carries the plan

Every section of every page is annotated in the local markup, so the plan can't drift from the pages. The attributes
exist only locally: leave them out in Webflow.

| Attribute | Marks |
|---|---|
| `data-migrate-component="Name"` | The root of a Webflow Component (a section, a nested component, or the fixed logo and bar) |
| `data-migrate-wrapper` | A plain Webflow Section around one component (3D's feature pills, the same component being nested elsewhere) |
| `data-migrate-cms="Projects"` / `"Services"` | The root of a CMS-powered section (not a component) |
| `data-migrate-slot="Name"` | The element whose children are the slot's items |
| `data-migrate-item="Name"` | A slot item: an instance of that item component |
| `data-migrate-list="Collection"`, `data-migrate-list-item` | The element that becomes the Collection List, and the static items Collection Items replace |
| `<div data-nav-show-after="true">` (no class) | **Nav Trigger**, a page element: the floating navigation appears once it scrolls past (see *Nav trigger*) |

`node scripts/migration-check.mjs` (Node 18+, no dependencies) reads the pages with their includes, checks that every
section is mapped, that every component and item name has an entry in [components.md](components.md), and that each
[pages/](pages/) file's section table matches the page, in order. `--write` also regenerates
[inventory.md](inventory.md). Run both after every design change; npm: `npm run migration:check`,
`npm run migration:inventory`.

## What becomes what

| Kind | Count | In Webflow |
|---|---|---|
| Shared section components | 16 + 2 fixed | Components used on several pages (or built to be): Service Hero, Statement, Horizontal Scroll, Tabs, Sticky Cards, Expanding Tiers, Expanding List, Fit List, Overlapping Rows, Process Slider, FAQ, Feature Pills, Split Text, Route Cards, Pair Cards, Inline CTA; plus the fixed Service CTA Bar and Service Logo |
| Page-only section components | 5 | Rural Building Types, Rural Design, Rural Who We Work With, Heritage Getting It Approved, Project Management Case Study |
| Slot item components | 17 | One per repeatable thing: a tab, a card, a step, a question… (listed under each section component) |
| CMS sections | 3 kinds, 11 instances | Recent Projects (6), Recent Approvals (1), Looking for something else? (4): static header + Collection List, not components |
| Global components | existing | Final CTA and Footer on all six, Client Success on Rural and Heritage, navigation and page transition everywhere |
| Page element | 5 | Nav Trigger (not on Project Management) |

| Component | Rural | Heritage | Luxury | Planning | 3D | PM |
|---|---|---|---|---|---|---|
| Service Hero | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Service Statement | | ✓ | ✓ | ✓ | | ✓ |
| Service Horizontal Scroll | | | ✓ | | | |
| Service Tabs | | | ✓ | | ✓ | |
| Service Sticky Cards | ✓ | ✓ | ✓ | ✓ | | |
| Service Expanding Tiers | ✓ | ✓ | | | ✓ | ✓ |
| Service Expanding List | | ✓ | | ✓ | ✓ | ✓ |
| Service Fit List | | ✓ | ✓ | | | ✓ |
| Service Overlapping Rows | | | | ✓ | ✓ | |
| Service Process Slider | | | ✓ | | ✓ | |
| Service Feature Pills | nested | nested | | | ✓ | |
| Service Split Text | | | | ✓ | ✓ | |
| Service Route Cards | | | | ✓ | | |
| Service Pair Cards | ✓ | | | | | |
| Service Inline CTA | | ✓ | | | ✓ | |
| Service FAQ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Service CTA Bar, Service Logo | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CMS: Projects (Recent Projects) | ✓ | ✓ | ✓ | ✓ (+ Recent Approvals) | ✓ | ✓ |
| CMS: Services (Looking for something else?) | ✓ | ✓ | ✓ | | | ✓ |

## Conventions

### Names

- **Section components:** `Service <Pattern>` when shared ("Service Sticky Cards"), `<Page> <Section>` when page-only
  ("Rural Building Types"). **Item components:** the singular ("Service Sticky Card"). Use the names in
  [components.md](components.md) exactly: the check matches them.
- **Slots:** the plural of what they hold ("Tabs", "Cards", "Steps", "Questions", "Points", "Rows", "Routes").
- **Variants:** a property named for what the client chooses ("Style: Dark / Light", "Photo Side: Left / Right",
  "Card Height: Standard / Tall"). A variant reproduces the local combo classes (`is-dark`, `is-band`…) as that
  variant's styles.
- **Classes:** unchanged from the local CSS (Client-First: `service-[block]_[element]`, page-only
  `[page]-[block]_[element]`, combos `is-…`; Osmo's `block__element` names kept). See the older guide, section 2.

### Property labels

The same words everywhere, so a client learns them once:

| Label | Means | Type |
|---|---|---|
| Label | The small text beside the yellow dot above a heading | Text |
| Heading | The section's heading (the hero's H1) | Text |
| Intro / Lead | The paragraph under a section heading | Text |
| Title | An item's heading | Text |
| Text | A plain paragraph | Text |
| Body | Formatted text: paragraphs, links, lists | Rich Text |
| Number | An item's number as shown ("01") | Text |
| Image / Photo | A picture; every one is cropped to fill its frame | Image |
| Button Text / Button Link | The nested Main CTA's label and destination | Text / Link |
| Show … | Whether an optional part appears | Visibility |

Write a short description on a property wherever the label alone could mislead; the catalogue's *Description* column
is the text to use (e.g. Tab Name: "The word(s) on the tab button"; Pill Photos: "One per pill, in the same order").
Don't expose technical settings (data attributes, scroll values, classes) as properties.

### Defaults

The component definition takes the content of the first page in its *Used on* line; each instance on each page then
gets that page's current content, copied from the page file (never retyped from memory). Photos are temporary
(`images/temp-*.avif`, `images/hero-farmhouse-aerial-*.avif`); use the real images when the user supplies them.

### Slots: where, and where not

Slots are used for content that repeats or that a client could reasonably extend: tabs, cards, steps, routes, rows,
list points, FAQ questions, feature pills and their photos, split rows, reading links, activities. Everything else is
a fixed structure with properties: hero, statement, inline CTA, case study, the three Who We Work With columns, the
section heads. Each slot's item component carries the item's own content, so adding an item is one step: for this, the
tab buttons and the process slider's step names are generated from the items, and the expanding list's ARIA ids are
generated too.

Slot wrapper: the scripts find items by data attributes anywhere inside their section, so a wrapper element around
slot content doesn't break them; layouts that space items as flex or grid children (track, tab panels, tiers, cards,
rows) would. If Webflow renders a slot with a wrapper element, give that wrapper `display: contents` (one rule per
slot in the page Embed) and check the layout.

### Rich Text

Where an item's text has more than one paragraph, a link or a list on any page, the property is Rich Text, and the
paragraph and link styles are set on the Rich Text's class as nested styles ("All Paragraphs", "All Links"), with the
values of the local `…_text` class. Local markup was aligned with this where it was cheap (sticky-card text, the fit
list's note).

### Heading levels

A component can't change an element's tag per instance. Where the same property is a heading on one page and a
paragraph or a different level on another (Statement, Overlapping Rows heading, Feature Pills heading), build both
elements bound to the same Text property, each with a Visibility property, and show the right one per instance. Keep
the levels the pages have today.

### Line breaks

Many headings have an editorial line break (`<br class="service-br">`), dropped below 768px so phone headings wrap
naturally; a few have a plain `<br>` kept on phones. Confirm whether a Text property keeps a line break (Shift+Enter).
If it does, the class can't ride on it: drop the breaks below 768px with one rule in the page Embed, by heading class,
e.g. `@media (max-width: 767px) { .service-cards_heading br, .h-process_heading br, .service-fit_heading br { display:
none; } }` (the classes of every heading the catalogue marks "line break"). Two components have a plain break on one
page and a `service-br` on another (Overlapping Rows: 3D; Expanding List: Project Management), so those two plain
breaks would also drop on phones: a small change to show the user. If Text properties can't keep a break, the
headings lose their desktop breaks: show the user before accepting.

### Button labels

The Main CTA (global) doesn't wrap its label. Measured at 375px in the narrowest panels (Rural's pair card): "Book
your free consultation" (27 characters) keeps its padding; at about 33 characters the padding is used up; longer
labels get cut off. Put "Up to about 27 characters" in every Button Text description. Today's labels are 12 to 24.

## Content resilience (tested)

With every heading, paragraph and button label in every component lengthened by about 60% (at 1440, 991 and 390px),
nothing clipped, overlapped or pushed the page sideways after this pass's fixes, apart from button labels on phones
(*Button labels*) and Rural's rotating-word mask, which hides the other words by design. Keep it that way in Webflow: no fixed
heights on text containers, `min-width: 0` on flex and grid text columns, photos `object-fit: cover`. Limits worth
telling the client (they're also in the property descriptions): button labels as above; tab names one or two words;
tier titles two to five words; item counts as listed per component (tiers 2-4, tabs 2-8, steps 3-10…). The test
script is not in the repository (a scratch tool); repeat it on the Webflow build by editing a few headings to double
length on a draft page.

## Nav trigger

The floating navigation (global) is hidden on desktop until the bottom of the first `[data-nav-show-after="true"]`
element scrolls past the top of the screen. Before this pass the attribute sat on whichever section came third, which
a shared component can't vary per page. Now each page has an empty marker div right after that section (Rural,
Heritage, Luxury, Planning, 3D: after section 3). In Webflow: a Div Block with no class and the custom attribute
`data-nav-show-after` = `true`, placed as in each page file. Project Management has none (see its page file).

## Custom code

**Custom CSS** (`shared/custom-css/`): one Embed per page holding the files that page lists (page files, *Custom CSS*),
each in its own `<style>`. Changed in this pass: `service-rows.css` (row number counter), `bouncy-tabs.css` (all
panels visible in the Designer).

**Page scripts** (`shared/custom-js/`): Page settings → Custom code → before `</body>`, in the order each page file
lists, each inside `<script></script>`. They need the site-wide GSAP 3.15 (ScrollTrigger, Draggable, InertiaPlugin)
and Lenis; Planning also loads Smooothy 0.0.35 from unpkg. Each runs once per page and selects by data attributes.
Changed in this pass so components and slots need no per-instance data:

| Script | Change |
|---|---|
| `bouncy-tabs.js` | Builds the tab buttons from the panels' hidden tab names; opens the first tab itself |
| `service-slider.js` | Step names (indicators) from the step titles; no duplicate attribute |
| `service-expand.js` | Generates the `aria-controls` ids |
| `service-tiers.js` | Every tiers block on a page runs on its own; opens the first card itself, without its transition (so nothing below moves after load) |
| `horizontal-process.js` | Finds the last route by class (slot wrappers can't confuse it) |
| `overlapping-slider.js` | Carousel name from its section heading when no label attribute |
| `service-cta-bar.js` | Finds the hero's button by class when it has no attribute |
| `service-hero.js` (new, all six) | Keeps the H1's and supporting text's first-line tops level now the H1 mixes in the taller accent serif (Service Hero in the catalogue) |

Script length: Webflow's API registers inline scripts only up to a short length, and Page settings fields have a
limit; check each page's total. If it doesn't fit, host the files (for example jsDelivr from the GitHub repository)
and load them with `<script src>`; ask the user, as the repository is public.

## Capabilities to confirm (before building)

Test each on a throwaway component on a draft page (delete it afterwards, with the user's OK). Each has a fallback.

1. **Components through the MCP:** create a component, add Text, Rich Text, Image, Link and Visibility properties,
   bind them to elements, set property descriptions and per-instance values. Fallback: build the component's
   structure through the MCP and ask the user to bind properties in Designer from the catalogue.
2. **Slots:** create a slot, place item components in it per instance; does the slot add a wrapper element? (see
   *Slots*). Fallback without slots: fixed item counts per page as instances inside the component.
3. **Variants:** create component variants whose styles differ (`is-dark` etc.). Fallback: a Visibility-based or
   class-based approach per component (two styled wrappers), or separate components ("… Dark").
4. **Nested component properties:** expose a nested Main CTA's text and link as the parent's Button Text / Button
   Link.
5. **Custom attributes on instances or bound to properties:** wanted for the Feature Pills' `aria-label`, the process
   carousel's label, Rural's rotating words, Project Management's `id="scope"`. Fallbacks: the scripts already fall
   back where noted; otherwise a fixed value in the component, or a page-level anchor div before the section.
6. **Line breaks in Text properties** (see *Line breaks*).
6a. **Properties on parts of one heading:** the hero H1 is plain text, a span and plain text (Heading Start, Heading
    Highlight, Heading End). Confirm three Text properties can be bound inside one Heading element (text spans).
    Fallback: one Text property for the whole H1 plus the highlight set in the component per page (a variant per
    page), or ask the user; never split the H1 into separate headings.
7. **CMS:** read both schemas (fill in [cms.md](cms.md)); filter a static page's Collection List by "Project Type
   contains <item>"; exclude one Services item; sort by a number field; bind a custom attribute (the row link's
   `aria-label`) to a CMS field. Fallbacks are in cms.md.
8. **Sizing keywords:** `max-width: min-content` (service row titles) in Designer; else the page Embed.
9. **Nested Rich Text styles** (All Paragraphs / All Links on a class) through the MCP; else the page Embed.
10. **`wf-design-mode`:** that the Designer canvas has this class (for editing tab panels); harmless if not.
11. **Variables:** that the MCP links styles to the site's existing variables (`--theme--…`, `--text-colour--…`,
    `--_sizes---page-gutter`, `--font-family--…`) rather than raw values.

## Procedure

1. **Read** this folder; run `node scripts/migration-check.mjs --write` and read the inventory.
2. **Preflight, read only:** the site's pages, components (the globals above), classes (search before creating any:
   the older guide, section 9, lists the risky Osmo names), variables, and the Projects and Services schemas.
3. **Confirm capabilities** (above) and get the user's **decisions** (below).
4. **Styles:** create the classes from `shared/css/service-pages.css` and the page CSS files, in that order, linked to
   the site's variables; breakpoints in Webflow's order (base, 1440, 1920, 991, 767, 479).
5. **Components:** item components first, then section components (properties in the catalogue's order, defaults
   from the first page, slots, variants), then the fixed bar and logo.
6. **Pages:** for each page, a new draft page: page settings (wrapper classes, title, description, canonical
   `/services/<slug>` once live, head code with the JSON-LD), the global instances, then the sections in the order of
   its page file with each instance's content from the page file, the CMS sections, the nav trigger, the Embed and the
   page scripts.
7. **Verify:** `node scripts/compare-pages.cjs --a http://localhost:5190 --b <draft page origin>` (computed styles at
   eight widths); each page file's *Interactions* list by hand; a double-length heading or two per page (resilience);
   phone, tablet and desktop. The local pages are the reference.
8. **Go live** only when the user approves, in the way they choose (replace the old pages at the same slugs; keep
   their SEO settings).

## Open decisions for the user

1. The CMS decisions in [cms.md](cms.md#decisions-for-the-user-before-building-these-sections): row texts (a Services
   "Summary" field, Project Management's taglines, Rural's own sentences), Rural's two-service selection, the services'
   order, Recent Approvals' selection, 3D's project summaries.
2. **FAQ structured data:** each page's head repeats every FAQ in JSON-LD; once clients edit FAQ items in the
   component, the two drift apart. Keep it hand-maintained (and say so in the FAQ component's description), or
   generate it from the page's FAQ items with a small script.
3. **Line breaks** on phones, if Text properties keep them (*Line breaks*).
4. **Fit list title:** Luxury's is bold, Heritage's isn't. Keep or match.
5. **Project Management's floating navigation** shows from the top (see its page file). Keep or align.
6. **How the live pages are replaced** (same slugs, redirects, timing).

## Found while preparing (not changed)

- 3D's "Who we produce visualisations for" has the label "FAQs" (an `h2`) above its heading (an `h3`).
- Heritage: the four "buildings we work with" cards link to `/services/consultation`; the fit note's "Green Belt guide"
  links to `#`; the approval intro links to the old prototype site. Planning's three related-reading links also go to
  `hawkstone-developments-testing.vercel.app`.
- Planning's "Architect-led planning application": item 2's text is a fragment and items 4-6 have Heritage's texts.
- `highlight-text.js` runs on Luxury, Heritage, Planning and Project Management only; 3D's tabs heading has the
  attribute but doesn't animate.
- Some FAQ answers end with an empty paragraph (export leftover).

## What changed locally in this pass (29 October 2026)

- **Component boundaries:** "Looking for something else?" moved out of the fit section (Luxury, Heritage, Project
  Management) and the Who We Work With section (Rural) into sections of their own, with spacing combos that reproduce
  the old gaps (`is-after-fit`, `is-rural`); the floating navigation's trigger moved from the sections into a page
  marker; each Luxury route (photo panel + text panel) wrapped in one `h-process_route`.
- **CMS readiness:** service row numbers by a CSS counter; service names without hand-set line breaks (min-content
  width wraps them the same way); a Services row is one Collection Item.
- **Slot readiness:** tab names inside their panels; step names, ARIA ids and the open tab/card from the scripts (the
  first tier card opens without animating, as when it was marked in the markup).
- **Editability and resilience:** sticky-card texts all Rich Text; Heritage's fit note one paragraph with an inline
  link; feature pill labels wrap inside their pill below 992px instead of running off the screen.
- **Annotations and tooling:** `data-migrate-*` on every section, slot and item; `scripts/migration-check.mjs`.
- Verified against a copy of the pages from before the pass (viewport screenshots at 1440, 991, 767 and 390px, 15
  scroll positions per page). The one intended change: below 768px "Planning Applications" and "Project Management"
  in the service rows now wrap to two lines like the other names (+60px on Luxury and Heritage phones). The check
  caught one regression, since fixed: the tiers' first card animated open after load, so the stacking project panels
  below measured the page 194px short at 991px. What remains is anti-aliasing (a few hundred pixels), a photo's decode
  timing, and the global Client Success carousel's animation state in the frozen-clock capture (identical in real
  time; the untouched pages vary the same way from run to run).

## Design and content pass (29 October 2026, later)

- **Hero H1s:** each H1 keeps its exact wording as one heading, with its key phrase in the accent serif italic
  (Service Hero in the catalogue; the phrases are in each page file); the surrounding words at 80% white.
  `service-hero.js` keeps the H1 and supporting text level.
- **Hero buttons:** "Free Consultation" on all six.
- **Recent Projects:** every panel shows a short description under the name, 3D's treatment, now the shared style
  (the `is-described` combo is gone; CMS: the Projects Summary field, decision 5 in [cms.md](cms.md)).
- **Rural:** "Types of projects we work with"; a fourth planning card, Farm diversification; the third client type
  now includes commercial and industrial schemes.
- **Planning:** project names under the Recent Approvals cards, corners .3em; route cards 7 (Pre-applications) and 8
  (Permission in principle and technical details consent).
