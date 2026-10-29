# Heritage Design

| | |
|---|---|
| Local file | `services/heritage-design.html` + `services/css/heritage-design.css` (classes `heritage-*`, combos `is-heritage`, `is-light`) |
| Webflow page | `/services/heritage-design`; Services item **Heritage Design** |
| Page wrapper | `page-wrapper is-service` |
| Global, before the wrapper | Page Transition (text "Heritage Design"), Global Code, Navigation [2], Navigation Desktop (white-text variant) |
| Fixed | Service Logo, Service CTA Bar (Label "Free Consultation") |
| Custom CSS (one Embed) | `text-line-mask`, `service-typography`, `service-projects`, `service-editorial`, `feature-pills`, `service-rows`, `service-expand` |
| Page scripts, in order | `highlight-text`, `feature-pills`, `service-expand`, `service-tiers`, `service-overlap`, `service-hero`, `service-cta-bar` |
| Head code | title, description, canonical and the JSON-LD graph (FAQPage with the 9 questions) from the page file's `<head>` |

Headings and photos per section: [inventory.md](../inventory.md#heritage-design). Components: [components.md](../components.md).

## Section order

| # | Section | Built as | Name | Settings | Notes |
|---|---|---|---|---|---|
| 1 | Hero | Component | Service Hero | Heading Start "Architectural Design for", Highlight "Listed Buildings", End "—"; Button Text "Free Consultation" | One H1; the highlight in the accent serif italic. |
| 2 | The buildings we work with | Component | Service Sticky Cards | Style Plain; Show Button "Free Consultation"; 4 **Service Sticky Card Link** items | Cards link to `/services/consultation` (to confirm). |
| 3 | The work we take on | Component | Service Expanding Tiers | Style Dark; Card Height **Tall**; no intro; 3 Cards | Card texts have two paragraphs; card 3 links to the Rural Conversions page inline. |
| 4 | Nav trigger | Page element | Nav Trigger | empty div `data-nav-show-after="true"` | The floating navigation appears after section 3. |
| 5 | Getting it approved | Component | Heritage Getting It Approved | Service Feature Pills (Light): 4 Pills, no photos; button "Free Consultation" | Intro's third paragraph links to the old prototype's guide. |
| 6 | Not sure whether your project needs consent… | Component | Service Inline CTA | Style Band; button "Free Consultation" → `/contact` | |
| 7 | Recent Projects | CMS section | CMS: Projects | Project Type contains Heritage Design; white "View All Projects" | [cms.md](../cms.md#recent-projects-all-six-pages) |
| 8 | Highlight statement | Component | Service Statement | Style Dark; Statement as paragraph (`is-heritage`); Show Button "Free Consultation" (white) | |
| 9 | How a heritage project runs | Component | Service Expanding List | Top Spacing Tight (`is-heritage`); Label "Our process"; no intro; 6 Items | |
| 10 | Is this the right service for your project? | Component | Service Fit List | Layout Standard; Label "Scope"; List Title "This service suits you if" (not bold); 6 Points; Show Note | Note: one sentence with the "Green Belt guide" link, whose address is `#` (placeholder). |
| 11 | Looking for something else? | CMS section | CMS: Services | `is-service-rows is-after-fit`; all services but Heritage | [cms.md](../cms.md#looking-for-something-else-rural-heritage-luxury-project-management) |
| 12 | FAQ | Component | Service FAQ | Header Sub Heading; heading "Questions Before You Start"; 9 Questions | |
| 13 | Client Success | Global component | Section - Testimonials | | Existing instance. |
| 14 | Final CTA | Global component | Section - Final CTA | heading "Unlock the Potential of your project", button "Get in Touch" | |
| 15 | Footer | Global component | Section - Footer | | |

## Interactions and layout to keep

- **Sticky cards:** left panel sticks while four linked photo cards scroll past (cards tint/zoom on hover).
- **Expanding tiers (Tall):** taller row for the two-paragraph texts; first card open; spring widths.
- **Feature pills (Light):** pills open in place to show their deliverables (no photo column); the close control sits
  at the top right of the column.
- **Statement:** highlights word by word (`highlight-text.js`, loaded on this page).
- **Expanding list:** one card open at a time; the photo grows and the text appears.
- **Looking for something else?:** row tint, photo zoom and arrow turn on hover; whole row links.
