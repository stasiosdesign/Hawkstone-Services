# Project Management

| | |
|---|---|
| Local file | `services/project-management.html` + `services/css/project-management.css` (classes `pm-*`, combos `is-pm`) |
| Webflow page | `/services/project-management`; Services item **Project Management** |
| Page wrapper | `page-wrapper is-service` |
| Global, before the wrapper | Page Transition (text "Project Management"), Global Code, Navigation [2], Navigation Desktop (white-text variant) |
| Fixed | Service Logo, Service CTA Bar (Label "Free Consultation") |
| Custom CSS (one Embed) | `text-line-mask`, `service-typography`, `service-projects`, `service-editorial`, `service-expand`, `service-rows` |
| Page scripts, in order | `highlight-text`, `service-expand`, `service-tiers`, `service-overlap`, `service-hero`, `service-cta-bar` |
| Head code | title, description, canonical and the JSON-LD graph (FAQPage with the 9 questions) from the page file's `<head>` |

Headings and photos per section: [inventory.md](../inventory.md#project-management). Components: [components.md](../components.md).

## Section order

| # | Section | Built as | Name | Settings | Notes |
|---|---|---|---|---|---|
| 1 | Hero | Component | Service Hero | Heading Start "Independent", Highlight "project management", End "through construction"; Button Text "Free Consultation" | One H1; the highlight in the accent serif italic. |
| 2 | Statement | Component | Service Statement | Style With Note; Statement as paragraph; Show Label "Construction-stage support"; Show Note | |
| 3 | What we do, and when | Component | Service Expanding List | Top Spacing Standard; Label "Scope"; Show Intro; 3 Items, each with Text hidden and an **Activities** slot (2, 4 and 2 Service Expanding Activity items) | Keeps the anchor id `scope` (README, *Capabilities to confirm*). |
| 4 | Work we have supported through construction | Component | Project Management Case Study | 55 Derby Road, Melbourne → `/projects/55-derby-road` | |
| 5 | Projects that benefit from construction-stage support | Component | Service Expanding Tiers | Style Dark; Card Height Standard; Show Intro; 3 Cards | |
| 6 | This is likely to suit you if | Component | Service Fit List | Layout Untitled List; no label; 4 Points | |
| 7 | Looking for something else? | CMS section | CMS: Services | `is-service-rows is-after-fit`; all services but Project Management, in this page's own order with short taglines | Decisions 1 and 3 in [cms.md](../cms.md#decisions-for-the-user-before-building-these-sections). |
| 8 | Recent Projects | CMS section | CMS: Projects | Project Type contains Project Management; white "View All Projects" | [cms.md](../cms.md#recent-projects-all-six-pages) |
| 9 | FAQ | Component | Service FAQ | Header Sub Heading; heading "Common questions"; 9 Questions | |
| 10 | Final CTA | Global component | Section - Final CTA | heading "Unlock the Potential of your project", button "Get in Touch" | |
| 11 | Footer | Global component | Section - Footer | | |

## Interactions and layout to keep

- **Floating navigation:** this page has no nav trigger. Its statement carried `data-nav-show-after="yes"`, which the
  navigation script never matched (it looks for `"true"`), so the floating navigation shows from the top here, unlike
  the other five. Kept as is; ask the user whether it should appear after the statement like the others.
- **Statement** highlights word by word; **expanding list** opens one stage at a time, revealing its activities;
  **expanding tiers** spring open; **Recent Projects** panels stack.
