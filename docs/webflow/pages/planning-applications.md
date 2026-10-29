# Planning Applications

| | |
|---|---|
| Local file | `services/planning-applications.html` + `services/css/planning-applications.css` (Recent Approvals slider, `is-planning` combos) |
| Webflow page | `/services/planning-applications`; Services item **Planning Applications** |
| Page wrapper | `page-wrapper is-service` |
| Global, before the wrapper | Page Transition (text "Planning Applications"), Global Code, Navigation [2], Navigation Desktop (white-text variant) |
| Fixed | Service Logo, Service CTA Bar (Label "Free Consultation") |
| Custom CSS (one Embed) | `text-line-mask`, `service-typography`, `service-projects`, `service-editorial`, `service-expand` |
| Page scripts, in order | `highlight-text`, Smooothy 0.0.35 (`https://unpkg.com/smooothy@0.0.35/dist/smooothy.min.js`), `parallax-slider`, `service-overlap`, `service-expand`, `service-hero`, `service-cta-bar` |
| Head code | title, description, canonical and the JSON-LD graph (FAQPage with the 10 questions) from the page file's `<head>` |

Headings and photos per section: [inventory.md](../inventory.md#planning-applications). Components: [components.md](../components.md).

## Section order

| # | Section | Built as | Name | Settings | Notes |
|---|---|---|---|---|---|
| 1 | Hero | Component | Service Hero | Heading Start "—", Highlight "Planning permission", End "architects for homes, plots and residential schemes"; Button Text "Free Consultation" | One H1; the highlight in the accent serif italic. |
| 2 | Highlight statement | Component | Service Statement | Style Soft; Statement as paragraph (`is-planning`) | White band running into Recent Approvals. |
| 3 | Recent Approvals | CMS section | CMS: Projects | Parallax slider; each card's project name beneath it (Name, accent serif); card corners .3em; selection to decide | [cms.md](../cms.md#recent-approvals-planning), decision 4. |
| 4 | Nav trigger | Page element | Nav Trigger | empty div `data-nav-show-after="true"` | The floating navigation appears after section 3. |
| 5 | Is this the right service for your project? | Component | Service Overlapping Rows | Style Tinted; no label; heading h2 (line break); Show Button "Free Consultation"; 3 Rows | |
| 6 | Architect-led planning application | Component | Service Expanding List | Top Spacing Standard; Label "Our approach"; no intro; 8 Items | Item 2's text is a fragment ("arranged and coordinated by us."); items 4-6 repeat Heritage's texts: content for the user to check, not to edit. |
| 7 | The planning routes we prepare | Component | Service Route Cards | Label "Routes"; 8 Routes in four rows of two (width and tone as in the catalogue) | Routes 7 "Pre-applications" and 8 "Permission in principle and technical details consent" added on 29 Oct 2026, written from GOV.UK planning guidance (source note in the page file). The page's JSON-LD offer list doesn't name them (unchanged; the user's call). |
| 8 | Site appraisal before you pay for drawings | Component | Service Split Text | 1 Row with Show Related Reading: 3 Service Reading Link items | The reading links point at the old prototype site (`hawkstone-developments-testing.vercel.app/news/…`). |
| 9 | Refused planning permission? What we do next | Component | Service Sticky Cards | Style Plain; Show Button "Free Consultation"; 3 Cards | |
| 10 | Recent Projects | CMS section | CMS: Projects | Project Type contains Planning Applications; white "View All Projects" | [cms.md](../cms.md#recent-projects-all-six-pages) |
| 11 | FAQ | Component | Service FAQ | Header Stacked; heading "Questions we’re asked about planning applications" (line break); 10 Questions | |
| 12 | Final CTA | Global component | Section - Final CTA | heading "Unlock the Potential of your project", button "Get in Touch" | |
| 13 | Footer | Global component | Section - Footer | | |

## Interactions and layout to keep

- **Recent Approvals:** Osmo parallax slider on Smooothy: drag/swipe, infinite, snaps to one slide; previous/next
  buttons step one project; each photo moves in parallax (amount 10).
- **Overlapping rows:** rows sink under the next as the page scrolls (768px and up); photos revealed from black.
- **Expanding list:** one item open at a time.
- **Statement:** highlights word by word.
