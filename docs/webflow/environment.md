# Webflow environment

What the Webflow MCP connection reaches and the rules around it. Checked read-only on 29 October 2026; nothing was
changed in Webflow. Re-check the parts marked as they can change (pages, last publish dates, components).

## Connection

| | |
|---|---|
| Server | Webflow MCP 2.2.0, attached to Claude Code as a connector (tool names `mcp__…__data_sites_tool` etc.) |
| Account | the user's Webflow login; workspace `65df18f2c1730e0d5cec8ef6`. The token also reaches seven other client sites (Stasiosdesign, Epitessera, ATN…): see *Guard* |
| Session | every call needs `agent_id` and `session_id` (`start` on the first call of a task, then the issued `ses_…`); call `webflow_guide_tool` first |
| Data tools | REST API: pages, elements (`data_element_tool`, `data_element_builder`, `data_whtml_builder`), styles, variables, components, CMS, assets, scripts, publishing. Work without the Designer. Reads verified. |
| Designer tools | `designer_tool`, `element_snapshot_tool`: act on an open Designer session. **Not available until the site is open in the Webflow Designer with Webflow's MCP companion app running** (the snapshot test failed with `status: false` without it). |

## The site

| | |
|---|---|
| Name / ID | HAWKSTONE DEVELOPMENTS, `69525a8c456ef60671509d83` (short name `hawkstone-developments-staging`) |
| Staging | https://hawkstone-developments-staging.webflow.io (no password; `robots.txt` disallows all). Last published 29 Oct 2026 18:30 |
| Production | `hawkstone-developments.co.uk` (custom domain ID `698a4896f4f077d795dbcd2d`) and `www.hawkstone-developments.co.uk` (`698a4897f4f077d795dbcd5e`, redirects to the bare domain). Last published **1 Sep 2026**. **Never publish here.** |
| Plan | **not Enterprise**: no page branching, no Releases (site branches), no single-page publishing. Every publish publishes the whole site. |
| Locale | English only (locale `69525a8c456ef60671509d8a`, CMS locale `69525a8c456ef60671509d8b`) |

**Consequence of whole-site publishing:** anything built in the Webflow project (classes, components, page content)
is published with the site, to staging when we publish, and to production the next time anyone publishes the custom
domains from the Designer. Production already lags staging by two months of changes. Agree with the user that nobody
publishes production from the Designer while the rebuild is in progress, or that what is staged by then is acceptable.

### The six service pages

They exist, under the `/services` folder (`69dec38f914e158e7f070835`), with their SEO titles and descriptions set.
On 29 Oct 2026 (edited 18:29-18:30) each was an **empty shell**: global setup (Page Transition, Site Setup Code,
Navigation [2], Navigation Desktop, Services Pages CSS), then a `page-wrapper` holding only Section - Final CTA and
Section - Footer. None is on production (404 there: created after the last production publish).

| Page | Page ID | Path |
|---|---|---|
| Luxury Architecture | `6a96cb4957238b4e24a478b8` | `/services/luxury-architecture` |
| Rural Conversions | `6a970b0227ded20bd397ddae` | `/services/rural-conversions` |
| Planning Applications | `6a970b0f8f33c3f7e338b743` | `/services/planning-applications` |
| Heritage Design | `6a970b1bd2f06aa2c7e5854a` | `/services/heritage-design` |
| 3D Visualisations | `6a970b26a3b4271aa57c0f92` | `/services/3d-visualisations` |
| Project Management | `6a970b2f83c8893b415525a0` | `/services/project-management` |

- Luxury's `page-wrapper` carries the combo `is-rural`; the plan expects `page-wrapper is-service` (Rural:
  `is-service is-rural`). Check all six before building.
- The 34 other pages (Home, About, Contact, Projects, News, Overview, Planning, Consultation, Design & Build, Barn
  Conversion - Derbyshire, the location pages, legal pages, CMS templates, Style Guide, 404, Password) are out of
  scope: read only.

### CMS collections

| Collection | ID | Slug |
|---|---|---|
| Projects | `695c1aaa2c39c9715fd59499` | `projects` |
| Services | `6a96a23462bea739ae306340` | `services-cms` (template page `/services-cms/…`) |
| Blog Posts | `6964c9c6847e01b139507c49` | `news` |
| Testimonials | `698a19ed10ff1f3a7dfd93f1` | `testimonials` |
| Locations Lists | `69eb63df727319b3d7280716` | `location-id` |

Field slugs are not read yet: read them (`get_collection_details`) at the start of the CMS work ([cms.md](cms.md)).

### Existing components the rebuild reuses (never edit)

| Name in Webflow | ID | Instances | In the docs |
|---|---|---|---|
| Main CTA | `9178b398-9941-f569-9140-c1d5c93f4af9` | 210 | Main CTA (nested in most components) |
| Sub-Heading | `9dd04a78-44ae-88da-5da3-5a69b78e3e00` | 86 | Sub Heading (FAQ header variant) |
| FAQ Item | `fb70b6ac-4198-abd1-3388-beed75e2a5ec` | 168 | **already exists**: decide whether Service FAQ Item reuses it instead of a new component |
| Section - Final CTA | `88ae2575-f11a-9495-1f92-3de995d2f8d8` | 31 | props Text, Variant, Link, label |
| Section - Testimonials | `6f1c4305-3982-2d43-01a4-333bce552a33` | 7 | Client Success |
| Section - Footer | `5823ab83-92f4-7bf7-3ce1-93d8cf1e3c4c` | 34 | |
| Navigation Desktop | `1ca70887-1d10-fa58-fd82-bd8cf8f0b8a9` | 34 | white-text variant on the service pages |
| Navigation [2] | `f2f9bbb1-ced3-c168-edc2-746e58b0f453` | 34 | floating navigation (a separate "Navigation-2" also exists: don't confuse them) |
| Page Transition | `543b8b3e-dc55-a9f6-f3c8-11b5446c3e99` | 33 | prop Page Name (bound to the page name) |
| Site Setup Code | `af0f85c2-1484-4119-eb7c-7707246b3b09` | 36 | what the docs call Global Code |
| Services Pages CSS | `56351572-d3b3-4280-3be1-9318b98080e2` | 6 | the six pages' current embed; to be replaced by the files in README *Custom code* |
| Logo-Tablet-Nav | `914a80b7-7d35-f52a-fe9f-a7b03ddb8237` | 12 | compare with Service Logo before creating it |
| Approval Card | `4eb82ba6-4813-4e2f-f710-99f13721ad7e` | 7 | the old Planning approvals cards |

Also present: Process Step (75), Stacking Card (9), Tabbed Content (1), Image Cycle, Carousel Images /Home, Award
Block, Interactive Map, Location Pages CSS, H1 Heading, text-block, Text Block Section and others: other pages' parts.

### Answers to the README's *Capabilities to confirm*

- **Text properties keep line breaks** (verified: the Final CTA's `label` property holds `Staffordshire,\nCheshire`).
- **Branching / single-page publishing:** not available (plan).
- Component, slot, variant and nested-property creation: not tried yet (a write); try first on a throwaway component,
  with the user's OK.

## Publishing: staging only (guard)

The user has authorised publishing **to the Webflow staging subdomain only**, and forbids publishing to production or
any custom domain under any circumstances. Publish with:

```
data_sites_tool > publish_site { site_id: "69525a8c456ef60671509d83", customDomains: [], publishToWebflowSubdomain: true }
```

A Claude Code hook enforces it: `C:\Users\Anast\.claude\hooks\webflow-guard.ps1`, run before every Webflow MCP call.

| Layer | Registered in | Does |
|---|---|---|
| Always | `~/.claude/settings.json` (every session on this computer) | For the Hawkstone site: denies `publish_site` with any custom domain or without `publishToWebflowSubdomain: true`; denies `publish_collection_items` / `unpublish_collection_items` on Hawkstone collections (they change the live site); denies any other publish action on Hawkstone except branch staging previews. Other sites are unaffected. |
| Hawkstone sessions | `Site Export/.claude/settings.json` (sessions opened in `Site Export`) | Also denies any call naming another site, and asks the user before CMS writes, deletions, removals, merges and replacements. |

Both use `onFailure: block`: if the guard itself fails, the call is blocked. Tested on 29 Oct 2026 with every case
(pipe tests) and live: a CMS publish on Projects and a read on another client's site were both blocked before
reaching Webflow. CMS items can therefore only be staged (draft / ready to publish) from Claude; the user publishes
CMS items to the live site in Webflow when the site goes live. Sessions opened in `service-pages` itself get only the
always-on layer.

## Seeing the work

| What | How | Verified |
|---|---|---|
| Staging and live pages, desktop/tablet/phone | headless Edge through Playwright (the Codex Node runtime; see the repo's `scripts/` and the session notes on the Node path), screenshots at any width | yes (staging and live) |
| The same, interactively | the Claude desktop app's built-in browser pane (it may pause animations when the pane is hidden) | yes (staging loads) |
| Local vs Webflow, element styles | `node scripts/compare-pages.cjs --a http://localhost:5190 --b https://hawkstone-developments-staging.webflow.io` | script exists; run it after the first rebuilt page |
| Local vs Webflow, pixels | the pixel-compare approach used for the local passes (same scroll offsets, viewport shots) against the staging URL | method proven locally |
| An element as built, before publishing | `element_snapshot_tool` | needs the Designer open with the companion app |

Staging only shows what has been published, so the loop is: build (API), publish to staging (allowed), check with
the tools above, adjust.
