# Rural Conversions

| | |
|---|---|
| Local file | `services/rural-conversions.html` + `services/css/rural-conversions.css` (page classes `rural-*`, combos `is-rural…`) |
| Webflow page | `/services/rural-conversions`; Services item **Rural Conversions** |
| Page wrapper | `page-wrapper is-service is-rural` |
| Global, before the wrapper | Page Transition (text "Rural Conversions"), Global Code, Navigation [2], Navigation Desktop (white-text variant) |
| Fixed | Service Logo, Service CTA Bar (Label "Free Consultation") |
| Custom CSS (one Embed) | `text-line-mask`, `service-typography`, `service-projects`, `service-editorial`, `feature-pills`, `rotating-text`, `service-rows` |
| Page scripts, in order | `feature-pills`, `rotating-text`, `service-tiers`, `service-overlap`, `service-hero`, `service-cta-bar` |
| Head code | title, description, canonical and the JSON-LD graph (FAQPage with the 9 questions) from the page file's `<head>` |

Headings and photos per section: [inventory.md](../inventory.md#rural-conversions). Components: [components.md](../components.md).

## Section order

| # | Section | Built as | Name | Settings | Notes |
|---|---|---|---|---|---|
| 1 | Hero | Component | Service Hero | Heading Start "—", Highlight "Barn Conversion", End "Architecture for Derbyshire, Staffordshire & Cheshire"; Button Text "Free Consultation" | One H1; the highlight in the accent serif italic. |
| 2 | Building types | Component | Rural Building Types | Rotating words "planning, design, structural" (2s); Service Feature Pills (Dark Card): heading "Types of projects / we work with" (h3; was "Types of barns" until 29 Oct 2026), aria-label "Types of projects", 5 Pills, 5 Pill Photos, cover photo; button "Free Consultation" | Rotating headline + pills, see below. |
| 3 | Barn types | Component | Service Pair Cards | 2 Cards; card 2 Show Button "Free Consultation" | Card 1 body has two paragraphs. |
| 4 | Nav trigger | Page element | Nav Trigger | empty div `data-nav-show-after="true"` | The floating navigation appears after section 3. |
| 5 | Barn conversion planning permission | Component | Service Expanding Tiers | Style Dark; Card Height Standard; Show Intro; 4 Cards (Class Q prior approval, Full planning permission, Class R, Farm diversification) | Card 4 added on 29 Oct 2026 (source note in the page file); four cards still fit the row (collapsed titles on two lines).  The section's id `statement-plan-approved` is an export leftover nothing links to; leave it out. |
| 6 | Feasibility before design | Component | Service Sticky Cards | Style Band; Show Label "Our approach"; no button; 3 Cards (Band) | |
| 7 | Recent Projects | CMS section | CMS: Projects | Project Type contains Rural Conversions; label "Projects"; **black** "View All Projects" | [cms.md](../cms.md#recent-projects-all-six-pages) |
| 8 | Design | Component | Rural Design | | Dark split row; drop the empty first container. |
| 9 | Who we work with | Component | Rural Who We Work With | 3 client types (the third: "A developer planning a small rural residential, commercial or industrial scheme", 29 Oct 2026) | Light band (ivory-d1). |
| 10 | Looking for something else? | CMS section | CMS: Services | `is-service-rows is-rural`, rows `is-rural-boundaries`, heading aligned with the titles (`is-at-title`), no intro; Heritage Design, Luxury Architecture | Same band colour as section 9, no gap. Decisions 1-2 in [cms.md](../cms.md#decisions-for-the-user-before-building-these-sections). |
| 11 | FAQ | Component | Service FAQ | Header Sub Heading; heading "Questions Before You Start"; 9 Questions | |
| 12 | Client Success | Global component | Section - Testimonials | | Existing instance. |
| 13 | Final CTA | Global component | Section - Final CTA | heading "Unlock the Potential of your project", button "Get in Touch" | |
| 14 | Footer | Global component | Section - Footer | | |

## Interactions and layout to keep

- **Rotating headline** (`rotating-text.js`, `rotating-text.css`): the highlighted word cycles through the three words
  every 2s inside a line mask.
- **Feature pills** (`feature-pills.js`): opening a pill expands it (back.out ease, 0.5s) and shows its photo; the
  close button resets to the cover photo. Pills and photos match by order. Rural's pill bodies are a lead line, a blank
  line and a lighter sentence (see Service Feature Pill in the catalogue).
- **Expanding tiers** (`service-tiers.js`): first card open; hover, focus or tap opens another on a spring; below 992px
  they stack.
- **Recent Projects:** full-screen panels stacking on scroll (`service-overlap.js`, 768px and up).
- The Class R card's copy was written on 23 Oct 2026 from the legislation (comment in the page file).
