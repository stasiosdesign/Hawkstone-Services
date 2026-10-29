# 3D Visualisations

| | |
|---|---|
| Local file | `services/3d-visualisations.html` + `services/css/3d-visualisations.css` (combos `is-visuals`, `is-boxed`) |
| Webflow page | `/services/3d-visualisations`; Services item **3D Visualisations** |
| Page wrapper | `page-wrapper is-service` |
| Global, before the wrapper | Page Transition (text "3D Visualisations"), Global Code, Navigation [2], Navigation Desktop (white-text variant) |
| Fixed | Service Logo, Service CTA Bar (Label "Free Consultation") |
| Custom CSS (one Embed) | `text-line-mask`, `service-typography`, `service-projects`, `feature-pills`, `service-editorial`, `service-expand`, `sticky-steps`, `bouncy-tabs` |
| Page scripts, in order | `bouncy-tabs`, `feature-pills`, `overlapping-slider`, `service-slider`, `service-expand`, `service-tiers`, `service-overlap`, `service-hero`, `service-cta-bar` |
| Head code | title, description, canonical and the JSON-LD graph (FAQPage with the 9 questions) from the page file's `<head>` |

Headings and photos per section: [inventory.md](../inventory.md#3d-visualisations). Components: [components.md](../components.md).

## Section order

| # | Section | Built as | Name | Settings | Notes |
|---|---|---|---|---|---|
| 1 | Hero | Component | Service Hero | Heading Start "—", Highlight "Architectural Visualisation", End "& 3D CGI for Residential Projects (non-breaking spaces in "& 3D CGI")"; Button Text "Free Consultation" | One H1; the highlight in the accent serif italic. |
| 2 | Who we produce visualisations for | Component | Service Overlapping Rows | Style Plain; Show Label (reads "FAQs"); heading h3 with a plain line break; no button; 3 Rows | The "FAQs" label looks like a leftover: ask before changing. |
| 3 | What you receive | Section + component | Service Feature Pills | Plain section `section is-service-pills` holding Service Feature Pills (Dark Card): heading h2 "What you receive", 5 Pills, 5 Pill Photos, cover photo | The same component is nested on Rural and Heritage, so here a native Section wraps it. |
| 4 | Nav trigger | Page element | Nav Trigger | empty div `data-nav-show-after="true"` | The floating navigation appears after section 3. |
| 5 | Seeing the design / Using CGI | Component | Service Split Text | 2 Rows; no related reading | |
| 6 | What we can produce | Component | Service Tabs | no label; 7 Tabs (Exterior, Interior, Aerial, Dusk, Materials, Animation, Virtual reality) | The tab bar wraps onto two rows on narrow screens. |
| 7 | The projects we visualise | Component | Service Expanding List | Top Spacing Standard; Label "Routes"; Show Intro; 4 Items | |
| 8 | How the process works | Component | Service Process Slider | Label "Our approach"; no lead; 7 Steps | |
| 9 | Recent work | CMS section | CMS: Projects | Project Type contains 3D Visualisations; label "Recent work", own heading; summaries shown; no "View All Projects" | [cms.md](../cms.md#recent-projects-all-six-pages), decision 5. |
| 10 | More of our residential and rural work | Component | Service Inline CTA | Style Boxed; button "All projects" → `/projects` | Stands in for "View All Projects". |
| 11 | Architectural visualisation service options | Component | Service Expanding Tiers | Style Light; Card Height Standard; heading combo `is-visuals`; Show Button "Free Consultation"; 3 Cards | |
| 12 | FAQ | Component | Service FAQ | Header Sub Heading; heading "Common questions about architectural visualisation"; 9 Questions | |
| 13 | Final CTA | Global component | Section - Final CTA | heading "Unlock the Potential of your project", button "Get in Touch" | |
| 14 | Footer | Global component | Section - Footer | | |

## Interactions and layout to keep

- **Overlapping rows**, **feature pills** (photo per pill), **tabs** (7, built from the panels), **expanding list**,
  **process slider** (drag/throw, arrows, indicators), **Recent work** stacking panels, **expanding tiers** (light).
- `highlight-text.js` isn't loaded on this page, so the tabs heading (`data-highlight-text`) doesn't animate here;
  that's existing behaviour.
- `sticky-steps.css` is in this page's Embed but no sticky steps remain on it; check before dropping it.
