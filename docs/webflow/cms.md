# CMS-powered sections

Three kinds of section on the service pages are CMS-powered and are **not** Webflow Components: they are built
directly on each page as a static header plus a Collection List. They reuse the site's existing **Projects** and
**Services** collections; nothing here needs a new collection or a hand-kept project list.

| Section | Pages | Collection | Markup |
|---|---|---|---|
| Recent Projects (3D: "Recent work") | all six | Projects | `section.is-service-projects`, from `shared/partials/service-projects.html` (`data-migrate-cms="Projects"`) |
| Recent Approvals | Planning | Projects | `section.recent-approvals` (`data-migrate-cms="Projects"`) |
| Looking for something else? | Rural, Heritage, Luxury, Project Management | Services | `section.is-service-rows` (`data-migrate-cms="Services"`) |

In the markup, `data-migrate-list` marks the element that becomes the Collection List and `data-migrate-list-item`
each static item that a Collection Item replaces. The static items are temporary: they keep the local pages working
and are not the final selection.

## The collections (known so far)

Seen in the user's CMS screenshots on 19 October 2026; **field slugs, IDs and the image/alt fields are unconfirmed**.
Read the live schema first (Webflow MCP, CMS tools) and fill in the *Slug* columns before building anything.

**Services** (6 items: Rural Conversions, Heritage Design, Luxury Architecture, Planning Applications, 3D
Visualisations, Project Management; "3D Visualisations" spelt with an s).

| Field (as seen) | Type | Slug | Used for |
|---|---|---|---|
| Name | Plain text | `name` (Webflow default) | Row title, Recent Projects filter value |
| Image(s) | Image | to confirm | Row photo (4:3, cropped) |
| Icon | Image | to confirm | Not used by these sections |
| Link to the service page | Link | to confirm | Row link (`/services/<slug>`) |
| Short description | ? | **may not exist** | Row text: see *Looking for something else?*, decision 1 |
| Order | Number | **may not exist** | Row order: see decision 3 |

**Projects** (18 items; pages at `/projects/<slug>`).

| Field (as seen) | Type | Slug | Used for |
|---|---|---|---|
| Name | Plain text | `name` | Panel title |
| Project Type | Multi-reference → Services | to confirm | Which service pages show the project. Help text: the project "will appear in the projects slider on those service pages". |
| Sorting | Number (smaller = first) | to confirm | Order |
| Main image | Image | to confirm | Panel photo (full screen: at least 1920px wide) |
| Summary (short description) | Plain text | to confirm; **add it if missing** | Each Recent Projects panel's description (`service-projects_text`), on all six pages since 29 Oct 2026 |
| Featured Project | Switch | to confirm | Not used here (navigation dropdown and home hero) |
| Status | ? | to confirm | Possibly Recent Approvals' filter (decision 4) |
| Location, Client, Project Value, Completion Date | various | to confirm | Not used |

## Recent Projects (all six pages)

**Relationship:** the filter runs from Projects to Services. A project appears on every service page whose Services
item is selected in its **Project Type** field. Selecting Rural Conversions and Planning Applications on a project
puts it on both pages, with no duplicate items and no list to maintain.

```
section.section.is-service-projects                      static, on the page (not a component)
  .service-projects_header                               static: optional label, heading
  Collection List Wrapper
    Collection List  .service-projects_list  [data-service-overlap]     Projects
        filter: Project Type contains <this page's Services item>
        sort:   Sorting, ascending          limit: 3
      Collection Item  .service-projects_panel  [data-service-overlap-row]
        .service-projects_media [data-service-overlap-media]
          img.service-projects_img        ← Main image (sizes 100vw; alt from the CMS if a field exists)
          .service-projects_cover [data-service-overlap-cover]
        .container.service-projects_content
          .service-projects_info
            h3.heading-style-h3-brand.is-service-projects   ← Name
            p.service-projects_text        ← Summary (all six; conditional visibility: hide when empty)
          Main CTA (white) "View Project", class service-projects_cta    link → Current Project
        .service-overlap_shade [data-service-overlap-shade]
    Empty State: hidden (display none)
  .service-projects_actions                               static Main CTA "View All Projects" → /projects
```

| Page | Services item in the filter | Header | Actions |
|---|---|---|---|
| Rural Conversions | Rural Conversions | label "Projects", heading "Recent Projects" | "View All Projects", **black** Main CTA |
| Heritage Design | Heritage Design | "Recent Projects" | white Main CTA |
| Luxury Architecture | Luxury Architecture | "Recent Projects" | white Main CTA |
| Planning Applications | Planning Applications | "Recent Projects" | white Main CTA |
| 3D Visualisations | 3D Visualisations | label "Recent work", heading "Projects where the design was resolved visually before it was resolved on site." | none (the Service Inline CTA after it links to all projects) |
| Project Management | Project Management | "Recent Projects" | white Main CTA |

- **Classes on the right elements:** the stacking script (`service-overlap.js`) looks for rows inside
  `[data-service-overlap]`, so put the list class and attribute on the Collection List element and the panel class and
  row attribute on the **Collection Item** itself. Check the Collection List has no gap or flex styles of its own.
- **Fewer than three projects:** fewer panels; the last never sinks, so the motion holds. Hide the empty state.
- **Hover:** slow photo zoom in `service-projects.css` (Embed), keyed to these classes; works on CMS items.
- **"View Project":** a Main CTA instance inside the item, its link set to the current Project page.

## Recent Approvals (Planning)

Osmo "Parallax Image Slider (Smooothy)": a head (label "Planning Success", heading "Recent Approvals", previous/next
buttons), then a full-width slider of project photos, each with an "Approved" badge and a "View Project" link, and the
project's name beneath the card.

```
section.section.recent-approvals.is-planning.is-soft  [data-parallax-section]     static (not a component)
  .container > .approvals-slider_head                                            static
  .parallax-slider__group [data-parallax-init] > .parallax-slider__collection
    Collection List  .parallax-slider__list  [data-parallax-slider][data-parallax-infinite="true"]
                     [data-parallax-amount="10"][data-parallax-snap="true"]       Projects (selection: decision 4)
      Collection Item  .parallax-slider__item
        .parallax-slider__item-inner                                  (corners .3em since 29 Oct 2026)
          .parallax-slider__item-visual [data-parallax-inner] > img   ← Main image
          .approvals-slider_shade, span.approvals-slider_badge (static "Approved" + icon)
          a.approvals-slider_link [draggable="false"] "View Project"    link → Current Project
        h3.approvals-slider_name                                       ← Name (accent serif, under the card)
```

- Script `parallax-slider.js` after Smooothy 0.0.35 from unpkg (Planning's page code); it reads whatever items are
  rendered. Styles `parallax-slider__*`, `approvals-slider_*` in `services/css/planning-applications.css`.
- Seven static slides today, all temporary. Their names are the Projects names from the site export's projects page
  (Sandboro House Farm, Furs House, Trent Lane, Nightingale Lane, Derby Road, Luxury Glamping Scheme, Castle Street),
  matched to the slides' existing project links.
- The name wraps at the card's width (`width: 0; min-width: 100%`), so a long name never widens its slide.

## Looking for something else? (Rural, Heritage, Luxury, Project Management)

The other services as editorial rows: number, name, arrow, a short text, a photo; each whole row links to the service.

```
section.section.is-service-rows (+ is-after-fit, or is-rural on Rural)                static (not a component)
  .service-rows (+ is-rural-boundaries on Rural)
    .service-rows_head                     static: heading "Looking for something else?" (+ intro with a link)
    Collection List  .service-rows_list                                               Services
      Collection Item  .service-rows_row.is-link
        div.service-rows_index              (empty: the number is a CSS counter)
        h4.service-rows_title               ← Name (one word per line by max-width: min-content)
        a.service-rows_link [aria-label]    ← link field; aria-label "View <Name> service" (bind if possible)
          img.service-rows_arrow
        p.service-rows_text                 ← short description (decision 1)
        .service-rows_media > img.service-rows_img   ← Image
        .service-rows_rule
```

- **Prepared for the CMS (October 2026):** the rows are a section of their own (no longer inside the fit section);
  the numbers come from a counter in `service-rows.css` (`counter(service-rows, decimal-leading-zero)`, reset on
  `.service-rows`, so two lists in one block number on); the names carry no line break.
- **Spacing:** `is-after-fit` takes no top padding (the fit section's bottom padding is the gap) and the fit section's
  bottom padding; `is-rural` sits on the Who We Work With band colour with no top padding.
- **Filter (all but this page's service):** exclude the page's own Services item. If the Collection List can't
  exclude one item on a static page, show all six and hide the own row in the page's Embed, e.g.
  `.service-rows_row:has(a[href="/services/luxury-architecture"]) { display: none; }` (a hidden row doesn't count, so
  the numbers stay 01-05).

| Page | Rows today | Text today |
|---|---|---|
| Luxury | Rural, Heritage, Planning, 3D, Project Management | each service's meta description |
| Heritage | Rural, Luxury, Planning, 3D, Project Management | each service's meta description (the same texts) |
| Project Management | Rural, Luxury, Heritage, Planning, 3D (a different order) | short taglines ("Rural building transformations"…) |
| Rural | Heritage, Luxury only | sentences written for this page ("If your barn is listed…") |

## Decisions for the user (before building these sections)

1. **Row text.** One Services field can hold one text per service. Luxury and Heritage use the services' meta
   descriptions; Project Management uses shorter taglines; Rural uses its own sentences. Options: add a plain-text
   "Summary" field (the meta descriptions) and, if wanted, a "Tagline" field for Project Management; Rural's sentences
   can't come from the collection, so Rural either takes the Summary (a copy change the user must approve: the copy is
   keyword-optimised) or keeps those two rows as static page content.
2. **Rural's selection.** Two chosen services, not "all but this one". With Webflow's AND-only filters: two Collection
   Lists of one item each (Heritage Design, Luxury Architecture) inside the same `.service-rows`; the counter numbers
   them 01, 02.
3. **Order.** Today Rural, Heritage, Luxury, Planning, 3D, Project Management (Project Management's list differs). Sort
   by a Services number field if one exists; otherwise add one, or accept another order.
4. **Recent Approvals selection.** "Project Type contains Planning Applications" repeats the Recent Projects section on
   the same page; a Status (approved) filter, or a dedicated switch, may be what the user wants. Ask.
5. **Project summaries.** Every Recent Projects panel shows a short description (the 3D page's treatment, applied to
   all six on 29 Oct 2026). Confirm or add a plain-text Summary field on Projects and write one per project. Only three
   real descriptions exist today, all written for the 3D page (Sandboro House Farm, Furs House, Barn Conversion Tean);
   they are reused verbatim where the same project appears (Luxury, Rural) and read from a visualisation angle, so
   the user may want neutral versions. Every other panel shows the placeholder "[Project description to come from the
   Projects CMS]": nothing was invented.
