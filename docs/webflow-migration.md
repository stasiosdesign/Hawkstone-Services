# Webflow migration guide

How the local service pages map onto Webflow, for the day the six pages are deleted in Webflow and rebuilt from this code through the Webflow MCP. Nothing here has been done in Webflow yet.

The refactor changed structure only. Every element on all six pages has the same computed style as the Webflow export at 1920, 1440, 1280, 991, 768, 767, 479 and 375 px, with JavaScript off and on (`scripts/compare-pages.cjs`).

## 1. Three layers

| Layer | Local files | In Webflow | Rule |
|---|---|---|---|
| **Global**: the rest of the website | `global/` | Already exists, used by every page | Never edit. Reuse as-is. |
| **Shared**: the six service pages | `shared/` | New classes, components and custom code | Edit here, and the change reaches all six pages. |
| **Page**: one service page | `services/<page>.html`, `services/css/<page>.css` | That page's own classes and content | Edit freely; no other page is affected. |

- `global/css/hawkstone-developments-staging.webflow.css` is the Webflow stylesheet minus the rules for classes used only by these six pages (about 400 rules moved out). Everything left is used by other pages.
- `global/partials/` holds the global components, copied verbatim: Navigation Desktop, Navigation [2] (floating), Global Code, Page Transition, Section - Testimonials (Client Success), Section - Final CTA and Section - Footer, plus the site head and footer code. `serve.ps1` includes them and adds `w--current` to current-page links, as Webflow does.
- A class counts as global when any page outside the six uses it, which was checked across the whole export. That includes the older pages still in the export: Overview, Consultation, Design & Build, Planning, the old barn conversion page and the location pages.

## 2. Naming conventions

The site's style guide is Finsweet Client-First, so new classes follow it:

| Kind | Pattern | Examples |
|---|---|---|
| Shared block | `service-[block]` and `service-[block]_[element]` | `service-hero`, `service-hero_content`, `service-fit_col`, `service-steps_badge` |
| Variant of a global class, for the service pages | combo `is-service` or `is-service-[role]` | `section is-service-split`, `row is-service-split`, `sticky-steps is-service`, `text-size-medium is-service-intro` |
| Variant of a shared block | combo `is-[variant]` | `service-fit_col is-alt`, `service-timeline_media is-wide`, `bouncy-tabs__button is-dark` |
| Page-only block | `[page]-[block]_[element]`, with pages `rural`, `heritage`, `luxury`, `planning`, `visuals` and `pm` | `rural-showcase_card`, `planning-intro_heading`, `pm-gap_grid`, `visuals-lead` |
| Page-only variant | combo `is-[page]` | `container is-service-intro is-rural`, `service-pathway_number is-planning` |
| Osmo effect components | unchanged `block__element` | `radial-gsap-slider__item`, `step-timeline__p`, `bouncy-tabs__item` |

Osmo classes keep their names because their scripts, embed CSS and Osmo's documentation use them. Their redundant combos were folded in: `step-timeline__p is-feas is-rural` is now just `step-timeline__p`.

Every rename is listed in [class-map.md](class-map.md).

## 3. What changed

- **Webflow auto-names replaced:** `div-block-78` became `service-hero_actions`, `div-block-79` became `service-pathway_icon`, `div-block-119` became `rural-showcase_content`, the fourteen `_2-1-left-black-text-*` combos became one `is-stacked` combo, `_2222` became `is-service-tabs`, `v2222` became `is-planning-split`, `cover-image-2` became `spatial-gsap-slider__img`, and `svg-9` and `svg-10` became `service-pathway_arrow` and `rural-showcase_card-icon`.
- **Misleading names replaced:**
  - `barn-page`, `luxury`, `listed-buildings`, `is-lux` and `is-rural` were used on pages they don't describe.
  - `final-cta-*` and `mwg018-card` are the Rural showcase cards, not the Final CTA.
  - Typos: `servcie-page-varient`, `heading-style-h1-brand-plannign-page`, `statment_plan-approved-copy`.
- **Empty combos removed:** combos with no styles of their own, such as `is-lux`, `is-plan` and `is-rural` on the hero, `luxury` on sections, and several `_2-1-left-black-text-*`.
- **Duplicates merged:**
  - The two stacked sub-heading variants (`_2-1-…` and `_2-1-…-8`) became one.
  - The two timeline image-sync embeds became one file.
  - The six copies of the spatial slider script became one; Planning's copy lacked only a plugin registration that Global Code already does.
- **Leaky custom CSS moved into native combos.** The Services Pages CSS component overrode global classes for any element inside `.page-wrapper`. These are now native classes:
  - `container blog-page is-service-split` (from `.page-wrapper .container.blog-page`)
  - `row is-service-split` (from `.page-wrapper .row.info-block`)
  - `layered-slider is-service` (from `.page-wrapper .layered-slider`)
  - `text-rich-text-styled is-service` plus nested "All Paragraphs / All List Items" styles at 991 px (from `.page-wrapper .text-rich-text-styled p, li`)
  - `section background-color-black v2 is-heritage` (from `.section.background-color-black.v2`)
  - `text-size-x-large is-service-intro` (from `.container.services-page .text-size-x-large`)
- **Obsolete CSS removed** after checking nothing on the six pages uses it: `.demo-card` rules (no such element), and the Designer-only overlap-slider rule.
- **One reset added:** the "alt" fit marker became a combo of `service-fit_marker`, so it sets `-webkit-text-stroke-color: currentcolor` to cancel the base value. It's invisible either way, because there's no stroke width.

## 3a. Responsive design pass (after the refactor)

After the refactor was verified identical to the export, a design pass improved the pages across breakpoints. These are deliberate visual changes, all in service classes and service custom code; no global class or component changed.

- **Mobile and tablet logo:** a new shared component, `shared/partials/service-logo.html` (`a.service-logo` > `img.service-logo_img`). It's hidden above 991px. From 991px down, where the global floating navigation replaces the desktop nav and has no logo, it's fixed top-left and aligned with that nav's buttons (3em/2em at tablet, 1.1em at mobile, 5em tall). It uses the white logo with `mix-blend-mode: difference`, so it reads on light and dark sections. In Webflow: a "Service Logo" component on each service page.
- **Readable sizes from 991px down:** the site's type scale shrinks its base size to 6px at 480px and 7.7px at 768px, which made body copy 9 to 13px. Service text classes now use `font-size: max(<em size>, 15px)` (16 to 20px for larger text and headings) in their 991/767 styles, so they keep the em sizing where it's bigger. Classes affected:
  - shared: `bouncy-tabs__para`, `bouncy-tabs__button`, `bouncy-tabs__heading`, `service-fit_body`, `service-fit_title`, `service-fit_note-text`, `service-steps_title`, `service-steps_cta-text`, `service-cta_text`, `step-timeline__content-h`, rich text paragraphs and list items;
  - page classes: the `pm-*` text classes, `visuals-lead` and `rural-showcase_card-label`.
- **New combos:**
  - `text-size-medium is-service-faq` (FAQ questions, with the same floors as the intro labels);
  - `heading-statement is-service-statement` (smaller on phones);
  - `accordion-css is-service` and `accordion-css process-home is-service` (capped at 1800px and centred, so FAQ and process rows don't run edge to edge on large monitors);
  - `page-wrapper is-service` (scope for the service typography CSS; Rural keeps `is-rural`).
- **Line length:** rich text is capped at `max-width: 64em` (about 70 characters per line). Pathway card text gets line height 1.4 and a 36em cap below 992px. Sticky-steps paragraphs are capped at 38em below 992px.
- **Large screens:** the global `.container` already centres content at 1800px, and the site's type stops scaling at 1800px. On monitors 1920px and wider, the sticky-steps text column is padded to end at that same 1800px column while the image half stays full-bleed (`sticky-steps.css`). Hero sliders, the radial showcase, project sliders and section backgrounds stay full width, as visual elements.
- **Wrapping:** `shared/custom-css/service-typography.css` (included on all six pages) adds `text-wrap: balance` to headings and `text-wrap: pretty` to paragraphs in the service sections. Designer has no control for this, so it stays an Embed. It also sets a 15px floor for the Process Step component's text at 480 to 767px.
- **Smaller fixes:**
  - Rural's showcase heading had no side padding below 480px.
  - Planning's dark intro heading is smaller on phones.
  - The section intro paragraph is lighter on phones.
  - A forced line break was removed from "Is this the right service for your project?" (Heritage, Luxury).

**Left alone (global):** the button labels inside the Main CTA component, and the Sub Heading labels, are still 9 to 11px between 480 and 767px. The cause is the site-wide scaling in Global Code: the base size jumps from 12.8px at 479px to 6px at 480px. It affects every page, so fixing it means changing the global Osmo scaling settings, and that's a decision for the whole site.

## 3b. Hero redesign and fixed consultation bar

A first design iteration replaced the hero and added a fixed call to action. The copy is unchanged; only layout and presentation changed.

- **Service Hero** (`shared/partials/service-hero.html`):
  - **Layout:** a full-section background image (`img.service-hero_image`, object-fit cover) under a gradient that darkens towards the bottom (`service-hero_overlay`). At the bottom of the section, `service-hero_content` is a two-column grid with a white top rule: the H1 on the left, and on the right `service-hero_aside` with the supporting text and a "Book a free consultation" button. The columns stack below 992px.
  - **Classes:** the H1 keeps `heading-style-h1-normal is-service-hero` (white, left-aligned). The supporting text gets a new combo, `text-size-small service-page is-service-hero` (pure white with a soft text shadow). The hero button is an instance of the global **Main CTA** component, white variant, unchanged (white text box plus white arrow square, the site's text-reveal and arrow hover). The instance carries the attribute `data-service-hero-cta` so the script can watch it.
  - **Content:** each page passes its own `heading` and `text`. All six use the same temporary image, `images/hero-farmhouse-aerial-{960,1600,2560}.avif`, made from `Yoxall-Drone-9.avif` in the export.
  - **In Webflow:** a component with heading, text and image properties.
- **Removed:** the Osmo spatial slider (its markup, the `spatial-gsap-slider*` classes, `spatial-slider.css` and `spatial-slider.js`), the hero's own CTA, and the old `service-hero_heading-wrap` and `service-hero_actions` classes.
- **Desktop navigation:** the service pages now use the Navigation Desktop component's existing **white-text** variant, as on the Home page, so the nav reads over the photo. That's an instance setting; the component itself is unchanged. Locally it's `global/partials/navigation-desktop-white-text.html`.
- **Service CTA Bar** (`shared/partials/service-cta-bar.html`):
  - **Layout:** fixed at the bottom centre of the viewport on every page. It holds the consultation button ("Book a free consultation", linking to `/contact`, the old hero CTA's destination) and `button.service-cta-bar_top` (square, up arrow), which sits where the Main CTA's arrow square would be.
  - **Consultation button:** built from the global Main CTA classes without the arrow square: `a.wrapper_cta.is-glass` (with `data-btn-icon-link`) > `btn-icon-content cta is-glass` > `btn-icon-content__mask cta buton is-glass` > `span.btn-icon-content__text`, plus `btn-icon-content__bg cta is-glass`. So it has the site's font, weight (Poppins 500), size and the text-reveal hover from the global "Button with Rotating Icon" code. The `is-glass` combos give the dark glass surface: a translucent dark fill, a faint diagonal highlight, a hairline border with an inner top highlight, and `backdrop-filter: blur(16px) saturate(170%) brightness(.7)`. The back-to-top button uses the same surface. The global classes themselves are unchanged.
  - **Why not a Main CTA instance:** the Main CTA always shows its arrow square, and adding a glass variant would change a global component. In Webflow, build the bar's button as plain elements with these classes (not a component instance). `backdrop-filter` can be set in Designer (Effects → Backdrop filters).
  - **Behaviour:** `shared/custom-js/service-cta-bar.js` toggles the `is-hidden` combo; the bar starts hidden in the markup. It appears once the hero's own button has scrolled out of view, and hides again while the footer is in view (IntersectionObserver on both). The back-to-top button shows once the page has scrolled half a screen, and scrolls smoothly to the top through Lenis.
  - **In Webflow:** a component with the classes `service-cta-bar`, `service-cta-bar is-hidden`, `service-cta-bar_top`, `service-cta-bar_top is-hidden` and the `is-glass` combos above, plus the script in each page's footer code.

## 3c. Temporary images, tabs fix and Recent Projects

- **Temporary images:** every image on the six pages that was a grey placeholder now shows the hero photo, `images/hero-farmhouse-aerial-1600.avif`. That's 152 `<img>` elements, all pointing at the same file (one download). Each one is an ordinary image element whose class already crops with `object-fit: cover`, so the boxes keep their sizes and ratios; this was measured before and after at 1440 and 375px, with no change. To replace them later, change each image's source; no classes depend on the file. The global footer's service tiles still use `placeholder.svg`, because the footer is global. In Webflow, the real images come from the CMS or the asset library.
- **Bouncy tabs fix** (`shared/custom-js/bouncy-tabs.js`, used on Luxury, Planning and 3D):
  - **Cause:** the panels are stacked in the same place (absolutely positioned), and the script faded the outgoing panel out and the incoming one in at the same time. The incoming panel started at 60% of the outgoing fade, and the outgoing fade used an ease-in, so it was still about half visible. For roughly 100ms both panels' headings, paragraphs and images showed on top of each other, sliding in opposite directions.
  - **Fix:** the outgoing panel now fades out completely (0.2s, ease-out, half the slide) before the incoming one fades in (0.45s). A new change kills the previous change's timeline outright, so quick clicks never leave two panels showing. Checked frame by frame at 1440 and 375px, and with rapid click sequences on all three pages: one panel visible at every frame.
  - **Planning markup:** two of Planning's six tabs ("Submission" and "Decision") were `<a href="#" class="bouncy-tabs__button is-dark w-button">` links, while the rest were `<button>`s. They now match as `<button>`s, so they don't rely on webflow.js to stop the `#` link from navigating.
- **Recent Projects (CMS):** see section 7a (since replaced by the Service Projects cards, 3g).

## 3d. Rural Conversions: building types as Osmo Expanding Feature Pills

Rural Conversions only. The Osmo radial cards slider (the ring of building-type cards) is replaced by Osmo Supply's **Expanding Feature Pills**.

- **Section** (`section is-rural-showcase`): the existing rotating headline ("Every barn presents a different … problem. That's where we start.") sits above the component in `rural-showcase_content`. It is now an `h2` (same classes and attributes), because the hero holds the page's `h1`. Below the component is the existing "Free feasibility consultation" Main CTA in `rural-showcase_actions is-after-pills`.
- **Items:** one pill per building type, in the slider's order: Stable block, Steel portal frame, Dutch barn, Farm outbuilding, Stone threshing barn (the slider repeated these five round its ring). Only Steel portal frame has a description, a sentence already on the page; the other four show just their name when open, with an HTML comment marking where a description goes. No copy was invented.
- **Images:** five `data-feature-pills-visual` items (same count and order as the pills) plus the cover image, all the temporary hero photo.
- **Markup:** Osmo's HTML, classes and `data-feature-pills-*` attributes, unchanged, inside a `rural-pills` wrapper. The wrapper centres the component in the page gutter and sets `font-size: max(1.6em, 14px)`, because Osmo sizes the component for 1em = 16px at 1440px and this site's base there is 10px.
- **Native styles** (`services/css/rural-conversions.css`): Osmo's classes as supplied, with three changes:
  - `feature-pills__item-bg` radius is `.3em` instead of `2em`. The collapsed and expanded pill share that element, so both states match.
  - The label and body text get `line-height: 1.35`. This site sets a fixed 10px line-height that the text would otherwise inherit, which made lines overlap.
  - Two combos: `feature-pills__wrap is-rural` keeps the dark card below 992px (Osmo's demo drops it there because its page is dark; on this light page the white text would vanish). `feature-pills__info-list is-rural` uses a 2px smaller column gap below 992px. Osmo's script stores a closed pill's width rounded up to the next pixel, which pushed the second half-width pill onto a new row after closing.
  - Osmo's demo-only `.section-resource` rule is left out.
- **Custom CSS** (`shared/custom-css/feature-pills.css`, page Embed): Osmo's state CSS, unchanged.
- **JavaScript** (`shared/custom-js/feature-pills.js`, Rural's Before `</body>`): Osmo's `initExpandingFeaturePills()`, unchanged (GSAP `back.out(2)`, 0.5s). It needs GSAP 3.15, which the site already loads globally, so no extra script tag.
- **Removed from Rural:** the radial slider markup, the `radial-gsap-slider*` and `rural-showcase_card*` styles, and the `radial-slider` CSS and JS includes. The files `shared/custom-css/radial-slider.css` and `shared/custom-js/radial-slider.js` were moved to the Recycle Bin (no page used them).
- **Checked** at 1920, 1440, 768 and 375px, and with reduced motion. One pill open at a time, the matching image shows, the cover image returns on close, and Escape and the close button reset it. The component returns to its original size after closing, with no horizontal scroll and no new console messages.

## 3e. Editorial sticky cards (Luxury, Rural, Heritage)

One shared component replaces three sections. It's modelled on the Fitosauna "sticky two-column editorial" section: two equal columns across the full width, a 1px divider, a sticky left panel and stacked photo cards on the right.

| Page | Replaces | Left panel | Cards |
|---|---|---|---|
| Luxury Architecture | Numbered steps "Budget and planning certainty before you commit" | heading, plus the old CTA card's text and its Main CTA ("Free Consultation") | 01 Feasibility first, 02 A budget you can hold, 03 Planning strategy, not just an application |
| Rural Conversions | Pathway cards "Barn conversion planning permission: Class Q or full planning" (keeps `id="statement-plan-approved"`) | heading and intro paragraph | 01 Class Q prior approval, 02 Full planning permission, 03 Class R (**placeholder copy**, marked in the markup) |
| Heritage Design | Pathway cards "The buildings we work with" (keeps `data-nav-show-after="true"` for the floating nav) | heading and intro paragraph | 01 Listed buildings, 02 Homes in conservation areas, 03 Locally listed & non-designated heritage assets, 04 Buildings affecting a heritage setting |

All copy is unchanged. The old `<br>` line breaks and `<strong>` tags in titles are dropped, and Rural's heading keeps "Class Q" together with a non-breaking space. Rural's intro still says "There are two routes", although there are now three cards; that's for the final copy. Rural and Heritage cards are link blocks to `/services/consultation`, as the old pathway cards were. Luxury's are plain blocks. Every image is the temporary hero photo.

**Structure** (all native, in `shared/css/service-pages.css` → "Editorial sticky cards"):
```
section.section.is-service-editorial            padding below (combo is-heritage on Heritage adds top padding after the hero)
  div.service-editorial_layout                  grid 1fr 1fr, full width, thin top/bottom rules
    div.service-editorial_left                  1px right border; padding 3em, page gutter on the outer edge
      div.service-editorial_sticky              position: sticky; top: 6em
        h2.service-editorial_heading            5.6em, regular, max-width 10.5em
        p.text-size-regular-copy.is-service-editorial          optional intro
        div.service-editorial_cta (text + Main CTA instance)   optional, Luxury
    div.service-editorial_right                 flex column, 3em gap
      article|a.service-editorial_card
        div.service-editorial_media > img.service-editorial_img     16:10, cover
        div.service-editorial_info              ivory-d1 panel
          h3.service-editorial_title            4.4em, 1px rule below
          div.service-editorial_meta            grid 1fr 1fr
            p.service-editorial_number
            p.text-size-regular-copy.is-service-editorial-card      1px left rule
```

**Behaviour:** the sticky panel holds 60px (6em) below the top of the viewport while the cards scroll, then stops 3em above the end of its section and scrolls away with it. That's CSS `position: sticky`, with no JavaScript. Below 992px the columns stack, the panel stops being sticky, and the card meta becomes a narrow number column next to the text below 768px. This was checked at 1920, 1440, 768 and 375px on all three pages, with no horizontal scroll.

**No longer used** on these pages: Luxury's `service-steps_*` section (Planning and 3D still use it), and Rural and Heritage's pathway cards (Planning, 3D and PM still use them). Rural's `section is-rural-pathways` style was removed.

## 3f. Refinement pass: smaller type, flatter bar, varied images

**Type scale.** Headings and body text on the six pages are smaller, with more distinct steps. Approximate sizes at 1440px:

| Role | Examples | Before | Now |
|---|---|---|---|
| Hero H1 | `heading-style-h1-normal is-service-hero` | 48 | 42 |
| Display headings | editorial heading, projects slider titles, rotating headline, `pm-h2`, Planning intro, Heritage highlight | 45–56 | 36–38 |
| Section headings | `text-size-x-large` (Text Block, Sub Heading), `heading-statement` combos | 40–42 | 32 |
| Lead paragraphs, split headings | `text-size-x-large is-service-intro`, `heading-style-h2-normal resize is-service` | 35–42 | 28 |
| Card and item headings | editorial card titles, bouncy tabs, pathway cards, step timeline, Process Step, fit lists | 21–44 | 18–30 |
| Body copy | rich text, FAQ questions, regular copy, timeline and tab paragraphs | 17–20 | 15–17 |

Buttons, labels and global components (nav, Final CTA, testimonials, footer) are unchanged. Px floors for small screens are kept (body text never below 15px).

**Where the sizes live:**
- Service-owned classes and existing combos: native values in `shared/css/service-pages.css` and `services/css/*.css`.
- New combos (added to the markup): `heading-style-h2-normal resize is-service` (split text headings) and `heading-style-h1-brand-copy _2 is-heritage` (Heritage highlight statement).
- Custom CSS, because these are global component instances that can't take combos: the Text Block heading (`sticky-steps.css`), and the Sub Heading heading and Process Step heading (`service-typography.css`, scoped to `.page-wrapper.is-service`).

**Fixed consultation bar.** It's now flat: a translucent dark fill (`#1111118c`) with `backdrop-filter: blur(14px)`, and no border, gradient, highlight or shadow. The back-to-top square sits to the **left** of the consultation button (first in the markup, with `margin-right`).

**Rural building types (feature pills).**
- The card spans the full width inside the page gutter, at 52em tall on a 13px base.
- It uses the site's dark colour (`--theme--obsidian-d3`), with no outline.
- Corners are near-square: about 2–3px on the card, pills, plus icons and the mobile image. The close button stays a small circle, because Osmo rotates it 45° to make the cross.
- The pill list is aligned left with generous padding, and the pill text is smaller (about 16px).

**Corners.** A census of the six pages at 1440px found no other service-page element rounder than 5px, apart from the slider's thin progress bar.

**Images.** Eight more of the client's own project photos from the export were optimised to 1600px AVIF as `images/temp-*.avif`, for example `temp-house-gable-exterior` and `temp-barn-brick-courtyard`. With the drone photo, these nine cycle through each page's images. The projects slider's background and mask images stay paired per item. They're all temporary; swap each image's source when the final photos are chosen.

## 3g. Projects cards and editorial statements

**Service Projects** (all six pages) replaces the layered projects slider on RC, HD, LA and PA. On 3D and PM it is a new section, placed before the FAQ; 3D keeps its hand-written "Recent work" section unchanged.
- **Header:** a centred small uppercase label ("Projects"), then the heading "Recent Projects" in the brand display font (IvyPresto Headline, `--font-family--brand-font`), using the global `heading-style-h2-brand` with the combo `is-service-projects`.
- **Cards:** edge to edge with 3px gaps. Two cards sit side by side (8:7), with one full-width card below (5:2; 16:10 on tablet). Each card is a link block holding:
  - the photo;
  - a soft bottom gradient;
  - the project name in the brand font (`heading-style-h3-brand is-service-projects`, uppercase);
  - "View Project" in small underlined capitals.
- **Hover:** a slow 3.5% zoom of the photo and a lighter overlay. It sits in `shared/custom-css/service-projects.css`, because a child reacting to its parent's hover has no native Designer control.
- **Phone:** the cards stack in one column, all at 4:4.4.
- **Button:** the global Main CTA (black variant), "View All Projects", linking to `/projects`.
- **Copy:** the label, heading and "View Project" text are all carried over from the old section.
- **Removed:** the slider markup and its `layered-slider is-service` styles. `layered-slider.js` is no longer loaded by any page; the file is still in `shared/custom-js/`.

**Service Statement** (LA, 3D, PM light; HD and PA dark) replaces the five standalone statements:
- Luxury's "Hawkstone is an architectural design…"
- 3D's "Visualisation is not a design service…"
- PM's construction-stage statement
- Heritage's highlight
- Planning's intro

The copy is unchanged. So are the `data-highlight-*` attributes, the section `id`/`data-nav-show-after` attributes and the CTAs.

Each statement is in the brand font, light, left-aligned, at 42px (1440), up to about 26em wide. It sits on a tinted band (`--theme--ivory-d1`, or `--theme--obsidian-d3` with `is-dark`) with 16em of padding top and bottom, inset 12em from the left. Under the text, `service-statement_meta` holds:
- the label (yellow dot plus small uppercase text, `text-size-regular is-service-statement`), which used to sit above the statement;
- PM's note;
- the CTA, where there is one.

Planning keeps less space below (`is-planning`), because it runs into the dark Recent approvals section.

The old `heading-statement is-service-statement`/`is-pm`, `planning-intro_heading`, `section is-planning-intro` and Heritage highlight styles were removed.

## 3h. Cleanup pass: smoother scrolling, slimmer markup, solid bar

- **Scroll smoothness.** Tracing a full wheel-scroll showed the temporary photos as the main new cost. They were 1600px AVIF files (some portrait), decoded as they entered the viewport: about 210ms per Rural scroll, with single decodes up to 45ms, enough to drop two or three frames.
  - The photos are now 3:2 crops at 800 and 1400px (`images/temp-*-800.avif` / `-1400.avif`).
  - Every page image has `srcset`, `sizes` and `decoding="async"`. The drone photo uses its 960 and 1600 versions.
  - Result: Rural's decode time halved, and no single decode is over about 20ms.
  - Webflow generates responsive `srcset` for uploaded images, so production behaves the same way.
  - The old 1600px temp files were moved to the Recycle Bin.
  - Script and style cost per scroll matches the original pages; it comes from the global code (Lenis smooth scroll and the site's ScrollTrigger effects), which these pages don't change.
- **Fewer elements:**
  - Editorial cards lost their image wrapper (`service-editorial_media`). The `img.service-editorial_img` now carries the 16:10 ratio itself.
  - Project cards lost their overlay div. The gradient now sits on `service-projects_info`, which covers the card.
  - The bar's back-to-top uses the site's `arrow-white.svg` (turned 45° to point up) instead of an inline SVG.
  - Most remaining DOM weight is global: the nav and global code (about 430 nodes), footer (about 190) and testimonials (about 110).
- **Fixed consultation bar:** solid, like the site's black Main CTA. `wrapper_cta is-dark` and the `btn-icon-content … is-dark` combos are black, with the text-reveal hover. The back-to-top square on the left matches the Main CTA's arrow square (4.8em, black, .15em corners), with a smaller arrow (1.3em). There's no blur or translucency any more.
- **Type:** every service-owned text size is about 6% smaller again. Small labels, numbers and buttons are unchanged, and the body px floors stay.
- **Reading text restored (follow-up):**
  - Long-form text (split sections, FAQ answers, timeline, tab, fit list and PM paragraphs, section intros) is back to 16–18px at 1440, with line spacing of 1.5–1.65 at every size. The rich text was previously open (1.5) only below 992px.
  - Only compact text stays smaller: card text, pills, labels and numbers.
  - A cascade bug was fixed: the rich-text desktop size had been placed after its tablet rule.
- **Editorial cards:** the number column is a fixed 7em, so the divider sits close to the number and the description runs wider over fewer lines.
- **Projects:** "Recent Projects" and the card titles are in title case, not capitals.
- **Hero headings:** the forced `<br>` breaks were removed on all six pages, so balanced wrapping sets the lines. 3D's heading now reads "Architectural Visualisation & 3D CGI for Residential Projects", at the user's request.

## 3i. Code cleanup (no visual change)

- **Dead scripts removed from pages:** `line-reveal-testimonials.js` (Heritage, Luxury, 3D, PM: none has its `data-testimonial-*` markup; Client Success uses the global centred slider), `sticky-steps.js` on Project Management and `overlapping-slider.js` on Planning. See section 6.
- **Unused CSS removed:** `service-steps_cta-text` (the numbered steps CTA card no longer has text).
- **Rule moved:** `.text-rich-text-styled.is-service { max-width: 64em }` sat at the end of the Numbered steps block; it now opens the rich text rules in Split text. Same specificity as before and no competing rule, so the cascade is unchanged.
- Checked with `scripts/compare-pages.cjs` against a copy of the pages taken before the cleanup: identical at all eight widths, JavaScript off and on.

## 3j. Editorial refinement pass (all six pages)

A design pass on 18 October 2026, informed by three references (Fluid Glass, Telha Clarke's process page and Tandem). Palette, font families, copy, links, section order and the Osmo components are unchanged; the copy is keyword-optimised and must not be reworded. Three ideas run through the six pages:

- **Fine rules instead of boxes** for information sections (fit lists, numbered steps, inline CTAs), as on Telha Clarke.
- **Centred statements**: a small label above, a large statement in the brand font with a controlled measure, a compact note or action below (Fluid Glass, Tandem).
- **One process composition**: a 3:2 image group on the left, the timeline line as the separation channel, a narrow reading column on the right (Fluid Glass).

What stayed as it was: the hero, the sticky steps (photo and black panel), the projects grid, the pathway cards, the accordions, the Rural feature pills, the Planning flick cards and the Project Management page's own sections.

Changes, in `shared/css/service-pages.css` unless noted:

- **Service Statement** (LA, HD, PA, 3D, PM): centred. The label sits above the text in a new combo, `label-wrapeper is-service-statement` (the markup moved on Luxury, 3D and PM); `service-statement_meta` keeps the note or CTA underneath, centred. Statement 4.4em (44px at 1440, 3.76em at tablet, 2.5em on phones), max-width 22.5em, line-height 1.12; band padding 15em. Planning's `is-planning` keeps 6em below, where the dark Recent approvals follows.
- **Step timeline** (RC, LA, PA, 3D): `service-timeline_media is-square` now matches `is-wide` (3:2, 51.5em, no offset), so Luxury and Planning lose their small square images; both combos stay for the Webflow rebuild. Items 12em apart, step heading 2.4em, reading column max 34em, inactive items at .35 opacity (`step-timeline.css`, `step-timeline-media.css`); the container keeps 8em below and the intro section 10em above.
- **Split text**: headings 3em with line-height 1.1 (the section-heading role); the section has 4em above and 10em below.
- **Fit lists** (HD, LA, 3D): `service-fit_grid` is a two-column grid with an 8em gap; `service-fit_col` has no card any more (no fill, border or radius), only a top rule and 3.2em above; titles 2.1em; the `is-alt` column keeps its lighter colour. Section padding 12em.
- **Numbered steps** (PA, 3D): `service-steps_item` is a ruled row (top rule, 3.2em above and below, no fill; `is-first` has no rule on desktop, where the heading sits beside it, and gets one back below 992px). `service-steps_row` is a grid of badge, title and body (`3em | 1fr | 1.5fr`), collapsing to badge and title with the body underneath below 992px. `service-steps_cta` is a ruled row; Planning's button is now the black Main CTA variant. 3D's title-less rows ("What you receive") use `service-steps_row is-visuals` (`services/css/3d-visualisations.css`) so the text follows the number.
- **Inline CTA** (`service-cta`, HD and 3D): top and bottom rules instead of a bordered box; text 2.2em, max 24em.
- **Bouncy tabs** (LA, PA, 3D): the panel has no background, border or padding (light and dark); height 54em (auto, min 60em, on phones); the image takes 50% of the panel with an 8em gap; heading 2.6em; paragraph max 28em.
- **Editorial sticky cards** (RC, HD, LA): a 5/7 split instead of 1/1; heading 3.4em, max 12em, line-height 1.05 (Rural's heading no longer breaks after "planning"); card title 2.6em; number column 6em; card text 1.6em with 1.5 line spacing; info padding 2.4em 2.4em 3.6em.
- **Projects**: 14em above, 10em below, header 6em above the cards.
- **Rural**: the CTA after the pills has 6em above and 12em below; the dark design rows start 8em from the top of their section.

Checked in headless Edge at 1440, 768 and 390px on all six pages, scrolling through each page: no horizontal overflow, no clipped text in the reworked sections, and the same console message at phone widths as before the pass (it comes from a global script).

## 3k. Fluid Glass pass (all six pages)

Two passes on 18 October 2026. The first, from the `design-reference-pack` brief, rebuilt the card sections as Telha Clarke editorial rows; the user then asked for sections copied as closely as possible from fluid.glass (its screenshots of the "Our process" slides and the "Services" rows), with our copy. Copy, palette, font families, links, section order, the remaining Osmo interactions and the global components are unchanged. Recent Projects was restored to its previous two-plus-one grid at the user's request.

- **Process slides** (Fluid "Our process"; RC, LA, PA, 3D) replace the Osmo step timeline. `section.is-service-process` is a dark band (`--theme--obsidian-d3`): the section intro under a rule (`service-intro is-dark`, label columns 1-4, statement columns 7-12 in `--theme--ivory-d3`), then `service-process` > one `service-process_slide` per step. A slide is a 12-column grid at `min-height: 100svh`, `position: sticky; top: 0`, so each slide stacks over the previous one as the page scrolls (the vertical equivalent of Fluid's pinned horizontal sequence, no JavaScript). The composed photo pair `service-visual is-process` sits in columns 2-5 and the reading group `service-process_reading` (`service-process_index`, `service-process_heading` 4.6em, `service-process_text`) in columns 8-11; the combo `is-reverse` on alternate slides swaps them (reading 3-6, photos 8-11). The last step is `is-final`: centred index and heading, `service-process_strip` (seven frames, `is-wide` 1.75:1 and `is-tall` .68:1 alternating, wider than the viewport and clipped) and the text centred beneath. 3D's lead paragraph follows as `visuals-lead is-dark`. Below 992px the slides are ordinary blocks: reading group, then the photo group (max 460px). Gone from the pages: the `step-timeline` embeds and script, `service-timeline_*`, `container is-service-timeline` and `section is-service-timeline`. The Osmo files `step-timeline.css`, `step-timeline-media.css` and `step-timeline.js` are no longer loaded by any page.
- **Sticky steps** (Fluid "1. Design phase"; RC, HD, LA, 3D): the sticky left half holds a composed photo pair instead of a full-bleed cover: the existing `sticky-steps__cover-image` becomes the primary frame (52% wide, 4:5, at 13%/12svh) and a second image with the combo `is-secondary` the supporting frame (41% wide, bottom-right). The reading column is 6em in from the centre with the heading at 3.8em (11em max) and the paragraph at 27em. All of it is custom CSS in `sticky-steps.css` scoped to `.sticky-steps.is-service`, because the markup is the global Text Block component. Below 992px the pair is a .857 block with the primary at 62% and the secondary at 48%.
- **Rows** (Fluid "Services" rows, the "After Care" screenshot): a fine rule, a medium-weight title in the left third, the text from the sixth column, a small hollow diamond before each list item.
  - Split rows (RC, HD, PA, 3D): `heading-style-h2-normal resize is-service` is now 2.2em at weight 500; the heading column stays `col-lg-4`, the text column is `col-lg-7`.
  - Fit lists (HD, LA, 3D, PM): the header keeps the label in columns 1-4 and `service-fit_heading` (4em) in columns 6-12; `service-fit_details` spans the full content width and each `service-fit_row` is a 5/7 grid (title 2em weight 500, list). `service-fit_marker` is an empty div drawn as a rotated bordered square. `service-fit_note` stays in columns 6-12.
  - Numbered steps (PA, 3D): `service-steps_head` (rule, `service-steps_heading` 4em in columns 6-12, 3D's `visuals-lead is-steps` under it) then `service-steps_list` of full-width `service-steps_item` rows, each `service-steps_row` a `3em | 4fr | 7fr` grid of plain index (`service-steps_badge` > `service-steps_number`, no dark badge), title (2em, 500) and text; `is-visuals` rows are `3em | 1fr`. The old split-row wrapper around the steps is gone.
- **Statements** (Tandem): 5.2em at a 20em measure on the page background (no ivory band; `is-dark` keeps the dark one), 20em of clearance above and below.
- **Heroes**: the H1 is 5.4em at a 12em measure, line-height 1, on a 7/5 grid with the text and button bottom-aligned beside it.
- **Section intros** (PA accordion, 3D intros): `service-intro` grid, statement 4em in columns 7-12 (5-12 at tablet).
- **Rural headline**: the rotating headline is 5.4em (clamped by viewport) inside a 22em inset, so it reads as the section's main shape.
- **Editorial rows** (Telha Clarke, from the first pass; RC, HD, LA, PA, 3D, PM): heading 4.8em, row titles 3.8em.
- **Unchanged**: Recent Projects (restored), the accordions and FAQ, Rural's feature pills, Planning's flick cards, PM's gap and scope sections, the inline CTA, the bouncy-tab panels (12-column: photo columns 1-6, text 8-12).

Checked in headless Edge at 1440, 768 and 390px on all six pages (no horizontal overflow, no new console messages) and by wheel-scrolling the Rural process sequence at 1440×900 with Lenis active: slide 01 holds with its photos and reading group, slide 02 (reversed) slides over it, slide 03 is the centred strip.

## 3l. Webflow readiness pass (no visual change)

19 October 2026. Preparation only: nothing was migrated, and nothing in Webflow was touched.

- **Projects section as one partial.** The six identical copies of the Projects markup became `shared/partials/service-projects.html`. Each page now passes only its temporary data (three slugs, names and image prefixes, plus `label` and `black` on Rural). The partial's header records the CMS binding. `serve.ps1` gained `{{^name}}…{{/name}}` (kept only when a parameter is *not* set), used to choose the white or black Main CTA variant.
- **Scripts made safe to paste into an existing site.** The seven Osmo effect files (sticky-steps, feature-pills, rotating-text, bouncy-tabs, highlight-text, flick-cards, swiper-slider) declared global functions such as `initFlickCards` and `go`. Each now runs inside its own function with a run-once flag (`window.HawkstoneService.<effect>`), and its header lists what it needs and the hooks it reads. Two headers named the wrong pages and were corrected. The effect code itself is unchanged.
- **Swiper pinned** to 12.2.0 on Luxury (it was `swiper@12`, which follows new releases; 12.2.0 is the version it was resolving to).
- **CMS notes** in the Projects partial and on Planning's Recent approvals. Section 7a is rewritten for the real Project Type relationship. The tables in section 6 are corrected.
- **Checked:** the rendered HTML of all six pages is identical to before, apart from comments. Headless Edge at 1440, 768 and 390 px: no console errors, the effects initialise, and the projects grid measures the same.

## 3m. Luxury: "Looking for something else?" as editorial rows

23 October 2026, Luxury Architecture only. The five portrait service cards (`service-other_*`, still used on Heritage and Project Management) are replaced by a copy of the Services rows on graphichunters.com, measured from the live site at 1920px. Its unit (1/144 of the viewport) is this site's em, so the measurements carry over directly.

- **Structure:** `luxury-other` sits after the fit section's container and runs full width. It has a header (the existing heading and intro, ruled below) and `luxury-other_list`. Each row is a link block, `luxury-other_row`: a grid of `luxury-other_index` (8.8em), `luxury-other_title` (IvyPresto, 5.6em, line-height .9), `luxury-other_tags` (monospace, 1.2em), `luxury-other_text` (Poppins 500, 2em, line-height 1.05) and `luxury-other_media` (4:3, 25.8em, far right), with `luxury-other_shade` and `luxury-other_rule` inside. Rows run 2em past each edge, so their turned corners never show; the list clips them.
- **Content:** each service's existing tagline (from the navigation) and its page's meta description; each page's hero photo (temporary). No new copy.
- **Motion** (`shared/custom-js/luxury-other.js`, 768px and up, off with reduced motion): rows 2-5 start stacked behind row 1, turned -5°, -10°… under a dark top shade, and fan out as the list scrolls in. The scrub runs from the list's top at 75% of the viewport to 12% above it, power2.out, matching the reference's measured progress.
- **Responsive:** below 992px the tags move under the title and the photo column narrows. Below 768px each row is title (index at top right), description, then tags, and the photo is hidden, as on the reference.
- **Classes:** in `services/css/luxury-architecture.css`. The link block needs `max-width: none` to override `w-inline-block`, or the negative margins collapse.
- **Refinement (23 Oct 2026, supersedes the column measurements above):** the block now sits on the fit section's 12-column grid (container edge `--lo-edge`, 2em gaps).
  - **Columns:** heading, intro and descriptions from column 6, level with "Is this the right service for your project?"; numbers in column 1; titles in columns 2-4 (4.8em, was 5.6em); "View Service" in column 5; photos in columns 10-12. The rules span the container.
  - **Intro:** reads "Explore other services or book a free consultation…", with "book a free consultation" linking to `/contact` (`luxury-other_inline-link`).
  - **Links:** rows are plain divs now. The taglines became `luxury-other_link` ("View Service" with a small arrow, linking to the service), and its `::after` stretches over the row so the whole row stays clickable (`shared/custom-css/luxury-other.css`).
  - **Tablet:** the link sits under the title.
- **Final pass (23 Oct 2026):**
  - **Heading:** forced onto two lines ("Looking for / something else?", kept in sentence case), with 7em between the intro and the rows.
  - **Titles:** 4.3em, with breaks after "Rural", "Heritage" and "3D".
  - **Descriptions:** 1.75em, line-height 1.12.
  - **Link:** "View Service" is replaced by the site's Main CTA arrow (`arrow-black.svg`), centred in column 5, the gap between title and description, and level with the title's first line. It turns to point right on row hover. On tablets it stays in column 5; on phones it sits under the description.
  - **Process intro:** `luxury-process_intro` is the card height (`min-height: 65em`) with its content centred, so the group sits on the cards' centre line.
  - **Buttons:** square, radius .15em, as on the Main CTA squares.

## 3n. Consultation bar hover, Luxury budget band, Luxury process carousel

23 October 2026.

- **Service CTA Bar hover (all six pages):** the yellow square is gone. On hover the label stays white, the arrow square turns white (`--neutral--white`) and the white arrow turns black (`filter: invert(1)`; Designer: Effects → Filters → Invert 100%). The transitions are unchanged in length (.3s).
- **Budget and planning certainty (Luxury):** combos `section service-cards is-luxury` (band `--theme--ivory-d1`), `service-cards_layout is-luxury` (no top rule) and `service-cards_card is-luxury` (cards `--theme--ivory-d2`). The shared classes are unchanged on the other pages.
- **From first conversation to completion (Luxury):** the Osmo step-card slider becomes `section luxury-process`, styled in `services/css/luxury-architecture.css`.
  - **Composition** (from the Glide carousel section): the intro (label, heading, the user's lead sentence, two round buttons) in a 46em column at the page gutter. The carousel fills the rest of the row and runs off the right edge of the screen.
  - **Cards** (from the "People Before Protocols" card): 44em wide portrait cards (44:65), radius 1em, a full-bleed photo, and an inset white panel (radius .7em) holding the number, the IvyPresto title, the text and the step's points.
  - **Pagination:** under the cards. The current step shows as a pill with its name, the others as dots.
  - **Script:** `shared/custom-js/luxury-process.js` runs Swiper 12.2.0 with snapping, the buttons, drag and touch swipe, and the arrow keys. At the end, the last step is current.
  - **Responsive:** below 992px the intro sits above a full-bleed carousel. Below 768px the cards are the screen width minus the gutters and 3.6em, so the next card peeks in.
  - **Copy:** the six steps' titles, text and points are unchanged.
- **No longer loaded:** `swiper-slider.js` and `swiper-slider.css` (Luxury was their only page), and the `service-step-cards*` classes in `shared/css/service-pages.css`. The Swiper CDN files stay for the carousel. The Swiper slide width uses `swiper-slide luxury-process_slide`, because the CDN stylesheet loads after the page CSS.

## 3o. Rural: barn-types heading and expanding planning cards

23 October 2026, Rural Conversions only. Copy unchanged.

- **Building types:** `h3.rural-pills_heading` ("Types of barns we work with", sentence case) sits inside the black feature-pills box, first in `feature-pills__info-collection`, above the pills. Osmo's script doesn't read that container's children.
- **Planning routes:** the three link cards (`rc-route*`) are replaced by expanding photo cards (`rc-plan*`, styled in `services/css/rural-conversions.css`). They are no longer links to `/services/consultation`, and the arrows are gone.
  - **Desktop:** a row 64em tall. The open card has flex-grow 2.4 and the others 1; the open card shows number, title and text, the collapsed ones only number and title, slightly dimmed.
  - **Script:** `shared/custom-js/rc-plan.js` opens a card on mouse hover, keyboard focus or tap. It moves the flex-grow values on a spring just over critical damping (stiffness 170): no overshoot, settled in about 0.85s, straight edges. The last opened card stays open.
  - **No reflow:** photos are drawn at the open card's width and centred, titles wrap at the collapsed width and text at the open width, set in px by the script (`--rc-plan-open-w`, `--rc-plan-title-w`, `--rc-plan-text-w`). Nothing reflows during the motion.
  - **Reveal:** the text opens with a grid-row 0fr→1fr transition and a fade.
  - **Below 992px:** the cards stack and the open one grows taller (CSS min-height), opened by a tap.
  - **Reduced motion:** the cards switch instantly.
  - **Without the script:** the first card shows open.
- **In Webflow:** the cards are plain divs with the `is-active` combo; the script goes in Rural's footer code. The grid-row reveal and the flex-grow motion are custom code; the rest is native.

## 3p. Service rows shared, Rural approach and clients, bar with back-to-top

23 October 2026.

- **Service rows (shared component):** Luxury's "Looking for something else?" rows are promoted from `luxury-other*` to `service-rows*`. Styles moved to `shared/css/service-pages.css` ("Service rows"), unchanged, plus:
  - an optional label (`label-wrapeper service-rows_label`, columns 1-4);
  - the combo `service-rows is-in-fit` for Luxury's spacing inside the fit section;
  - `section is-service-rows` for a standalone block;
  - the combo `is-link` on rows that link: a very light hover tint (`--theme--ivory-d1`, .45s, native hover state), and the stretched link, photo zoom and arrow turn in `shared/custom-css/service-rows.css`.

  The fan-out scroll effect is opt-in (`data-service-rows-fan` on the list, `shared/custom-js/service-rows.js`) and only Luxury uses it. `luxury-other.js` and `luxury-other.css` are no longer loaded and can be deleted.
- **Rural, Our approach:** the horizontal process is replaced by service rows: label "Our approach", heading "Feasibility before design" with its intro, and three rows (Structural condition, Surveys, Access and services) with their photos. The rows aren't links (no arrow, no tint). The section keeps `data-nav-show-after`. `horizontal-process.js` is no longer loaded on Rural; Luxury, Planning and 3D keep it.
- **Rural, Who we work with:** moved out of the dark design section into `section is-rural-clients` (styles `rural-clients*` in `services/css/rural-conversions.css`).
  - **Layout:** heading and intro from column 6, the three client types as stone cards, and the two notes from column 6.
  - **Boundaries:** "Two boundaries worth knowing" becomes service rows (`is-rural-boundaries`): Heritage Design (`/services/heritage-design`, "listed or in a conservation area… heritage-led") and Luxury Architecture (`/services/luxury-architecture`). The copy is the old paragraph's, split across the cards and rows.
  - **Dark section:** now only "Design that earns the building its second life".
- **Cost section:** "How much does a barn conversion cost?" exists only in the original export; the local Rural page had no such section, so nothing was removed.
- **Service CTA Bar (all six pages):** the bar is now a fixed, centred unit, `div.service-cta-bar` (carries `is-hidden`), holding a back-to-top square `button.service-cta-bar_top` (5.6em, the pill's colour, the site's arrow turned up; white with a black arrow on hover) and the consultation pill, .6em apart. The script still shows and hides the bar. The square scrolls to the top through Lenis and is now always visible with the bar. On phones the unit is one step smaller (1em), so it fits with a margin down to 320px.

## 3q. Overlapping rows (Planning, 3D) and Planning's refused section

23 October 2026. Copy unchanged.

- **Overlapping rows** (new shared component, `service-overlap*` in `shared/css/service-pages.css`), copied from the project rows of storeyarchitecture.co.uk and measured on the live site.
  - **Rows:** full width on the page colour with a hairline at the top, laid on the container grid. The top band holds the title (columns 1-4) and the text (columns 7-11). 14em below sit a large light IvyPresto number (20em, columns 1-3, on the bottom) and a 5:3 photo (columns 7-9).
  - **Motion** (`shared/custom-js/service-overlap.js`, 768px and up): from a row's top reaching the top of the screen to its bottom getting there, the row sinks by yPercent 25 under a black shade rising from 0 to .4, linear and scrubbed. The next, opaque row slides over it. Checked against the reference: at 40% past, both have sunk 10% with the shade at .16. The last row doesn't move.
  - **Photo reveal:** each photo is revealed once from a black cover (1.2s) while it settles from 1.2x (1.6s).
  - **Phones:** the rows stack as title, text, then number beside the photo.
  - **Reduced motion:** nothing moves.
- **Planning, "Is this the right service for your project?":** now overlapping rows (heading and Free Consultation CTA in the head, three rows). The trailing `<br>`/zero-width characters in the old card text were dropped.
- **Planning, "Refused planning permission? What we do next":** now uses the sticky-cards structure the fit section had (`section service-cards`): heading, the intro paragraph and the Free Consultation CTA in the sticky left panel, and the three options as photo cards on the right. The rows' links to `/services/consultation` are replaced by that CTA. The section keeps `data-nav-show-after`.
- **3D, "Who we produce visualisations for":** now overlapping rows. The head keeps the Sub Heading's label as it was, which reads "FAQs" (an export oddity, left for the user to decide).

## 3r. Rural: section order, dark planning band, approach as sticky cards

23 October 2026. Copy unchanged.

- **Order:** after the hero now come Building types ("Every barn presents a different … problem"), then the sticky steps.
- **Planning routes:** the section has the combo `is-rural-routes is-dark` (`--theme--obsidian-d3`). The heading and intro have `is-dark` combos (`service-editorial_heading is-dark`, ivory-base; `text-size-regular-copy is-service-editorial is-dark`, 70% ivory). Contrast is 17.4:1 and 8.8:1. The expanding cards keep their layout and motion, with the radius now .3em (was .8em).
- **Our approach:** the service rows are replaced by the sticky-cards structure of Luxury's "Budget and planning certainty": label, heading and intro in the sticky left half, and the three stages as photo cards on the right. It keeps `data-nav-show-after`.
- **Band variant shared:** Luxury's `is-luxury` combos on the sticky cards became the shared combos `section service-cards is-band`, `service-cards_layout is-band` and `service-cards_card is-band` (light grey band, no top rule, darker cards), now in `shared/css/service-pages.css` and used on both pages. Luxury looks the same. New: `label-wrapeper service-cards_label` for a label in the sticky panel.

## 3s. Rural: centred statement, barn types as two cards

23 October 2026. Copy unchanged.

- **Statement:** "Every barn presents a different … problem" now has equal space above (from the hero) and below (to the barn-types box): 13em each on desktop, 8em at tablet, 6em at phone and 5em under 480px (`section is-rural-showcase` margin-top, `rural-showcase_content` margin-bottom). Before, it had 18em above and 8em below.
- **Barn types:** the sticky steps ("Modern farm buildings & steel frame barn conversions", "Barns, stables, outbuildings & agricultural buildings") become two equal cards (`section is-rural-types`, `rural-types*` in `services/css/rural-conversions.css`).
  - **Card:** a 3:2 photo, then a stone panel holding the number over a hairline, the title and the text, .3em corners. The second card ends with the Free Consultation Main CTA, pinned to the bottom so the panels end level.
  - **Layout:** no sticky positioning or scroll effects; the cards stack below 768px. The section keeps `data-nav-show-after`.
  - **Scripts:** `sticky-steps.js` and `sticky-steps.css` are no longer loaded on Rural (Heritage and 3D keep them).

## 3t. Rural: Who we work with as one panel

23 October 2026.

- **Copy removed at the user's request:** the intro "Our rural conversion clients are usually one of three people:" and the two notes ("Some arrive having searched…", "We are not the right practice…"). The three client types are unchanged.
- **Layout** (`rural-clients*` in `services/css/rural-conversions.css`), from a reference of one wide, softly rounded light panel split into three columns by hairlines:
  - **Band:** `rural-clients_band` (`--theme--ivory-d1`, full width, 12em top and bottom) holds the centred heading and `rural-clients_panel` (`#faf9f7`, radius 1.6em, 2.4em vertical padding, so the hairlines stop short of the edges).
  - **Columns:** three `rural-clients_col`, each with the number at the top and the client type at the bottom (2.3em). From the second column on, a 1px left rule at 9% ink.
  - **Phones:** the columns stack with top rules instead.
  - **Boundaries:** the "Two boundaries worth knowing" rows stay below the band, on the page colour, unchanged.

- **Boundaries heading (23 Oct 2026):** "Two boundaries worth knowing" is replaced, at the user's request, by "Looking for / something else?" (forced two lines), in the same `service-rows_heading` style as Luxury. The new combo `service-rows_heading is-at-title` starts it in column 2, level with the row titles (column 1 on phones).

## 3v. Planning: white opening bands and the expanding list

23 October 2026. Copy unchanged.

- **Statement after the hero:** `section is-service-statement is-white is-planning` (was `is-dark`) is pure white. The text has the combo `service-statement_text is-planning` (max-width 24em, was 20em), so it sets in five lines at 1024-1920px; six at 768, more on phones. 8em below it (6em tablet, 4em phone).
- **Recent approvals:** `section recent-approvals is-planning is-white`: white, 10em top padding (7em tablet, 5em phone), otherwise unchanged. The Sub Heading instance is the white-text variant, so a descendant rule in `services/css/planning-applications.css` turns its label and heading black. A component instance can't take a combo, so in Webflow use the component's black-text variant instead, or keep the rule in a page Embed.
- **Correction (same day):** the expanding list was meant for "Our approach", not for "Is this the right service for your project?". That section is back to the overlapping rows (`service-overlap`, as in 3q, with its script). "Our approach" (the horizontal process) is now the expanding list, with its label, heading and intro centred above (`service-expand_label`, `service-expand_intro`) and its eight steps as cards (`01/`-`08/`, each with its own photo). `horizontal-process.js` is no longer loaded on Planning; Luxury and 3D keep it. The tabs heading is forced onto two lines: "How a planning / application progresses".
- **Expanding list:** a new shared component (`service-expand*` in `shared/css/service-pages.css`), from a reference "Services" list.
  - **Layout:** a centred heading, then square cards (`#eae8e3`, hover `#e2e0da`, 1.6em apart). Each card is a grid of number ("01/"), photo, gap, then title and text.
  - **Closed vs open:** closed, the photo is a 19em 3:2 thumbnail with the title centred beside it, 28% further right. Open (`is-open`), the photo grows to 38x44em, the title moves up and left, and the text is revealed (grid rows 0fr to 1fr, then a fade). All .7s on the site's ease.
  - **Clicking:** opening a card closes the others; clicking an open card closes it.
  - **Smaller screens:** on tablet the open photo fills its column. On phones the number sits beside the title and the photo opens full width below the text.
  - **Script and custom CSS:** `shared/custom-js/service-expand.js` (the is-open combo and aria-expanded). The title is a `<button>` stretched over the card by `::after` (`shared/custom-css/service-expand.css`), so the whole card is clickable and keyboard-accessible.

- **Our approach, dark and compact (23 Oct 2026):**
  - **Dark band:** the section has the combo `is-dark` (`--theme--obsidian-d3`). The list's colours come from `--expand-*` custom properties set by that combo: cards `#1b1b19` (hover `#242422`), ivory type, muted 65%, numbers 30%. The label text is `text-size-regular is-on-dark`.
  - **Numbers:** "01" to "08", without the slash.
  - **Sizes:** cards are .8em apart (was 1.6em), with 2.2em vertical padding (was 3.2em). The thumbnail is 14x9.4em (was 19x12.8) and the open photo 30x34em (was 38x44). Tablet thumbnails are 16x10.6em, the open photo 36em tall.
  - **Result:** at 1440 a closed card is 138px (was 192), the open one 384px (was 504), and the list about 600px shorter.
  - **Follow-up:** cards .5em apart with a .5em radius. The open card's title sits 3.2em below the photo's top (padding-top on `service-expand_content`, animated with the rest; none on phones).

## 3w. Planning: consolidation and tones

23 October 2026, at the user's request.

- **Removed:** the "Our approach" intro paragraph ("Every application we submit…").
- **"How a planning application progresses" removed** (the bouncy tabs, with `bouncy-tabs.js` and `bouncy-tabs.css` no longer loaded on Planning). Its unique details were merged into "Our approach" in its own wording:
  - **01:** "The planning history, …" and "It starts with a 60-minute call, a desktop review of your property or plot, and a written report on what is achievable and which route we recommend."
  - **03:** "Layout, scale and appearance developed with you through drawings and, where it helps, 3D views, so what is submitted…".
  - **07:** "The application is submitted and validated." This replaces text that repeated step 06 word for word.
  - **Not merged:** the drawings set, already covered in the FAQ, and decisions and conditions, already covered in "Amendments and discharge of conditions".
- **Statement after the hero:** combo `is-soft` (`#faf9f7`, was `is-white`). The text is smaller: 4.6em desktop, 4.1em tablet, max(3.4em, 24px) phone, 2.6em under 480px. Still five lines from 768 to 1920px.
- **"Is this the right service":** combo `section is-service-overlap is-tinted` (`--theme--ivory-d1`). The opaque rows follow it through `--overlap-bg`, and the big numbers darken to ivory-d4 (`--overlap-number`). 3D is unchanged.

- **The planning routes we prepare:** the stacked sticky rows are replaced by wide and narrow text cards. The section keeps its classes plus the combo `is-routes`, and the head (label, heading, intro) is unchanged.
  - **Grid:** `service-routes` (in `shared/css/service-pages.css`) is a 5-column grid, three rows of two, 1.2em apart. `service-routes_card is-wide` spans 3 columns and `is-narrow` 2; the wide card takes the longer copy and swaps sides row by row (from a reference bento layout).
  - **Order:** Householder (wide) and Full planning; Prior approval and Outline (wide); Amendments (wide) and Retrospective. Numbered 01-06 in that reading order.
  - **Card:** stone (ivory-d1), .6em radius, min-height 30em, the number at the top in IvyPresto (35% ink), the title and text at the bottom. No photos.
  - **Tones (revised):** neutral steps of the site's ivory scale only, with no hues: default ivory-d1, `is-mid` (ivory-d2) and `is-deep` (ivory-d3). Each tone is used twice; rows read mid | light, deep | mid, light | deep. Titles stay above 13:1 contrast.
  - **Icons:** the numbers are replaced by the user's supplied icons, inline SVG with paths unchanged and stroke set to `currentColor`: Home, Clipboard, Check Circle, Layout, Award and Edit V1 (for Householder, Full, Prior approval, Outline, Retrospective and Amendments). `service-routes_icon` is 3.2em (26px minimum), black.
- **Recent approvals, parallax slider:** the flick cards (and `flick-cards.js` and `flick-cards.css`) are replaced by Osmo Supply's "Parallax Image Slider (Smooothy)".
  - **Osmo's parts:** markup, classes, `data-parallax-*` attributes and initialisation as supplied. Snap is on (`data-parallax-snap="true"`), infinite on, amount 10. The script, `shared/custom-js/parallax-slider.js`, needs Smooothy 0.0.35 from unpkg; it also keeps each instance on its root and wires `[data-parallax-prev]` and `[data-parallax-next]` to goToPrev/goToNext.
  - **Site's parts:** the head (label "Planning Success" and the heading "Recent Approvals" at the left, square arrow buttons at the right) and the slide overlays: a lower shade, the "Approved" badge at the top left, and "View Project" (the old link, same destination) with the site's arrow at the bottom left.
  - **Sizes:** slides are 52em wide at 3:2 (62vw tablet; 80vw at 4:5 on phones). The current slide lines up under the heading, because the offset is on `parallax-slider__collection` so Smooothy measures an unpadded track. Styles are in `services/css/planning-applications.css`.
  - **CMS:** the slides are still static copies; in Webflow they become a Projects Collection List.
  - **Smaller screens:** the head goes to one column below 992px; the cards stack below 768px.
  - **No motion:** no sticky positioning, scroll effects or hover.

## 3ag. Rural: building-type cards, routes heading, clients panel

23 October 2026. Copy, images and CTA unchanged.

- **Building-type cards** (`service-pair`, shared CSS; only Rural uses it now): the panels take the language of Luxury's "Budget & planning certainty" cards (`service-cards`) at the same values.
  - **Title:** sits on a black hairline (`padding-bottom .7em`).
  - **Number and text:** `service-pair_meta` is a 5em number column beside `service-pair_body`, which is 1.6em in from a black vertical rule. The number and text are black, `max(1.45em, 14px)`, line-height 1.5 (tablet `max(1.6em, 15px)`).
  - **CTA:** the Main CTA is in a new `service-pair_actions` wrapper, inset to line up with the text and pinned to the bottom.
  - **Removed:** the old number-above-a-grey-rule styling.
  - **Kept:** the photo, the 3:2 ratio, the two columns, the widths and the .3em corners.
  - **Phones:** the number sits above the text with no side rule, as on the reference.
- **Planning routes heading:** set on three lines with `service-br` breaks: "Barn conversion / planning permission: / Class Q or full planning". The combo `is-three-line` (Rural CSS) lifts the 11em max-width so the last line fits. Phones drop the breaks as usual.
- **Who we work with:** the panel's corners go from 1.6em (1.2em on phones) to .6em at every size.

## 3af. Luxury: compact process cards

23 October 2026. Copy, images, steps and carousel behaviour unchanged.

- **Cards:** the "From first conversation to completion" cards drop the full-bleed photo and inset white panel, and take the language of the "Budget & planning certainty" cards on the same page (`service-cards is-band`).
  - **Structure:** a 16:10 photo (`luxury-process_media`) above an ivory-d1 panel. The title, now in the sans, sits on a black hairline. Below it, `luxury-process_meta` puts the number in a 3.6em column beside a vertical rule, then `luxury-process_body` holds the text and the list. The list lost its top rule and is tighter.
  - **Corners:** square, as on the reference.
  - **Classes:** the carousel keeps its own `luxury-process_*` classes rather than reusing `service-cards_*`, whose tablet rule turns cards sideways. The values are the reference's, scaled to the smaller card.
- **Size:** slides are `max(36em, 300px)` wide (was 44em), and the card height follows the content. Slides stretch, so all six cards end level. At 1920px a card is about 450 × 630px (was about 590 × 870px). Tablet: `max(40em, 320px)`. Phones: as before, the screen less the gutters and a peek.
- **Phones:** the number sits above the text with no side rule, as on the reference cards.
- **Intro:** `luxury-process_intro` no longer has `min-height: 65em`. It is centred on the row with 6.4em bottom padding (the pagination's height), so it still sits on the cards' centre line (3n).
- **Unchanged:** the heading, label, lead, buttons, pagination and `luxury-process.js`.

## 3ae. Heritage tabs in two columns; Recent Projects as stacking panels (all six)

23 October 2026. Copy unchanged.

- **Heritage, "What we prepare and coordinate":** the photo column (four visuals and the cover) is removed; the tabs, their labels, contents, animation and close button are kept.
  - **Layout:** `heritage-approval_tabs` is now a 12-column grid under the hairline. The heading (`heritage-approval_subheading`, an h3) sits in columns 1-5, set like "Getting it approved" (`--service-h2`, 400, line-height 1.06), and is always two lines ("What we prepare" / "and coordinate", a `<br>`). The pills sit in columns 6-12, level with the paragraphs above.
  - **Light pills:** `feature-pills__wrap is-light` now has a natural height and one full-width column, and the close button sits at the top right of the column. Below 992px everything stacks, and the close button moves above the pills, beside the heading's last line, so it never covers an open pill.
  - **Spacing:** the hairline gap is 6.4em above and below (was 7em).
- **Recent Projects (shared partial, all six pages):** the 2 + 1 cards are replaced by three full-screen panels that stack on scroll, using Planning's overlapping rows ("Is this the right service for your project?"): the same script (`shared/custom-js/service-overlap.js`, unchanged) and hooks.
  - **Hooks:** `data-service-overlap` on `service-projects_list`, `data-service-overlap-row` on each `service-projects_panel`, `data-service-overlap-media` and `-cover` on the photo, and a `service-overlap_shade`.
  - **Panels:** each is 100svh (min 40em from 992px), edge to edge, with the photo covering it and a soft gradient towards the bottom. The project name is at the bottom left (`heading-style-h3-brand is-service-projects`, now the sans at the H2 size). A white Main CTA "View Project" (`wrapper_cta service-projects_cta`) at the bottom right links to the project page. The text sits 12em above the bottom, clear of the floating consultation bar.
  - **Motion (768px and up):** as a panel scrolls past the top of the screen it sinks by 25% under a shade rising to .4, scrubbed with no pinning or snapping; the next panel slides over it. Each photo is revealed once from a black cover with a slight zoom. Reduced motion: no movement.
  - **Below 768px:** the panels are 4:5, 3px apart, with the name above the CTA, and no overlap.
  - **Hover:** a slow 3% zoom of the photo's wrapper (`service-projects_media`; the reveal animates the img itself), in `shared/custom-css/service-projects.css`.
  - **Data:** each page keeps its three projects, images, names and links (the partial's parameters are unchanged). The header and "View All Projects" are unchanged.
  - **Scripts:** `service-overlap.js` is now loaded on all six pages, before `service-cta-bar.js`.
  - **Removed:** `service-projects_row`, `_card`, `is-wide`, `_info` and `_link`, and Luxury's `service-projects_link` override. The photos are still the 1400px temporary files; the real CMS images should be at least 1920px wide.
  - **Not updated:** `library/blocks.html` (a reference copy, not served) still shows the old cards.

## 3ad. Heritage: "What we prepare and coordinate" as tabs

23 October 2026.

- **Tabs in the panel:** inside the "Getting it approved" panel, the ruled list is replaced by the Osmo Expanding Feature Pills (Rural's "Types of barns" component) in a light variant: the combo `is-light` on `feature-pills__wrap` and `feature-pills__info-list`, styled in `services/css/heritage-design.css` (Heritage only).
  - **Light variant:** no black card; dark text; pills ivory-d3 on the ivory-d1 panel; the photo column has .4em corners; a white close button with dark bars.
  - **Placement:** `heritage-approval_tabs` spans the panel under a hairline. The existing "What we prepare and coordinate" heading sits above the tabs on the left, with the photo on the right.
- **Tabs:** four, with new short labels; each opens to the original deliverables, in order and word for word:
  - Surveys and feasibility: items 1-2;
  - Applications: items 3-5;
  - Specifications and consultants: items 6-7;
  - After consent: item 8.
- **Photos:** the drone farmhouse, the brick farmhouse, the vaulted interior and the brick courtyard, with the brick farmhouse as the cover.
- **Smaller screens:** below 992px the photo sits above the tabs (4:3).
- **Scripts:** `feature-pills.js` and `feature-pills.css` are loaded on Heritage again.
- **Unchanged:** the heading, intro paragraphs, panel and CTA.

## 3ac. Expanding tiers shared; Heritage work as tiers; contained consent CTA

23 October 2026. Copy unchanged.

- **Expanding tiers (shared):** Rural's expanding photo cards are promoted to a shared component. CSS moved from `services/css/rural-conversions.css` to `shared/css/service-pages.css`.
  - **Renames:** `rc-plan*` → `service-tiers*`, `section is-rural-routes` → `is-service-tiers`, `data-rc-plan*` → `data-service-tiers*`, `--rc-plan-*` → `--tiers-*`, and the script `rc-plan.js` → `shared/custom-js/service-tiers.js` (same code). Rural looks and behaves the same.
  - **Moved too:** `service-editorial_heading is-dark` and `text-size-regular-copy is-service-editorial is-dark`. `rc-plan.js` is no longer loaded anywhere.
- **Heritage "The work we take on":** now the tiers on the dark band (`section is-service-tiers is-dark`, with the heading in `service-editorial_head`). Three cards (01-03) carry the section's photos and every paragraph unchanged; the rural conversions link is now white on the dark card.
  - **Combo `is-long`:** an 80em row (800px at 1440), a deeper shade behind the open card's text, and paragraph spacing. Stacked (below 992px), the cards grow to their text, with 5.6em under the number and an even shade.
  - **Removed:** the `heritage-work*` classes.
  - **Spacing:** "Getting it approved" now has 12em top padding (9em tablet, 7em phone), since the dark band ends above it.
- **Consent CTA band:** contained. The light grey (unchanged colour) moved from the full-width section onto `service-cta is-in-band`, which sits in the page container with .6em corners and 5.6em/6.4em padding (tablet 4.8/4em, phone 4/2.4em). It shares the panel above's edges at every width. The section is transparent, with 12em below.

- **Copy update (same day, the user's text):** the three cards now have two shorter paragraphs each. "Rural conversions service" in 03 still links to `/services/rural-conversions`. With the shorter copy the row is back to the reference height (64em); `is-long` keeps only the deeper shade and paragraph spacing.

## 3ab. Heritage: "The work we take on" and "Getting it approved"

23 October 2026, copy supplied by the user.

- **Replaced:** the paired cards (Extending / Renovation), the "Work this typically includes" pills (with its period-home note) and the split-text "Listed Building Consent applications / What we prepare and coordinate" section are replaced by two page sections, styled in `services/css/heritage-design.css`.
- **The work we take on** (`section heritage-work`): heading, then three rows of the same design (`heritage-work_item`, `is-reverse` on 02). Each row has a 4:5 photo in columns 1-5 or 8-12, and the text in the other half: number over a hairline, title, paragraphs.
  - **01 Extensions and additions:** the existing three paragraphs.
  - **02 Renovation and repair:** the existing two paragraphs plus the user's new third.
  - **03 Conversion and reuse:** new, the user's two paragraphs, with "rural conversions service" linking to `/services/rural-conversions`.
  - **Smaller screens:** the photo stays on the left at tablet; on phones it stacks above the text at 4:3.
- **Getting it approved** (`section heritage-approval`): one stone panel (ivory-d1, .6em radius), with no photo or numbers.
  - **Top:** the heading at the left, the three existing consent paragraphs at the right; the Listed Building Consent guide link is kept.
  - **List:** "What we prepare and coordinate" beside a ruled list of eight items, with "Conservation specifications and detailed drawings for the contractor" moved in as item 6.
  - **CTA:** the Free Consultation Main CTA (moved from the pills section) at the end.
- **Removed:** "Conservation area renovations" and the period-home paragraph. `feature-pills.js` and `feature-pills.css` are no longer loaded on Heritage.

## 3aa. Heritage: statement, fit rows, consent band, process list

23 October 2026. Copy unchanged.

- **Statement:** combo `service-statement_text is-heritage`: 4.4em (was 5.2), line-height 1.12, 22em measure; 4em tablet, max(3.2em, 24px) phone, 2.5em under 480px. Five lines at 768-1440px. `highlight-text.js` is now loaded on Heritage, so the statement's existing `data-highlight-text` animates as on Luxury and Planning.
- **"Is this the right service":** as on Luxury. The `service-other` card row is replaced by the shared service rows (`service-rows is-in-fit`, with the fan-out), copied from Luxury with Luxury Architecture in place of Heritage Design. The intro keeps Heritage's wording, with "book a free consultation" linked. The fit list and the Green Belt note are unchanged. `service-rows.js` and `service-rows.css` are now loaded.
- **"Not sure whether your project needs consent…":** the inline CTA moved out of the split-text section into its own `section is-service-cta-band` (ivory-d1, 8em padding). On the band, `service-cta is-in-band` drops its rules and outer spacing. The two split rows above are unchanged.
- **"How a heritage project runs":** the stacked rows are replaced by the expanding list in its dark variant (`section is-service-expand is-dark`), as Planning's "Architect-led planning application": label "Our process" and the heading centred, six cards (01-06) with their photos, the first open. `service-expand.js` and `service-expand.css` are now loaded.

## 3z. Planning FAQ heading; Heritage listed-building sections

23 October 2026.

- **Planning FAQ heading:** "Questions we’re asked about / planning applications" (was the Luxury page's "bespoke and luxury homes"). The questions and answers are unchanged.
- **Paired cards shared:** Rural's two-card component moved to `shared/css/service-pages.css` and was renamed: `rural-types*` → `service-pair*`, section `is-rural-types` → `is-service-pair`. Rural looks the same.
- **Heritage:** the sticky steps (`sticky-steps.js` and `sticky-steps.css` no longer loaded) become two sections.
  - **Paired cards** (`section is-service-pair is-heritage`): 01 "Extending a listed building" and 02 "Listed building renovation & repair", each with its photo and its paragraphs (split at the old `<br><br>`). Keeps `data-nav-show-after`.
  - **Feature pills** (`section is-service-pills is-heritage`, no top padding): "Work this typically includes" inside the dark box, one pill per work item. The labels are new and short (Layouts and proportions, Historic fabric repair, Insulation and services, Conversion and reuse, Conservation specifications, Conservation area renovations); each body is the original line. Six visuals plus a cover.
  - **After the box:** the closing note ("Where a property is a period home…") and the Free Consultation Main CTA sit centred below it (`service-pills_after`, `service-pills_note`). `feature-pills.js` and `feature-pills.css` are now loaded on Heritage.

## 3y. Planning refinements

23 October 2026.

- **Recent approvals:**
  - **Background:** the combo `recent-approvals is-soft` (was `is-white`) uses `#faf9f7`, the same as the statement above.
  - **Slides:** 47em wide, down from 52 (56vw at tablet, 74vw on phones), same 3:2 and 4:5 ratios.
  - **Arrows:** 4.4em squares (40px minimum), down from 5.6em, near-black (`--theme--obsidian-d1`, black on hover) with white 1.5em arrows.
- **"Is this the right service":** 6em of bottom padding on `is-service-overlap is-tinted`. The Free Consultation button is unchanged.
- **Related reading:** the three guide links were inline anchors inside the paragraph, spaced by `<br>` and zero-width characters, so they wrapped inconsistently. They now sit in their own block after the rich text: `service-reading` > `service-reading_label` ("Related reading") > `ul.service-reading_list` > `li.service-reading_item` > `a.service-reading_link`, one per row on hairlines, all on the text column's edge. Styles in `services/css/planning-applications.css`; link text and destinations unchanged.

## 3x. Feature pills shared; 3D reorder; Rural barn types

23 October 2026.

- **Feature pills shared:** Rural's Osmo Expanding Feature Pills styles moved to `shared/css/service-pages.css` ("Feature pills"), renamed `rural-pills` → `service-pills`, `rural-pills_heading` → `service-pills_heading`, and the `is-rural` combos on `feature-pills__wrap` and `feature-pills__info-list` → `is-service`.
  - **Alignment:** the 1.3em type scale moved from the holder onto `feature-pills__wrap is-service`, so the holder's padding is the page gutter (capped at the 1800px container). The pills box and the barn-type cards below it now share exact edges at every width; before, the box was set inside a 1.3x gutter.
- **Rural:**
  - **Heading:** "Types of barns / we work with" (forced break, sentence case).
  - **Descriptions:** Stable block, Dutch barn, Farm outbuilding and Stone threshing barn now have descriptions (new copy, at the user's request), in the same name-then-sentence form as Steel portal frame.
- **3D:**
  - **Order:** "Who we produce visualisations for" now comes first after the hero.
  - **What you receive:** now uses the feature pills (`section is-service-pills`, with the heading inside the dark box). It has five pills, one per deliverable; each label is the deliverable's own opening words and the body its full text. Five visuals plus a cover. `feature-pills.js` and `feature-pills.css` are now loaded on 3D.
  - **Removed:** the "A defined package of high-resolution images…" lead and the "Visualisation is not a design service on its own…" statement section.

## 3u. Responsive audit (Luxury, Rural)

23 October 2026. Both pages were audited in headless Edge at 320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440 and 1920px, with touch emulation below 992px. The checks covered horizontal overflow, clipped and overlapping text, text under 12px, tap targets and console errors, plus a screenshot of every section at 390, 768 and 1024. No page overflowed at any width; the fixes:

- **Small text between 992 and 1200px:** the site's em drops to about 7px there, which took several service text classes to 8.5-11px. These now have px floors (`font-size: max(<em>, <px>)`):
  - **15px:** sticky-card intro, editorial intro, fit list body, service-rows intro.
  - **14px:** sticky-card text and number, horizontal-process text, hero supporting text.
  - **22px:** sticky-card title.
  - **17px:** fit title.
  - **12px:** process labels, bouncy-tab number, project link and label.
  - **Luxury carousel:** text 13.5px, points 12.5px, number 11px, pill label 12px.

  Above 1200px nothing changes.
- **Touch targets:**
  - Chip tabs are at least 40px tall below 992px, with a 13px text floor.
  - Carousel dots keep their look but get a 40px-tall invisible hit area (`::before`).
- **Sticky cards (shared):**
  - At tablet width (768-991px) each card lies on its side (photo 2/5, text 3/5), instead of three full-width posters.
  - On phones the number sits above the text, which now takes the card's full width (no side rule).
- **Luxury carousel on phones:** cards are taller (44:76), so the photo still shows above the panel, which holds the bullet points.
- **Rural planning cards, stacked:** the open card gets a deeper shade behind its text.

**Left as is (global):**
- The Main CTA button label (10.7-11.5px between 600 and 1024px) and the Sub Heading labels ("Scope", 10-11.5px at 320-360px) come from global components and the site-wide scaling in Global Code.
- The floating logo and the fixed consultation bar pass over content while scrolling, by design. The bar hides over the footer, so nothing ends up permanently covered.

## 4. Global classes reused (never modified)

- **Structure:** `page-wrapper`, `section`, `container`, `row`, `col`, `col-lg-*`, `col-md-12`, `hide-tablet`, `padding-top`, `padding-large-1`, `margin-top`, `margin-bottom`, `margin-medium-2`, `margin-large-2`, `spacer-large-3`
- **Typography:** `heading-style-h1-normal`, `heading-style-h2-normal resize`, `text-size-small service-page`, `text-size-regular`, `text-size-regular label`, `text-size-medium`, `text-size-x-large`, `text-size-regular-copy`, `text-rich-text-styled`, `heading-statement`, `process-heading`, `heading-style-h2-brand_accordion`, `text-size-acordion bullet`
- **Components and their inner classes:** the Main CTA button (`wrapper_cta`, `btn-icon-content*`, `square_cta`, `arrow_cta`, `buton`), Sub Heading (`heading-wrapper`, `div-block-40`/`41`, `label-wrapeper`, `yellow-dot`), Text Block (`sticky-steps*`), Process Step (`accordion-css*`, `div-block-42`…`46`, `image-10`), the FAQ accordion (`accordion-css*`, `faq`), the layered projects slider (`layered-slider*`, `ls-cms-wrap`, `link-block-6`, `view-project`, `white-accent-3`), flick cards (`flick-group*`, `flick-card*`, `prev-next-button`, `arrow_prev-next`), pathway cards (`service-pathway-wrapper`, `black`, `service-pathways`, `inner-wrapper_pathways _1/_2/_3 v2`, `service-pathways_heading`, `image-13`), and statements (`container statement`, `heading-wrapper_statement`, `wrapper_statement`, `background-color-black v2`, `noline`, `_1-1-central-white-txt-2`, `div-block-40-copy`, `heading-style-h1-brand-copy _2`)

Where a service page needed something different, it got a combo (`is-service…`, `is-stacked`, `is-[page]`) instead of an edit to the global class.

## 5. Webflow components to create

| Component | Used on | Props / slots | Notes |
|---|---|---|---|
| Service Hero | all six | heading (rich text), supporting text, background image | `service-hero` with image, overlay and centred content; see 3b |
| Service CTA Bar | all six | none (link: /contact) | fixed bottom bar: back-to-top square (left) + Main CTA classes with `is-dark`; script `service-cta-bar.js`; see 3h |
| Service Logo | all six | none | fixed top-left at 991px and below |
| Service Section Intro | RC LA PA 3D | label, large text | `container is-service-intro` > `service-intro` grid; see 3k |
| Service Process Slides | RC LA PA 3D | intro label and statement; steps: index, heading, text, primary and supporting photo; the last step a photo strip | `section is-service-process` > `service-intro is-dark` + `service-process_slide` (combos `is-reverse`, `is-final`); see 3k |
| Service Visual | RC LA PA 3D PM | primary photo, optional supporting photo | composed photo pair; combos `is-process`, `is-case`, `is-solo`; see 3k |
| Service Split Text | RC HD PA 3D | heading, rich text; repeatable rows | `section is-service-split` > `row is-service-split` |
| Service Numbered Steps | PA 3D | heading, optional lead; steps: index, title, text; optional CTA | `service-steps_head` + `service-steps_list` of full-width rows; see 3k |
| Service Fit Lists | HD LA 3D PM | optional label and heading; repeatable rows: optional title, list; optional note | `service-fit` grid with `service-fit_row` (`is-alt`, `is-untitled`, `is-full`); see 3k |
| Service Editorial Rows | RC HD LA PA 3D PM | optional header (heading; intro text or text + Main CTA); repeatable rows: index, title, text, optional link, photo; rows optionally link blocks | `service-editorial_head` + `service-editorial_rows`; see 3k |
| Service Projects | all six | label (Rural only), heading; 3 full-screen project panels (image, name, View Project link) from the Projects CMS; View All Projects | shared partial `shared/partials/service-projects.html`; one Collection List filtered by Project Type, limit 3, with the `service-overlap` hooks; see 3ae and 7a |
| Service Statement | LA HD PA 3D PM | statement text; optional label, note, CTA; variant `is-dark` | `section is-service-statement` > `service-statement`; see 3g and 3k |
| Service Inline CTA | HD 3D | text, button | `service-cta` |
| Service Bouncy Tabs | LA PA 3D | heading, tabs, panels | Osmo bouncy tabs; Planning uses the dark variant (`section is-service-dark`, `is-dark` combos) |

These already exist in Webflow and stay as they are: Navigation Desktop, Navigation [2], Global Code, Page Transition (text prop), Main CTA, Sub Heading, Text Block, Process Step, Section - Testimonials, Section - Final CTA and Section - Footer.

The Final CTA differs per page in heading, button text, an optional paragraph and, on Planning, a larger heading (`v2` combo). Those differences need component props in Webflow, or the instances have been edited.

Page-only sections are built directly on their page: Rural's Building types (feature pills, see 3d) and Design & clients, Heritage's highlight statement, Planning's highlight statement and Recent approvals, and Project Management's gap, scope, case study and fit sections.

## 6. Native styling vs custom code

**Native (recreate in Designer):** everything in `shared/css/service-pages.css` and `services/css/*.css`. Each block is one class or combo chain, with breakpoints in Webflow's order: base (desktop), min-width 1440 and 1920, max-width 991, 767 and 479. Values use the site's variables (`var(--…)`), `em`, `svh`, `max()` and `clamp()`; all of these can be typed into Designer.

**Custom CSS (Webflow Embed on the page):** `shared/custom-css/`, one file per effect. Paste each into a `<style>` in an Embed:

| File | Used on | Where the embed sits now |
|---|---|---|
| `text-line-mask.css` | all six | page embed in Resources |
| `service-typography.css` | all six | page embed (balanced/pretty wrapping, type for global component instances; scoped to `.page-wrapper.is-service`) |
| `sticky-steps.css` | RC HD 3D | page embed in Resources (also holds the composed photo pair and the reading column sizes; the markup is the global Text Block component, so they can't be combos) |
| `feature-pills.css`, `rotating-text.css` | RC | page embed in Resources |
| `bouncy-tabs.css` | LA PA 3D | page embed in Resources |
| `service-rows.css` | LA RC | page embed (rows that link: stretched link, photo zoom, arrow turn) |
| `swiper-slider.css` | none since 3n (was LA) | page embed; also needs Swiper 12.2.0's CSS from jsDelivr in the page head |
| `flick-cards.css` | PA | page embed in Resources |
| `service-projects.css` | all six | page embed in Resources (panel hover only) |
| `service-editorial.css` | all six | page embed in Resources (row-link hover only) |

(Table re-checked against the pages' includes on 19 Oct 2026.)

Today all of these sit in one "Services Pages CSS" component on every page. Pasting only the files a page uses (as above), or keeping one component that holds all of them, both work. The selectors only match service-page markup.

**Custom JavaScript (Page settings → Custom code → Before `</body>`):** `shared/custom-js/`, one self-contained file per effect, pasted inside `<script></script>`. They rely only on the global GSAP plugins and Lenis loaded by the site, and select elements by `data-*` attributes (only `rotating-text.js` also uses the class `rotating-text__highlight`).

| Page | Scripts, in order |
|---|---|
| Rural Conversions | sticky-steps, feature-pills, rotating-text, rc-plan, service-overlap, service-cta-bar |
| Heritage Design | sticky-steps, service-overlap, service-cta-bar |
| Luxury Architecture | highlight-text, horizontal-process, bouncy-tabs, Swiper 12.2.0 (jsDelivr) then luxury-process, service-rows, service-overlap, service-cta-bar |
| Planning Applications | highlight-text, flick-cards, bouncy-tabs, horizontal-process, service-overlap, service-cta-bar |
| 3D Visualisations | sticky-steps, bouncy-tabs, horizontal-process, service-overlap, service-cta-bar |
| Project Management | service-overlap, service-cta-bar |

Each file's header names its pages, what it needs (GSAP plugins, Lenis, Swiper) and the `data-*` hooks it reads. Every file runs inside its own function and returns at once if it has already run on the page (flag `window.HawkstoneService.<effect>`, or a `data-…-ready` mark on the element), so pasting it twice or alongside other site code can't double its listeners or overwrite another script's global functions.

Scripts that had nothing to act on were dropped from their pages (3i): line-reveal-testimonials everywhere, sticky-steps on Project Management and overlapping-slider on Planning. `layered-slider.js`, `line-reveal-testimonials.js`, `overlapping-slider.js` and `step-timeline.js` are no longer loaded by any page (3k replaced the timeline with the process slides).

`highlight-text` runs only on Planning and Luxury, although Heritage, 3D and PM also have `data-highlight-text` headings, which therefore don't animate today. That's existing behaviour, left alone.

## 7. Migration limitations to plan for

- **Custom code length:** Rural (≈47k characters) and Planning (≈47k) carry the most page script. Check them against Webflow's current per-field limits; if they don't fit, host the effect files (for example on jsDelivr from a GitHub repository) and load them with `<script src>`.
- **Scripts through the API:** Webflow's API registers inline scripts only up to a short length (2,000 characters at the time of writing). Most effect files are longer, so expect to host them, or to paste them into Page settings by hand.
- **Variables:** styles here reference site variables as `var(--…)`. Designer links styles to variables by name; check how the MCP sets variable-linked values versus raw values before rebuilding.
- **Nested rich text styles:** `text-rich-text-styled is-service` styles its paragraphs and list items at 991 px ("All Paragraphs" inside the class). Confirm the MCP can create nested tag styles, or keep this one rule in an Embed.
- **Components with CMS content:** the projects slider, flick cards, nav dropdowns and testimonials are bound to CMS collections in Webflow. Locally they're static copies from staging. For the projects slider, see 7a.
- **Images:** photos are temporary locally (`images/hero-farmhouse-aerial-1600.avif` and `images/temp-*.avif`, see 3c and 3f). The real images are in the Webflow export, staging and the CMS.
- **Class order:** Webflow writes new classes after existing ones in its stylesheet. The local files load in that order too (global, then shared, then page), so the cascade matches what a rebuild will produce.
- **Page IDs:** interactions in `webflow.js` are keyed to each page's `data-wf-page`. Rebuilt pages get new IDs, which is fine: the six pages have no page-specific Webflow interactions, and site interactions target global classes and attributes only.

## 7a. CMS binding: Services, Projects and the Project Type relationship

Rewritten on 19 October 2026. The earlier version assumed the relationship ran from Services to Projects and described a staggered three-slot gallery that has since been removed. Neither is right any more.

### What is known, and how

| Detail | Source | Status |
|---|---|---|
| The Projects section is one shared partial, `shared/partials/service-projects.html`. Each page passes only its three temporary projects (`p1-slug`, `p1-name`, `p1-image` … `p3-*`) plus `label` and `black` on Rural. | this repository | verified |
| Layout (since 3ae): three full-screen `service-projects_panel`s in `service-projects_list` that stack on scroll (`service-overlap.js`), then the "View All Projects" Main CTA linking to `/projects`. | this repository | verified |
| Planning's "Recent approvals" flick cards are also a static copy of Projects items (`/projects/...` links). | this repository | verified |
| 3D Visualisations' "Recent work" section is hand-written page content, not a project list. | this repository | verified |
| The six pages are static pages at `/services/<slug>`. The export also has a Services template page (`detail_services-cms.html`), separate from them. | this repository (Webflow export) | verified |
| Collections **Projects** (18 items) and **Services** (6 items) exist. | Webflow CMS screenshots, 19 Oct 2026 | seen |
| Services items: Project Management, 3D Visualisations (spelt with an s in the CMS), Heritage Design, Planning Applications, Rural Conversions, Luxury Architecture. | Webflow CMS screenshots | seen |
| Projects has **Project Type**, a multi-reference to Services. Its help text says the project "will appear in the projects slider on those service pages". Example: Barn Conversion 1 → Rural Conversions + Planning Applications. | Webflow CMS screenshots | seen |
| Projects has **Sorting** (number; smaller = higher in lists), **Featured Project** (switch; nav dropdown and hero, not this section), Location, Client, Project Value, Completion Date, Status. | Webflow CMS screenshots | seen |
| Project pages are at `/projects/<slug>`. | Webflow CMS screenshots | seen |
| Field **slugs** and collection IDs, the Projects **image** field (and any alt-text field), and whether Project Type can be filtered with "contains" on a static page | — | **to confirm in Webflow** |

### Page to Services item

| Local page | Webflow page | Services item | Temporary local cards (not real associations) |
|---|---|---|---|
| `services/rural-conversions.html` | `/services/rural-conversions` | Rural Conversions | Barrow House, Farm Diversification Scheme 1, Barn Conversion 1 |
| `services/heritage-design.html` | `/services/heritage-design` | Heritage Design | Barrow House, Primrose Bank, Castle Street |
| `services/luxury-architecture.html` | `/services/luxury-architecture` | Luxury Architecture | Luxury Development 1, Sandborough House Farmhouse, Furs House |
| `services/planning-applications.html` | `/services/planning-applications` | Planning Applications | Luxury Development 1, Barrow House, Derby Road |
| `services/3d-visualisations.html` | `/services/3d-visualisations` | 3D Visualisations | Sandborough House Farmhouse, Furs House, Barn Conversion 1 |
| `services/project-management.html` | `/services/project-management` | Project Management | Derby Road, Trent Lane, Private Dwelling 1 |

The local cards stay as they are, so the pages keep working; the CMS replaces them on rebuild.

### Binding the Service Projects section

The filter goes from Projects to Services: a project appears on every service page whose Services item is in its Project Type. A project tagged Rural Conversions and Planning Applications appears on both pages, with no duplicate items.

```
section.section.is-service-projects                 static
  service-projects_header                           static ("Recent Projects"; Rural also shows the "Projects" label)
  Collection List  (class service-projects_list, attribute data-service-overlap)
                                                    Projects; filter: Project Type contains <this service>
                                                    sort: Sorting ascending; limit 3
    Collection Item  (class service-projects_panel, attribute data-service-overlap-row)
      service-projects_media [data-service-overlap-media]
        img.service-projects_img     ← project image field (to confirm)
        service-projects_cover [data-service-overlap-cover]
      container service-projects_content
        h3                           ← Project Name
        Main CTA (white) "View Project", class service-projects_cta   link → current Project page
      service-overlap_shade [data-service-overlap-shade]
  service-projects_actions                          static Main CTA "View All Projects" → /projects
```

- **Classes and attributes:** in Webflow a Collection List adds wrappers (`w-dyn-list` > `w-dyn-items` > `w-dyn-item`). Put `service-projects_list` and `data-service-overlap` on the element that holds the items (or anywhere above them: the script only looks for rows inside it), and `service-projects_panel` with `data-service-overlap-row` on the **Collection Item** itself, so the items are the panels that stack. Check that the items wrapper has no gap or flex styles of its own.
- **Filter on a static page:** each page picks its own Services item in the filter ("Project Type contains Rural Conversions"). If Designer doesn't offer "contains" for this field on a static page, use one of these instead: a Services Collection List filtered to that one item, with a nested Projects list; or making the six pages the Services template (that changes the URLs and the existing template page, so it is the user's decision).
- **Sort:** Sorting ascending matches the field's own description. Confirm with the user that the first three by Sorting are the right three; nothing in the schema marks a project as featured for a service page.
- **Fewer than three projects:** the list simply shows fewer panels; the last one never sinks, so the motion still works. Hide the empty state (display none).
- **Images:** set alt text from a project field if one exists (to confirm). Webflow generates `srcset` itself (`sizes`: 100vw). The panels fill the screen, so the source image should be at least 1920px wide.
- **"View Project"** is a Main CTA instance whose link is set to the current Project page; the h3 binds to Project Name.
- **Hover** (slow photo zoom) is custom CSS keyed to the classes above (`shared/custom-css/service-projects.css`), so it keeps working on CMS items. The motion is `service-overlap.js` in the page's custom code.

### Other CMS-bound content

- **Planning "Recent approvals"** (flick cards): `flick-group__list` becomes a Projects Collection List and each `flick-group__item` a Collection Item, keeping the `data-flick-cards-*` attributes on the same elements. `flick-cards.js` reads whatever items are rendered, so it needs no change. The selection rule is still to be decided with the user. "Project Type contains Planning Applications" is the obvious one, but the flick cards then repeat the Projects section's first cards.
- **Nav dropdowns, Client Success testimonials, footer:** global components already bound in Webflow. Reuse them as they are.
- **Hero and page copy:** static page content. The Services items aren't used for them; binding them is not part of this plan.

## 8. After migration: checking the rebuild

Point the comparison script at the rebuilt staging pages:

```
node scripts/compare-pages.cjs --a http://localhost:5190 --b https://hawkstone-developments-staging.webflow.io
```

It reports any element whose computed style differs, with both class lists.

## 9. Building inside the existing site: checklist

The rebuild goes into the live Webflow project, alongside the homepage, About, Projects and the other pages, not into a blank project. Short reference:

**Native in Designer:** sections, containers, grids and type from `shared/css/service-pages.css` and `services/css/*.css` (section 6). The components are in section 5. Global components (navigation, floating navigation, Main CTA, Sub Heading, Text Block, Process Step, Client Success, Final CTA, footer) are reused as instances, never edited.

**Retained custom code:** custom CSS files as page Embeds, and JS files in Page settings before `</body>` (both tables in section 6). They depend on GSAP 3.15 with ScrollTrigger, SplitText, Draggable and Lenis, which the site's global code already loads. Swiper 12.2.0 is needed on Luxury only.

**Conflicts to check before creating anything:**
- **Class names.** Before creating a class, search the site's style panel for it. A class that already exists with the same name takes on that class's styles everywhere it's used. Watch the generic Osmo names in particular: `swiper`, `swiper-wrapper`, `swiper-slide`, `swiper-group` (Luxury), `text-line-mask`, `flick-*`, `bouncy-tabs__*`, `feature-pills__*`. Locally only the six pages use them, and the export defines none of them, but the live site may have changed since the export.
- **Custom CSS scope.** `swiper-slider.css` sets Swiper variables on `body` and styles the `.swiper*` classes. That's safe in a page Embed on Luxury; don't move it into site-wide custom code. The other files only match service classes or `data-*` attributes; `service-typography.css` is limited to `.page-wrapper.is-service`.
- **Scripts.** Every effect file is self-contained and runs once per page (section 6), so it won't clash with a same-named Osmo script elsewhere on the site. Don't add the effect files to site-wide custom code. Webflow's API inline-script limit still applies (section 7).
- **Global variables.** Styles reference the site's own variables (`--theme--…`, `--text-colour--…`, `--font-family--brand-font`). Link them to the existing variables; never create duplicates.
- **Page settings.** Each rebuilt page needs the `page-wrapper is-service` combo (Rural: `page-wrapper is-service is-rural`), the white-text Navigation Desktop variant, and its canonical URL (`/services/<slug>`, as in 7a's table) so existing links and SEO stay intact.

**Bind or confirm during migration:**
1. In Projects: the Project Type field's slug and that it is multi-reference; the image (and alt) field; the Sorting field's slug.
2. That a static page can filter Project Type with "contains" a chosen Services item; otherwise use one of the fallbacks in 7a.
3. Each page's Projects Collection List (7a), its empty state, and the stacking panels at every breakpoint.
4. Planning's Recent approvals selection rule (ask the user).
5. Replace the temporary photos (`images/hero-farmhouse-aerial-*`, `images/temp-*`) with the real images from the asset library or CMS.
