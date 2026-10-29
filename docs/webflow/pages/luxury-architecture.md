# Luxury Architecture

| | |
|---|---|
| Local file | `services/luxury-architecture.html` (+ `services/css/luxury-architecture.css`, empty: everything is shared) |
| Webflow page | `/services/luxury-architecture`; Services item **Luxury Architecture** |
| Page wrapper | `page-wrapper is-service` |
| Global, before the wrapper | Page Transition (text "Luxury Architecture"), Global Code, Navigation [2], Navigation Desktop (white-text variant) |
| Fixed | Service Logo, Service CTA Bar (Label "Free Consultation") |
| Custom CSS (one Embed) | `text-line-mask`, `service-typography`, `service-projects`, `service-editorial`, `bouncy-tabs`, `service-rows` |
| Page scripts, in order | `highlight-text`, `horizontal-process`, `bouncy-tabs`, `overlapping-slider`, `service-slider`, `service-overlap`, `service-hero`, `service-cta-bar` |
| Head code | title, description, canonical and the JSON-LD graph (WebPage, ProfessionalService, Services/offers, BreadcrumbList, FAQPage with the 8 questions) from the page file's `<head>` |

Headings and photos per section: [inventory.md](../inventory.md#luxury-architecture). Components: [components.md](../components.md).

## Section order

The *Name* column is checked against the page by `scripts/migration-check.mjs`.

| # | Section | Built as | Name | Settings | Notes |
|---|---|---|---|---|---|
| 1 | Hero | Component | Service Hero | Heading Start "—", Highlight "Luxury home", End "architecture for bespoke new homes"; Button Text "Free Consultation" | One H1; the highlight in the accent serif italic. |
| 2 | Statement | Component | Service Statement | Style Light; Statement as heading (h2); no label, note or button | Highlights word by word from "top 60%". The section's id `statement-plan-approved` is an export leftover nothing links to; leave it out. |
| 3 | What we design | Component | Service Horizontal Scroll | Section Label "What we design"; 3 Routes: Photo Side Left, Right, Left; route 3 Show Button "Free Consultation" | See *What we design* below. |
| 4 | Nav trigger | Page element | Nav Trigger | empty div `data-nav-show-after="true"` | The floating navigation appears after section 3. |
| 5 | Luxury residential architecture as we practise it | Component | Service Tabs | Show Label "Bespoke homes"; 4 Tabs: Site, Light, Materials, Restraint | See *Tabs* below. |
| 6 | Budget & planning certainty before you commit | Component | Service Sticky Cards | Style Band; Show Button "Free Consultation"; 3 Cards (Band) | See *Budget and planning certainty* below. |
| 7 | Recent Projects | CMS section | CMS: Projects | Project Type contains Luxury Architecture; white "View All Projects" | [cms.md](../cms.md#recent-projects-all-six-pages) |
| 8 | Is this the right service for your project? | Component | Service Fit List | Layout Standard; Label "Scope"; List Title "It’s for you if:" (bold); 4 Points; no note | See *Is this the right service* below. |
| 9 | Looking for something else? | CMS section | CMS: Services | `is-service-rows is-after-fit`; all services but Luxury | [cms.md](../cms.md#looking-for-something-else-rural-heritage-luxury-project-management) |
| 10 | From first conversation to completion | Component | Service Process Slider | Label "Feasibility before design"; Show Lead; 6 Steps | Drag/throw carousel, arrows, step indicators. |
| 11 | FAQ | Component | Service FAQ | Header Stacked; heading "Questions we’re asked about bespoke and luxury homes" (line break); 8 Questions | Keep the FAQPage JSON-LD in step. |
| 12 | Final CTA | Global component | Section - Final CTA | heading "Unlock the Potential of your project", button "Get in Touch", locations line | Existing instance; never edit the component. |
| 13 | Footer | Global component | Section - Footer | | |

## The four sections the brief names

### What we design (Service Horizontal Scroll)

- **Content:** Section Label, intro Heading and Intro; three **Service Horizontal Scroll Route** items in the
  **Routes** slot, each a full-bleed Panel Photo, Number (01-03), Heading, Text and a portrait Side Photo; Photo Side
  alternates Left / Right / Left; only route 3 shows its button.
- **Slots:** yes. The routes are repeated, self-contained units, so a slot lets the client add, remove or reorder one
  without touching the scroll set-up; the script measures the track, so the number of routes is free (1 to 6
  recommended).
- **Interaction to keep:** desktop (992px and up): the section pins and its height is set from the horizontal travel
  (scroll speed factor 1.63, as fluid.glass); the track slides left; the top rule fills as a progress bar; each
  full-bleed photo drifts from -25% to 25% (scaled 1.1); each side photo eases in from 20%; the last route's text panel
  is a full screen wide so the track ends on it. Below 992px everything stacks (photo 3:2, then text, then the side
  photo at 80% width) with no motion.
- **Constraints:** the pinned frame clips horizontally by design; keep `h-process_sticky` sticky with
  `overflow: hidden`, and the track `width: max-content`. If the slot adds a wrapper element in the track, give it
  `display: contents`.

### Luxury residential architecture as we practise it (Service Tabs)

- **Content:** Label, Heading (line break), then four **Service Tab** items in the **Tabs** slot, each with its Tab
  Name (the tab button's word), Number, Heading (line break), Text and Image.
- **Slots:** yes: each tab is one item holding its own name and content; the tab buttons are built from the items, so
  adding a tab is one step.
- **Interaction to keep:** the first tab opens on load; the dark indicator glides to the clicked tab (0.45s,
  power3.out) and a light ghost follows the pointer; the outgoing panel fades out (0.2s) before the incoming one slides
  in 20px and fades in (0.45s) while the panel height animates; Left/Right/Home/End keys move between tabs; reduced
  motion switches instantly.

### Budget and planning certainty before you commit (Service Sticky Cards)

- **Content:** Heading (line break), Intro, the black Main CTA; three **Service Sticky Card** items (Band) with Image,
  Title (ending with a full stop, as the copy), Number and Text.
- **Slots:** yes (cards). The left panel stays a fixed structure.
- **Layout to keep:** light grey band; two equal columns split by a 1px rule; the left panel sticks while the cards
  scroll past; below 992px the cards follow the panel.

### Is this the right service for your project? (Service Fit List)

- **Content:** Label "Scope", Heading (line break), the bold List Title and four **Service Fit Point** items in the
  **Points** slot.
- **Interactive behaviour:** none in the fit list itself; the hover (row tint, photo zoom, arrow turn) belongs to the
  "Looking for something else?" rows that follow, now a separate CMS section with the same spacing as before.

## Other notes

- Recent Projects' local cards (Luxury Development 1, Sandborough House Farmhouse, Furs House) are temporary.
- The FAQ answers are in the page file; the second answer ends with an empty paragraph from the Webflow export.
