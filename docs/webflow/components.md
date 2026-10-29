# Component catalogue

Every Webflow Component the six service pages need: what it is, where it's used, its properties (the labels the
client sees in Webflow's component settings), its slots and variants, and the behaviour and limits to keep. Read
[README.md](README.md) first for the conventions (property vocabulary, heading-level switch, slots, defaults, rich
text). Which page uses which component, in which order, is in [inventory.md](inventory.md) (generated) and
[pages/](pages/).

How to read the property tables:

- **Element** is the local element the property is bound to, as a class selector inside the component's root. Build
  the same element with the same classes in Webflow and bind the property to it.
- **Type:** Text, Rich Text, Image, Link, Visibility (show/hide), Variant (the component's variants).
- **Default:** the component definition takes the content of the first page listed under *Used on*; every instance
  then sets its own page's content. Full copy is in the page file; headings and photos are listed per page in
  [inventory.md](inventory.md). Never reword the copy (it is keyword-optimised).
- Every heading marked "line break" holds a `<br class="service-br">` that phones drop (README, *Line breaks*).
- Main CTA = the site's existing global Main CTA component, nested. "Button Text" and "Button Link" are the parent
  component's properties, passed to the nested Main CTA's own text and link properties.

Each heading below (`### Name`) is the component's exact Webflow name. `scripts/migration-check.mjs` checks that every
name used on a page has an entry here.

---

## Shared section components

### Service Hero

The full-bleed photo hero with the H1 and supporting text. Used on: all six (`shared/partials/service-hero.html`).
Root `section.service-hero`.

| Property | Type | Element | Description |
|---|---|---|---|
| Background Image | Image | `img.service-hero_image` | Full-bleed photo; cropped to fill (object-fit: cover), so any proportion works. At least 1920px wide. |
| Heading Start | Text | first text of `h1.heading-style-h1-normal.is-service-hero` | Words before the highlighted phrase, ending with a space. Leave empty when the phrase opens the heading. |
| Heading Highlight | Text | `span.service-hero_accent` inside the H1 | The one to three key words set in the accent serif italic ("Luxury home"). |
| Heading End | Text | text after the span, inside the H1 | Words after the phrase, starting with a space. |
| Supporting Text | Text | `h3.text-size-small.service-page.is-service-hero` | The paragraph beside the H1 (an h3 element today; keep the tag unless the user decides otherwise). |
| Button Text | Text | Main CTA (white) | "Free Consultation" on all six. Up to about 27 characters (README, *Button labels*). |
| Button Link | Link | Main CTA | Default `/contact`. |

- **The H1** stays one heading: Heading Start + Heading Highlight + Heading End, the highlight a span inside it.
  The three parts together are each page's exact H1 (page files list them). Use non-breaking spaces where words must
  stay together (3D: between "&amp;", "3D" and "CGI", so "3D CGI" never splits across lines).
- **Accent typography (29 Oct 2026):** the H1's own words are white at 80% (`#fffc`); the span is IvyPresto Headline
  italic 300 at 1.08em, letter-spacing -.03em, full white, line-height 0 (so Poppins sets the line spacing). The size
  was matched optically from both fonts' metrics and rendered type (x-heights .54 italic vs .55 Poppins; the serif is
  narrower and lighter), not by equal font sizes.
- **Behaviour:** `service-hero.js` keeps the tops of the H1's and the supporting text's first lines level (pixel rule
  from the design review) at 992px and up: the serif's letters stand taller than Poppins', so it measures both first
  lines (shared baseline from a marker, letter heights from the fonts' metrics) and sets the aside's top margin;
  `-.2vw` in CSS is the fallback. Verified within 1px on all six at 1024-1920px. `service-cta-bar.js` shows the fixed
  consultation bar once this button leaves the screen; it finds the button by `[data-service-hero-cta]`, or by
  `.service-hero .wrapper_cta` when the Main CTA instance can't carry the attribute.
- **Layout:** the dark fade covers only the lower third (`service-hero_overlay`). Longer headings grow upwards from
  the bottom; tested at +60% text with no clipping.

### Service Statement

A large statement in a band, the text highlighting word by word as it scrolls in. Used on: Luxury, Heritage, Planning,
Project Management. Root `section.section.is-service-statement` > `.service-statement`.

| Property | Type | Element | Description |
|---|---|---|---|
| Style | Variant | root combos | **Light** (Luxury), **Dark** (`is-dark`, Heritage), **Soft** (`is-soft is-planning`, Planning: white band running into Recent Approvals), **With Note** (`is-pm`, Project Management). |
| Statement | Text | `.service-statement_text` | The statement. Heading-level switch: an `h2` on Luxury, a paragraph elsewhere (README). Heritage adds combo `is-heritage` (a step smaller), Planning `is-planning`. |
| Show Label / Label | Visibility / Text | `.label-wrapeper.is-service-statement p` | Small label above (Project Management: "Construction-stage support"). |
| Show Note / Note | Visibility / Text | `p.pm-statement_note` | Line under the statement (Project Management). |
| Show Button / Button Text / Button Link | Visibility / Text / Link | `.service-statement_meta` Main CTA (white) | Heritage only. |

- **Behaviour:** `highlight-text.js` (attributes `data-highlight-text`, `data-highlight-scroll-start="top 60%"` on the
  statement, fixed in the component). The script is loaded on Luxury, Heritage, Planning and Project Management.

### Service Horizontal Scroll

Luxury's "What we design": the section pins on desktop while a row of full-bleed photos and route panels slides left,
a rule filling as a progress bar. Used on: Luxury. Root `section.h-process` (`data-h-process`).

| Property | Type | Element | Description |
|---|---|---|---|
| Section Label | Text | `p.h-process_section-label` | The small label at the top left ("What we design"). |
| Heading | Text | `h2.h-process_intro-heading` | Intro heading, line break. |
| Intro | Text | `p.h-process_intro-text` | Intro paragraph. |

- **Slot "Routes"** in `.h-process_track` (`data-h-process-track`), after the fixed intro block: **Service Horizontal
  Scroll Route** items. 1 to 6 routes work; the track's travel is measured from the last route.
- **Behaviour:** `horizontal-process.js`, desktop (992px and up) only: sets the section's height from the travel,
  slides the track with the scroll (Lenis-smoothed ScrollTrigger), fills `[data-h-process-bar]`, drifts each
  full-bleed photo from -25% to 25% (scaled 1.1) and eases each route's side photo in from 20%. Below 992px the panels
  stack (CSS) and nothing runs. Needs GSAP + ScrollTrigger (site-wide). The CSS height (420vh) is only a fallback.
- **Webflow:** if a slot renders a wrapper element inside the track, give it `display: contents` (README, *Slots*).
  The pinned frame (`h-process_sticky`) must stay `position: sticky` with `overflow: hidden`.

### Service Horizontal Scroll Route

One route: a full-bleed photo panel, then its text panel. Slot item of Service Horizontal Scroll. Root
`div.h-process_route` > `.h-process_asset` + `.h-process_slide`.

| Property | Type | Element | Description |
|---|---|---|---|
| Panel Photo | Image | `.h-process_asset-inner img.h-process_img` | The full-bleed photo that drifts as it passes. Landscape, at least 2560px wide. |
| Number | Text | `p.h-process_label` | "01", "02"… |
| Heading | Text | `h2.h-process_heading` | Route heading, line break. |
| Text | Text | `p.h-process_text` | Route description. |
| Side Photo | Image | `img.h-process_photo.is-primary` | Portrait photo beside the text (cropped to fill). |
| Photo Side | Variant | `.h-process_slide-inner` | **Left** (`is-layout-1`) or **Right** (`is-layout-2`); alternate them. |
| Show Button / Button Text / Button Link | Visibility / Text / Link | Main CTA (white) in `.h-process_column.is-text` | Only the last route shows it on Luxury. |

- The last route's text panel is a full screen wide (CSS `.h-process_route:last-child .h-process_slide`), automatic.

### Service Tabs

The tab system: a heading, a bar of tabs with a gliding indicator, and the open tab's panel (photo and text). Used on:
Luxury ("Luxury residential architecture as we practise it"), 3D ("What we can produce"). Root `section.section` >
`.bouncy-tabs.is-tab-bar` (`data-bouncy-tabs-init`).

| Property | Type | Element | Description |
|---|---|---|---|
| Show Label / Label | Visibility / Text | `.wrapper_statement .label-wrapeper p` | Luxury: "Bespoke homes"; 3D has none. |
| Heading | Text | `h2.heading-statement.is-service-tabs` | Line break on Luxury. Has `data-highlight-text` (fixed). |

- **Slot "Tabs"** in `.bouncy-tabs__list` (`data-bouncy-tabs-panels`): **Service Tab** items. 2 to 8 tabs; the tab
  bar wraps onto a second row when the names don't fit.
- **Fixed parts:** the tab bar `.bouncy-tabs__nav` (`data-bouncy-tabs-nav`) holds only the ghost and indicator
  elements; **the tab buttons are built by the script** from each tab's Tab Name, so adding, removing or reordering a
  Tab item is all the client does.
- **Behaviour:** `bouncy-tabs.js` (builds the buttons, opens the first tab, glides the indicator, fades panels in turn,
  animates the panel height, arrow/Home/End keys). `bouncy-tabs.css` (Embed): hidden-panel state, and in the Designer
  (`.wf-design-mode`) every panel shows so each can be edited.

### Service Tab

One tab: its name in the tab bar and its panel. Slot item of Service Tabs. Root `div.bouncy-tabs__item`
(`data-bouncy-tabs-panel`, `role="tabpanel"`).

| Property | Type | Element | Description |
|---|---|---|---|
| Tab Name | Text | `p.bouncy-tabs__tab-name` (hidden) | The word(s) on the tab button ("Site", "Light"…). One or two words. |
| Number | Text | `p.bouncy-tabs__label` | "01", "02"… |
| Heading | Text | `h3.bouncy-tabs__heading` | Panel heading, line break on Luxury. |
| Text | Text | `p.bouncy-tabs__para` | Panel text. |
| Image | Image | `img.bouncy-tabs__item-img` | Panel photo (cropped to fill). |

### Service Sticky Cards

A sticky left panel (heading, intro, button) while photo cards scroll past on the right. Used on: Luxury ("Budget &
planning certainty before you commit"), Rural ("Feasibility before design"), Heritage ("The buildings we work with"),
Planning ("Refused planning permission? What we do next"). Root `section.section.service-cards` >
`.service-cards_layout`.

| Property | Type | Element | Description |
|---|---|---|---|
| Style | Variant | `is-band` on the section, `service-cards_layout` and the cards | **Band** (light grey band: Luxury, Rural) or **Plain** (Heritage, Planning). Set the same on the items. |
| Show Label / Label | Visibility / Text | `.service-cards_label p` | Rural: "Our approach". |
| Heading | Text | `h2.service-cards_heading` | Line break on Luxury and Heritage. |
| Intro | Text | `p.service-cards_intro` | |
| Show Button / Button Text / Button Link | Visibility / Text / Link | Main CTA (black) | Luxury, Heritage, Planning show it; Rural doesn't. |

- **Slot "Cards"** in `.service-cards_right`: **Service Sticky Card** items, or **Service Sticky Card Link** items when
  the cards link (Heritage). 2 to 6 cards.
- **Layout:** the left panel is `position: sticky` (native); the cards stack below 992px.

### Service Sticky Card

A photo card. Slot item of Service Sticky Cards. Root `article.service-cards_card`.

| Property | Type | Element | Description |
|---|---|---|---|
| Style | Variant | `is-band` | **Band** or **Plain**, as the parent. |
| Image | Image | `.service-cards_media img.service-cards_img` | Cropped to fill. |
| Title | Text | `h3.service-cards_title` | Luxury's titles end with a full stop; keep the copy as is. |
| Number | Text | `p.service-cards_number` | "01", "02"… |
| Text | Rich Text | `div.service-cards_text` | One or more paragraphs; style "All Paragraphs" as `.service-cards_text p` (margin 0; .8em between paragraphs). |

### Service Sticky Card Link

The same card as a link block (the whole card links). Slot item of Service Sticky Cards on Heritage. Root
`a.service-cards_card`. Properties as Service Sticky Card, plus **Link** (Link; Heritage: `/services/consultation`,
which needs confirming, see README *Found while preparing*).

### Service Expanding Tiers

A heading row, then photo cards in a row with one open: hovering, focusing or tapping a card opens it on a spring.
Used on: Rural ("Barn conversion planning permission"), Heritage ("The work we take on"), 3D ("Architectural
visualisation service options"), Project Management ("Projects that benefit from construction-stage support"). Root
`section.section.is-service-tiers` > `.container`.

| Property | Type | Element | Description |
|---|---|---|---|
| Style | Variant | `is-dark` on the section and heading/intro | **Dark** (Rural, Heritage, Project Management) or **Light** (3D). |
| Card Height | Variant | `.service-tiers.is-long` | **Standard** or **Tall** (Heritage: longer card text). |
| Heading | Text | `h2.service-editorial_heading` | Line breaks on Rural, 3D, Project Management. 3D adds combo `is-visuals` (wider heading, 3D CSS). Rural's `is-three-line` combo has no styles: drop it. |
| Show Intro / Intro | Visibility / Text | `.service-editorial_aside p.text-size-regular-copy.is-service-editorial` | Rural, Project Management. |
| Show Button / Button Text / Button Link | Visibility / Text / Link | `.service-editorial_aside` Main CTA (black) | 3D. |

- **Slot "Cards"** in `.service-tiers_list` (`data-service-tiers`, on `.service-tiers`): **Service Tier Card** items.
  2 to 4 cards (collapsed cards get narrow beyond that).
- **Behaviour:** `service-tiers.js`: the first card opens (no mark needed), flex-grow springs to 2.4 for the open
  card; sets `--tiers-open-w`, `--tiers-title-w`, `--tiers-text-w` so text doesn't reflow mid-motion; below 992px the
  cards stack and open in height. Each tiers block on a page runs on its own.

### Service Tier Card

Slot item of Service Expanding Tiers. Root `article.service-tiers_card` (`role="listitem"`, `tabindex="0"`,
`data-service-tiers-card`).

| Property | Type | Element | Description |
|---|---|---|---|
| Image | Image | the card's first `img` | Full-card photo under a shade (cropped to fill). |
| Number | Text | `span.service-tiers_number` | "01", "02"… |
| Title | Text | `h3.service-tiers_title` | Shown on closed cards too: keep it short (2 to 5 words). |
| Text | Rich Text | `.service-tiers_reveal-inner` | Revealed when open. Paragraphs styled as `.service-tiers_text` (Heritage has two paragraphs and an inline link); "All Paragraphs" = `service-tiers_text`. |

### Service Expanding List

Centred head, then a list of cards; clicking one opens it (its photo grows, its text appears) and closes the others.
Used on: Heritage ("How a heritage project runs"), Planning ("Architect-led planning application"), 3D ("The projects
we visualise"), Project Management ("What we do, and when"). Root `section.section.is-service-expand.is-dark`.

| Property | Type | Element | Description |
|---|---|---|---|
| Top Spacing | Variant | `is-heritage` | **Standard** or **Tight** (Heritage: less top padding, reads as one band with the section before). |
| Label | Text | `.service-expand_label p` | |
| Heading | Text | `h2.service-expand_heading` | Line break on Heritage and Planning; Project Management has a plain `<br>` ("What we do,/and when"). |
| Show Intro / Intro | Visibility / Text | `p.service-expand_intro` | 3D, Project Management. |

- **Slot "Items"** in `.service-expand_list` (`data-service-expand`): **Service Expanding Item** items. Any number.
- **Behaviour:** `service-expand.js` (one open at a time; ties each title button to its text with a generated
  `aria-controls` id, so items carry no ids); `service-expand.css` (the title button covers the card).
- Project Management keeps the section id `scope` (anchor): set it on this instance's section if instances can carry
  an id; otherwise a page-level anchor div before it (README, *Capabilities to confirm*).

### Service Expanding Item

Slot item of Service Expanding List. Root `article.service-expand_item` (`data-service-expand-item`).

| Property | Type | Element | Description |
|---|---|---|---|
| Number | Text | `p.service-expand_number` | |
| Image | Image | `.service-expand_media img` | Grows when open. |
| Title | Text | `button.service-expand_button` (inside `h3.service-expand_title`) | The button text is the title. |
| Show Text / Text | Visibility / Text | `p.service-expand_text` in `.service-expand_reveal-inner` | Hidden when the item uses activities. |

- **Slot "Activities"** in `.service-expand_activities` (Project Management only; hide the Text): **Service Expanding
  Activity** items.

### Service Expanding Activity

A titled line inside an open Service Expanding Item (Project Management). Root `.service-expand_activity`.
Properties: **Title** (Text, `h4.service-expand_activity-title`), **Text** (Text, `p.service-expand_text.is-activity`).

### Service Fit List

"Is this the right service for your project?": a label at the left, the heading and a ticked list from the sixth
column. Used on: Luxury, Heritage, Project Management ("This is likely to suit you if"). Root
`div.section.is-service-fit` > `.container` > `.service-fit`. "Looking for something else?" is **not** part of it: it
is the separate CMS section that follows ([cms.md](cms.md)).

| Property | Type | Element | Description |
|---|---|---|---|
| Layout | Variant | `.service-fit.is-pm`, `.service-fit_row.is-untitled` | **Standard** (Luxury, Heritage) or **Untitled List** (Project Management: no label, no list title). |
| Show Label / Label | Visibility / Text | `.label-wrapeper.is-service-fit h4.text-size-regular.label` | "Scope". |
| Heading | Text | `h2.service-fit_heading` | Line break. |
| Show List Title / List Title | Visibility / Rich Text | `h3.service-fit_title` | Rich Text because Luxury's title is bold (`<strong>`) and Heritage's isn't; ask the user whether they should match. |
| Show Note / Note | Visibility / Rich Text | `.service-fit_note` > `.service-fit_note-text` | Heritage: one sentence with a link. Style "All Paragraphs" and "All Links" as `.service-fit_note-text p` / `a`. |

- **Slot "Points"** in `.service-fit_list`: **Service Fit Point** items. Any number.

### Service Fit Point

A ticked line. Root `.service-fit_item` (marker `.service-fit_marker.is-tick` + `.service-fit_body`). Property:
**Text** (Text, `p.service-fit_text`).

### Service Overlapping Rows

Full-width rows, each sinking under the next as the page scrolls. Used on: Planning ("Is this the right service for
your project?"), 3D ("Who we produce visualisations for"). Root `section.section.is-service-overlap`.

| Property | Type | Element | Description |
|---|---|---|---|
| Style | Variant | `is-tinted` | **Tinted** (Planning) or **Plain** (3D). |
| Show Label / Label | Visibility / Text | `.service-overlap_label h2.text-size-regular.label` | 3D only; its label reads "FAQs", which looks like a leftover (README, *Found while preparing*). |
| Heading | Text | `.service-overlap_heading` | Heading-level switch: `h2` on Planning, `h3` on 3D (under the h2 label). Line break on Planning; 3D has a plain `<br>`. |
| Show Button / Button Text / Button Link | Visibility / Text / Link | `.service-overlap_head` Main CTA (black, combo `service-overlap_cta`) | Planning. |

- **Slot "Rows"** in `.service-overlap_list` (`data-service-overlap`): **Service Overlapping Row** items. 2 to 6.
- **Behaviour:** `service-overlap.js` (768px and up: each row sinks a quarter of its height under a darkening shade as
  the next slides over; photos revealed from a black cover with a slight zoom).

### Service Overlapping Row

Root `article.service-overlap_row` (`data-service-overlap-row`) > `.container.service-overlap_grid` +
`.service-overlap_shade` (`data-service-overlap-shade`).

| Property | Type | Element | Description |
|---|---|---|---|
| Title | Text | `h3.service-overlap_title` | |
| Text | Text | `p.service-overlap_text` | |
| Number | Text | `p.service-overlap_number` | "1", "2"… (large, light). |
| Image | Image | `.service-overlap_media img` (`data-service-overlap-media`, with its cover `data-service-overlap-cover`) | 5:3, cropped to fill. |

### Service Process Slider

Intro at the left (label, heading, lead, arrows), the step cards in the Osmo Overlapping Slider on the right (drag or
throw; each passed card shrinks and tilts behind the next), square step indicators under it. Used on: Luxury ("From
first conversation to completion"), 3D ("How the process works"). Root `section.section.service-slider`
(`data-service-slider`).

| Property | Type | Element | Description |
|---|---|---|---|
| Label | Text | `.service-slider_label p` | |
| Heading | Text | `h2.service-slider_heading` | Line break on Luxury. Also names the carousel for screen readers (see below). |
| Show Lead / Lead | Visibility / Text | `p.service-slider_lead` | Luxury only. |

- **Slot "Steps"** in `.overlapping-slider__list` (`data-overlap-slider-list`): **Service Process Step** items. 3 to
  10.
- **Fixed parts:** the arrow buttons (`data-service-slider-prev/next`), the slider wrapper
  (`data-overlap-slider-init`, `data-scale="0.45"`, `data-rotate="-8"`) and the empty pagination
  (`data-service-slider-pagination`), filled by the script.
- **Behaviour:** `overlapping-slider.js` then `service-slider.js` (in that order). The pagination is built from the
  step titles (a closing full stop dropped), so a step's name is typed once. The carousel's accessible name is
  `data-overlap-slider-label` when set (locally "Design process steps" / "Visualisation process steps"), else the
  section heading: leave the attribute off in Webflow unless attribute properties exist.

### Service Process Step

Root `div.overlapping-slider__item.service-slider_slide` (`data-overlap-slider-item`) > `article.service-slider_card`.

| Property | Type | Element | Description |
|---|---|---|---|
| Image | Image | `img.service-slider_img` | 16:10, cropped to fill. |
| Title | Text | `h3.service-slider_title` | Also the step's name under the slider (without a closing full stop). |
| Number | Text | `p.service-slider_number` | |
| Text | Text | `p.service-slider_text` | |

### Service FAQ

The FAQ heading and accordion. Used on: all six. Root `.section.padding-top.padding-large-1` (a `section` on Luxury
and Planning, a `div` elsewhere).

| Property | Type | Element | Description |
|---|---|---|---|
| Header | Variant | head | **Stacked** (Luxury, Planning: `.heading-wrapper.is-stacked`, label `h4`, heading `h2`) or **Sub Heading** (Rural, Heritage, 3D, Project Management: the global Sub Heading component, variant "2-1-left-black-text", label `h2`, heading `h3`). The heading levels differ by page; keep them. |
| Label | Text | `.label-wrapeper .label` | "FAQs". |
| Heading | Text | `.text-size-x-large` | Line break on Luxury and Planning. |

- **Slot "Questions"** in `.accordion-css__list`: **Service FAQ Item** items. The accordion wrapper
  `.accordion-css.is-service` keeps `data-accordion-css-init` and `data-accordion-close-siblings="true"`; the
  accordion script is the site's global code.
- **Structured data:** each page's head has FAQPage JSON-LD repeating every question and answer. Editing an FAQ item
  doesn't update it (README, *Open decisions*).

### Service FAQ Item

Root `li.accordion-css__item` (`data-accordion-status="not-active"`, `hover-darken="on"`).

| Property | Type | Element | Description |
|---|---|---|---|
| Question | Text | `h3.text-size-medium.is-service-faq` | |
| Answer | Rich Text | `.text-rich-text-styled.is-service` | Paragraphs, lists and links. Some answers end with an empty paragraph from the Webflow export; it can go. |

### Service Feature Pills

Osmo "Expanding Feature Pills": a list of pills; opening one expands its text (and on the dark card shows its photo).
Used on: Rural (inside Rural Building Types), 3D ("What you receive", in a plain section), Heritage (inside Heritage
Getting It Approved). Root `div.feature-pills__wrap` (`data-feature-pills-init`, `data-feature-pills-active="false"`,
`data-edit-mode="false"`).

| Property | Type | Element | Description |
|---|---|---|---|
| Style | Variant | `is-service` / `is-light` on the wrap and `feature-pills__info-list` | **Dark Card** (Rural, 3D: dark card, heading inside, photos) or **Light** (Heritage: no heading, no photos). |
| Heading | Text | `.service-pills_heading` | Dark Card only. Heading-level switch: `h3` on Rural (inside its section), `h2` on 3D (the section's heading). Rural's has a plain `<br>`. |
| Cover Photo | Image | `[data-feature-pills-cover] img` | Dark Card: the photo shown before a pill is opened. |

- **Slot "Pills"** in `.feature-pills__info-list` (`data-feature-pills-list`): **Service Feature Pill** items.
- **Slot "Pill Photos"** in `.feature-pills__visual-list` (Dark Card only): **Service Feature Pill Photo** items, one
  per pill **in the same order** (the script matches them by position; put this in the slot's description).
- **Accessible name:** the wrap's `aria-label` differs per page ("Building types", "What you receive", "What we prepare
  and coordinate"); needs an attribute property, else a fixed name (README, *Capabilities to confirm*).
- **Behaviour:** `feature-pills.js` + `feature-pills.css`. Below 992px each pill is the column's width and a long
  label wraps inside it.

### Service Feature Pill

Root `li.feature-pills__info-item` (`data-feature-pills-item`).

| Property | Type | Element | Description |
|---|---|---|---|
| Label | Text | `.feature-pills__item-label` (in the button) | The pill's name. |
| Body | Rich Text | `.feature-pills__item-inner` | The expanded text. 3D: one paragraph; Heritage: several (`p.feature-pills__item-body`); Rural: a lead line, a blank line and a lighter sentence (`span.feature-pills__item-body-span`). In Webflow write Rural's lead and sentence as two paragraphs; style "All Paragraphs" as `feature-pills__item-body` and the second like the span (one rule in `feature-pills.css`: `.feature-pills__item-inner p + p`); compare against the local page. |

### Service Feature Pill Photo

Root `div.feature-pills__visual-item` (`data-feature-pills-visual`, `aria-hidden="true"`). Property: **Photo**
(Image, its `img`).

### Service Split Text

Sticky heading at the left, formatted text at the right, per row. Used on: Planning ("Site appraisal before you pay
for drawings"), 3D (two rows). Root `div.section.is-service-split`.

- **Slot "Rows"** directly in the section: **Service Split Row** items.

### Service Split Row

Root `div.container` > `.container.blog-page.is-service-split` > `.row.is-service-split` (global grid columns
`col-lg-4` sticky / `col-lg-1 hide-tablet` / `col-lg-7`).

| Property | Type | Element | Description |
|---|---|---|---|
| Heading | Text | `h2.heading-style-h2-normal.resize.is-service` | |
| Body | Rich Text | `.text-rich-text-styled.is-service.is-small` | Nested paragraph styles at 991px (`text-rich-text-styled is-service`, see the older guide's limitation on nested rich-text styles). |
| Show Related Reading / Reading Label | Visibility / Text | `.service-reading` > `p.service-reading_label` | Planning: "Related reading". |

- **Slot "Related Reading"** in `ul.service-reading_list`: **Service Reading Link** items.

### Service Reading Link

Root `li.service-reading_item` > `a.service-reading_link`. Properties: **Link Text** (Text), **Link** (Link).

### Service Route Cards

Planning's "The planning routes we prepare": stacked-rows head, then text cards in rows of two, a wide and a narrow
card swapping sides row by row. Used on: Planning. Root
`section.section.is-service-editorial.is-stacked.is-process.is-routes`.

| Property | Type | Element | Description |
|---|---|---|---|
| Label | Text | `.service-stack_label p` | "Routes". |
| Heading | Text | `h2.service-stack_heading` | Line break. |
| Intro | Text | `p.service-stack_intro` | |

- **Slot "Routes"** in `.service-routes`: **Service Route Card** items, in pairs (wide + narrow).

### Service Route Card

Root `article.service-routes_card`.

| Property | Type | Element | Description |
|---|---|---|---|
| Width | Variant | `is-wide` / `is-narrow` | Pair a wide and a narrow card per row, swapping sides each row. |
| Tone | Variant | `is-mid` / `is-deep` / none | Card tone (three steps of the ivory scale, cycling mid, light, deep), as on the page: 1 wide mid, 2 narrow, 3 narrow deep, 4 wide mid, 5 wide, 6 narrow deep, 7 narrow mid, 8 wide. |
| Icon | Image | `.service-routes_icon` | Inline SVG today; upload each as an SVG asset (or an Embed if it must inherit colour). |
| Title | Text | `h3.service-routes_title` | |
| Text | Text | `p.service-routes_text` | |

### Service Pair Cards

Two equal photo cards side by side. Used on: Rural (barn types). Root `section.section.is-service-pair` >
`.container` > `.service-pair`.

- **Slot "Cards"** in `.service-pair`: **Service Pair Card** items (two; they stack below 768px).

### Service Pair Card

Root `article.service-pair_card`.

| Property | Type | Element | Description |
|---|---|---|---|
| Image | Image | `.service-pair_media img` | 3:2, cropped to fill. |
| Title | Text | `h2.service-pair_title` | Line break. |
| Number | Text | `p.service-pair_number` | |
| Body | Rich Text | `.service-pair_body` | One or two paragraphs (`p.service-pair_text`; "All Paragraphs" = that class). |
| Show Button / Button Text / Button Link | Visibility / Text / Link | `.service-pair_actions` Main CTA (black, combo `service-pair_cta`) | The second card shows it. |

### Service Inline CTA

A sentence and a button. Used on: Heritage ("Not sure whether your project needs consent…"), 3D ("More of our
residential and rural work."). Root: Heritage `section.section.is-service-cta-band`, 3D `div.section`; inside,
`.container` > `.service-cta`.

| Property | Type | Element | Description |
|---|---|---|---|
| Style | Variant | section `is-service-cta-band` + `service-cta is-in-band` / `service-cta is-boxed` | **Band** (Heritage: on a light grey band) or **Boxed** (3D: a stone panel). |
| Text | Text | `p.service-cta_text` | |
| Button Text / Button Link | Text / Link | Main CTA (black) | Heritage: "Free Consultation" → `/contact`; 3D: "All projects" → `/projects`. |

### Service CTA Bar

The fixed consultation bar (back-to-top square and consultation pill), centred at the bottom of the screen. Used on:
all six (`shared/partials/service-cta-bar.html`), outside the page wrapper. Root `div.service-cta-bar.is-hidden`
(`data-service-cta-bar`).

| Property | Type | Element | Description |
|---|---|---|---|
| Label | Text | `.service-cta-pill_text` | "Free Consultation". Keep it short: the pill must fit a phone screen. |
| Link | Link | `a.service-cta-pill` | `/contact`. |

- **Behaviour:** `service-cta-bar.js` toggles `is-hidden` (shown once the hero button leaves the screen, hidden over
  the footer); the square (`data-service-cta-top`) scrolls to the top through Lenis.

### Service Logo

The fixed top-left logo shown at 991px and below, where the floating navigation has none. Used on: all six
(`shared/partials/service-logo.html`). Root `a.service-logo` (link `/`). No properties.

---

## Page-only section components

### Rural Building Types

Rural's opening section: a rotating headline, the building types as feature pills, a button. Root
`section.section.is-rural-showcase`.

| Property | Type | Element | Description |
|---|---|---|---|
| Button Text / Button Link | Text / Link | `.rural-showcase_actions` Main CTA (black) | |

- **Heading** (`h2.rotating-text__heading`) holds the rotating word in a span (`rotating-text__highlight`) and its
  words in attributes (`data-words="planning, design, structural"`, `data-step-duration="2"`), so it is built fixed in
  the component, not as a property; if attribute properties exist, expose **Rotating Words**. Script
  `rotating-text.js` + `rotating-text.css`.
- Contains **Service Feature Pills** (Dark Card) inside `.service-pills`.

### Rural Design

Rural's dark split row. Root `section.rural-design-section`.

| Property | Type | Element | Description |
|---|---|---|---|
| Heading | Text | `h2.heading-style-h2-normal.resize.is-service` | |
| Body | Rich Text | `.text-rich-text-styled.is-service.is-small` | |

- The section starts with an empty `div.container`; check it renders nothing and leave it out.

### Rural Who We Work With

A light band: centred heading over one rounded panel split in three columns. Root `section.section.is-rural-clients`
> `.rural-clients_band` > `.container`. Fixed structure (three columns, numbered 01 to 03 in the component).

| Property | Type | Element | Description |
|---|---|---|---|
| Heading | Text | `h2.rural-clients_heading` | |
| Client Type 1 / 2 / 3 | Text | each `.rural-clients_col p.rural-clients_text` | |

- "Looking for something else?" follows as its own CMS section on the same band colour ([cms.md](cms.md)).

### Heritage Getting It Approved

One panel: heading and three consent paragraphs, then "What we prepare and coordinate" with light feature pills, then
a button. Root `section.section.heritage-approval` > `.container` > `.heritage-approval_panel`.

| Property | Type | Element | Description |
|---|---|---|---|
| Heading | Text | `h2.heritage-approval_heading` | |
| Intro | Rich Text | `.heritage-approval_intro` | Three paragraphs (`p.heritage-approval_text`), the last with a link (`a.heritage-approval_link`) to the old prototype site. |
| Subheading | Text | `h3.heritage-approval_subheading` | Plain `<br>` ("What we prepare / and coordinate"). |
| Button Text / Button Link | Text / Link | `.heritage-approval_actions` Main CTA (black) | |

- Contains **Service Feature Pills** (Light) in `.heritage-approval_tabs`.

### Project Management Case Study

One stone panel: a construction photo at the left; label, heading and the project at the right. Root `section.pm-case`
> `.container` > `.pm-case_grid`.

| Property | Type | Element | Description |
|---|---|---|---|
| Image | Image | `.pm-case_media img` | |
| Label | Text | `.label-wrapeper.is-pm p` | "On site". |
| Heading | Text | `h2.pm-h2.is-case` | |
| Project Name | Text | `h3.pm-case_name` | |
| Text | Text | `p.pm-case_text` | |
| Link Text / Link | Text / Link | `a.pm-case_link` | "View 55 Derby Road →" → `/projects/55-derby-road`. |

- Could later bind to one Projects item instead (ask the user); not part of this plan.
