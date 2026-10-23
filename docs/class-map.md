# Class map: old Webflow classes to the refactored classes

Generated from the Webflow export (the pages in `reference/`) and the refactor's mapping. Each row is a class chain as Webflow writes it: the base class followed by its combo classes (`w-` framework classes left out). Pages: RC Rural Conversions, HD Heritage Design, LA Luxury Architecture, PA Planning Applications, 3D 3D Visualisations, PM Project Management.

"Global (no new CSS)" means the element now uses only existing site-wide classes: the old combo had no styles of its own, or had none that differed.

## Hero

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `demo-section` | `service-hero` | RC HD 3D PM | shared/css/service-pages.css |
| `service-page-hero top` | `service-hero_heading-wrap` | RC HD 3D PM | shared/css/service-pages.css |
| `heading-style-h1-normal services-page is-rural` | `heading-style-h1-normal is-service-hero` | RC | shared/css/service-pages.css |
| `service-page-hero bottom` | `service-hero_content` | RC HD 3D PM | shared/css/service-pages.css |
| `div-block-78` | `service-hero_actions` | RC HD LA PA 3D PM | shared/css/service-pages.css |
| `heading-style-h1-normal services-page` | `heading-style-h1-normal is-service-hero` | HD 3D PM | shared/css/service-pages.css |
| `demo-section is-lux` | `service-hero` | LA | shared/css/service-pages.css |
| `service-page-hero top is-lux` | `service-hero_heading-wrap` | LA | shared/css/service-pages.css |
| `heading-style-h1-normal services-page is-lux` | `heading-style-h1-normal is-service-hero` | LA | shared/css/service-pages.css |
| `service-page-hero bottom is-lux` | `service-hero_content` | LA | shared/css/service-pages.css |
| `demo-section is-plan` | `service-hero` | PA | shared/css/service-pages.css |
| `service-page-hero top is-plan` | `service-hero_heading-wrap` | PA | shared/css/service-pages.css |
| `heading-style-h1-normal services-page is-plan` | `heading-style-h1-normal is-service-hero` | PA | shared/css/service-pages.css |
| `service-page-hero bottom is-plan` | `service-hero_content` | PA | shared/css/service-pages.css |

## Hero: spatial slider (Osmo component)

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `cover-image-2` | `spatial-gsap-slider__img` | RC HD LA PA 3D PM | shared/css/service-pages.css |

## Global classes only

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `text-size-small service-page is-rural` | `text-size-small service-page` | RC | global (no new CSS) |
| `label-wrapeper _2-1-left-black-text-3` | `label-wrapeper` | HD LA | global (no new CSS) |
| `yellow-dot _2-1-left-black-text-4` | `yellow-dot` | HD LA | global (no new CSS) |
| `text-size-x-large _2-1-left-black-text-7` | `text-size-x-large` | HD LA 3D | global (no new CSS) |
| `text-size-small service-page is-lux` | `text-size-small service-page` | LA | global (no new CSS) |
| `section luxury` | `section` | LA PA 3D | global (no new CSS) |
| `label-wrapeper _2-1-left-black-text-10` | `label-wrapeper` | LA PA | global (no new CSS) |
| `yellow-dot _2-1-left-black-text-11` | `yellow-dot` | LA PA | global (no new CSS) |
| `text-size-x-large _2-1-left-black-text-14` | `text-size-x-large` | LA PA | global (no new CSS) |
| `text-size-small service-page is-plan` | `text-size-small service-page` | PA | global (no new CSS) |

## Sticky steps

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `sticky-steps barn-page sticky` | `sticky-steps is-service` | RC HD LA 3D | shared/css/service-pages.css |

## Showcase (Osmo radial cards slider + rotating headline)

Replaced on 18 Oct 2026 by the Osmo Expanding Feature Pills (see webflow-migration.md 3d). Only `section is-rural-showcase`, `rural-showcase_content` and `rural-showcase_actions` remain; the card and `radial-gsap-slider*` classes below are no longer used.

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `section barn-page showcase` | `section is-rural-showcase` | RC | services/css/rural-conversions.css |
| `mwg018-card final-cta` | `rural-showcase_card` | RC | services/css/rural-conversions.css |
| `tech-card_strip final-cta` | `rural-showcase_card-row` | RC | services/css/rural-conversions.css |
| `svg-10` | `rural-showcase_card-icon` | RC | services/css/rural-conversions.css |
| `heading-style-label` | `rural-showcase_card-label` | RC | services/css/rural-conversions.css |
| `svg-10 br` | `rural-showcase_card-icon is-flipped` | RC | services/css/rural-conversions.css |
| `final-cta-image` | `rural-showcase_card-img` | RC | services/css/rural-conversions.css |
| `final-cta-card-darken` | `rural-showcase_card-overlay` | RC | services/css/rural-conversions.css |
| `div-block-119` | `rural-showcase_content` | RC | services/css/rural-conversions.css |
| `cta-wrapper` | `rural-showcase_actions` | RC | services/css/rural-conversions.css |

## Pathway cards

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `section barn-page options` | `section is-rural-pathways` | RC | services/css/rural-conversions.css |
| `service-pathway-wrapper black is-options` | `service-pathway-wrapper black is-service` | RC HD PM | shared/css/service-pages.css |
| `inner-wrapper_pathways _1 v2 is-options` | `inner-wrapper_pathways _1 v2 is-service` | RC HD 3D PM | shared/css/service-pages.css |
| `div-block-79 white` | `service-pathway_icon is-intro` | RC HD PM | shared/css/service-pages.css |
| `svg-9` | `service-pathway_arrow` | RC HD PM | shared/css/service-pages.css |
| `service-pathways_heading is-options` | `service-pathways_heading is-service` | RC HD 3D | shared/css/service-pages.css |
| `inner-wrapper_pathways _2 v2 is-options` | `inner-wrapper_pathways _2 v2 is-service` | RC HD PA 3D PM | shared/css/service-pages.css |
| `text-size-regular-copy is-rural` | `text-size-regular-copy is-service` | RC HD PA 3D PM | shared/css/service-pages.css |
| `inner-wrapper_pathways _3 v3 is-options` | `inner-wrapper_pathways _3 is-service` | RC HD PA 3D PM | shared/css/service-pages.css |
| `service-pathway-wrapper is-options` | `service-pathway-wrapper is-service` | RC HD PA 3D PM | shared/css/service-pages.css |
| `div-block-79` | `service-pathway_icon` | RC HD PA 3D PM | shared/css/service-pages.css |
| `number is-options` | `service-pathway_number` | RC HD 3D PM | shared/css/service-pages.css |
| `section listed-buildings _4x` | `section is-service-pathways` | HD 3D PM | shared/css/service-pages.css |
| `inner-wrapper_pathways _1 v2 is-options is-plan` | `inner-wrapper_pathways _1 v2 is-service is-planning` | PA | services/css/planning-applications.css |
| `number is-options is-plan` | `service-pathway_number is-planning` | PA | services/css/planning-applications.css |
| `service-pathways_heading is-options is-plan` | `service-pathways_heading is-service is-planning` | PA | services/css/planning-applications.css |
| `service-pathways_heading is-options is-pm` | `service-pathways_heading is-service is-pm` | PM | services/css/project-management.css |
| `pm-pathway-link` | `pm-pathway_link` | PM | services/css/project-management.css |

## Section intro

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `section barn-page feasibility` | `section is-service-timeline` | RC LA PA 3D | shared/css/service-pages.css |
| `container services-page is-rural` | `container is-service-intro is-rural` | RC | services/css/rural-conversions.css |
| `label-wrapeper services-page` | `label-wrapeper is-service-intro` | RC LA PA 3D | shared/css/service-pages.css |
| `text-size-medium is-rural` | `text-size-medium is-service-intro` | RC LA PA 3D | shared/css/service-pages.css |
| `text-size-x-large (inside container services-page)` | `text-size-x-large is-service-intro` | RC LA PA 3D | shared/css/service-pages.css |
| `container feas-wrap` | `container is-service-timeline` | RC LA 3D | shared/css/service-pages.css |
| `container services-page is-rural is-lux` | `container is-service-intro` | LA PA 3D | shared/css/service-pages.css |
| `container feas-wrap is-plan` | `container is-service-timeline is-planning` | PA | services/css/planning-applications.css |

## Step timeline (Osmo component)

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `step-timeline is-feas` | `step-timeline` | RC LA PA 3D | shared/css/service-pages.css |
| `step-timeline__wrapper is-feas` | `step-timeline__wrapper` | RC LA PA 3D | shared/css/service-pages.css |
| `step-timeline__line is-feas is-rural` | `step-timeline__line` | RC LA PA 3D | shared/css/service-pages.css |
| `step-timeline__list is-feas` | `step-timeline__list` | RC LA PA 3D | shared/css/service-pages.css |
| `step-timeline__item is-feas is-rural` | `step-timeline__item` | RC LA PA 3D | shared/css/service-pages.css |
| `feas-step-media is-rural` | `service-timeline_media is-wide` | RC 3D | shared/css/service-pages.css |
| `feas-step-img` | `service-timeline_img` | RC LA PA 3D | shared/css/service-pages.css |
| `step-timeline__marker is-feas` | `step-timeline__marker` | RC LA PA 3D | shared/css/service-pages.css |
| `step-timeline__content is-feas is-rural` | `step-timeline__content` | RC LA PA 3D | shared/css/service-pages.css |
| `feas-step-text` | `service-timeline_text` | RC LA PA 3D | shared/css/service-pages.css |
| `step-timeline__content-h is-feas` | `step-timeline__content-h` | RC LA PA 3D | shared/css/service-pages.css |
| `step-timeline__p is-feas is-rural` | `step-timeline__p` | RC LA PA 3D | shared/css/service-pages.css |
| `feas-step-media luxury-ark` | `service-timeline_media is-square` | LA PA | shared/css/service-pages.css |

## Split text

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `section barn-page cost` | `section is-service-split` | RC HD PA 3D | shared/css/service-pages.css |
| `container blog-page` | `container blog-page is-service-split` | RC HD LA PA 3D | shared/css/service-pages.css |
| `row info-block` | `row is-service-split` | RC HD LA PA 3D | shared/css/service-pages.css |
| `col col-lg-4 col-md-12 stick` | `col col-lg-4 col-md-12 is-sticky` | RC HD LA PA 3D | shared/css/service-pages.css |
| `text-rich-text-styled smaller` | `text-rich-text-styled is-service is-small` | RC HD PA 3D | shared/css/service-pages.css |
| `text-rich-text-styled` | `text-rich-text-styled is-service` | RC HD LA PA 3D PM | shared/css/service-pages.css |
| `container v2222` | `container is-planning-split` | PA | services/css/planning-applications.css |

## Projects slider

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `layered-slider` | `layered-slider is-service` | RC HD PA | shared/css/service-pages.css |
| `layered-slider white` | `layered-slider white is-service` | LA | shared/css/service-pages.css |

## Inline CTA

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `hrt-cta` | `service-cta` | HD 3D | shared/css/service-pages.css |
| `hrt-cta__text` | `service-cta_text` | HD 3D | shared/css/service-pages.css |

## Highlight statement

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `section background-color-black v2` | `section background-color-black v2 is-heritage` | HD | services/css/heritage-design.css |
| `section servcie-page-varient is-plan` | `section is-planning-intro` | PA | services/css/planning-applications.css |
| `heading-style-h1-brand-plannign-page` | `planning-intro_heading` | PA | services/css/planning-applications.css |

## Fit lists

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `section listed-buildings yes-no` | `section is-service-fit` | HD LA | shared/css/service-pages.css |
| `hfit` | `service-fit` | HD LA 3D | shared/css/service-pages.css |
| `hfit__grid` | `service-fit_grid` | HD LA 3D | shared/css/service-pages.css |
| `hfit__col` | `service-fit_col` | HD LA 3D | shared/css/service-pages.css |
| `hfit__col-title` | `service-fit_title` | HD LA | shared/css/service-pages.css |
| `hfit__list` | `service-fit_list` | HD LA 3D | shared/css/service-pages.css |
| `hfit__item` | `service-fit_item` | HD LA 3D | shared/css/service-pages.css |
| `hfit__marker` | `service-fit_marker` | HD LA 3D | shared/css/service-pages.css |
| `hfit__body` | `service-fit_body` | HD LA 3D | shared/css/service-pages.css |
| `hfit__run` | `service-fit_text` | HD LA 3D | shared/css/service-pages.css |
| `hfit__col-alt` | `service-fit_col is-alt` | HD LA 3D | shared/css/service-pages.css |
| `hfit__marker-alt` | `service-fit_marker is-alt` | HD LA | shared/css/service-pages.css |
| `hfit__link` | `service-fit_link` | HD | shared/css/service-pages.css |
| `hfit__note` | `service-fit_note` | HD | shared/css/service-pages.css |
| `hfit__note-text` | `service-fit_note-text` | HD | shared/css/service-pages.css |

## Stacked sub-heading

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `heading-wrapper _2-1-left-black-text` | `heading-wrapper is-stacked` | HD LA 3D | shared/css/service-pages.css |
| `div-block-41 _2-1-left-black-text-2` | `div-block-41 is-stacked` | HD LA 3D | shared/css/service-pages.css |
| `text-size-regular label _2-1-left-black-text-5` | `text-size-regular label is-stacked` | HD LA | shared/css/service-pages.css |
| `div-block-40 _2-1-left-black-text-6` | `div-block-40 is-stacked` | HD LA 3D | shared/css/service-pages.css |
| `heading-wrapper _2-1-left-black-text-8` | `heading-wrapper is-stacked` | LA PA | shared/css/service-pages.css |
| `div-block-41 _2-1-left-black-text-9` | `div-block-41 is-stacked` | LA PA | shared/css/service-pages.css |
| `text-size-regular label _2-1-left-black-text-12` | `text-size-regular label is-stacked` | LA PA | shared/css/service-pages.css |
| `div-block-40 _2-1-left-black-text-13` | `div-block-40 is-stacked` | LA PA | shared/css/service-pages.css |

## Statement

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `section statment_plan-approved-copy` | `section is-service-statement` | LA 3D PM | shared/css/service-pages.css |
| `pm-statement-note` | `pm-statement_note` | PM | services/css/project-management.css |

## Bouncy tabs (Osmo component)

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `heading-statement _2222` | `heading-statement is-service-tabs` | LA 3D | shared/css/service-pages.css |
| `section luxury on-dark` | `section is-service-dark` | PA | shared/css/service-pages.css |
| `heading-statement _2222 white` | `heading-statement is-service-tabs is-dark` | PA | shared/css/service-pages.css |
| `bouncy-tabs__nav on-dark` | `bouncy-tabs__nav is-dark` | PA | shared/css/service-pages.css |
| `bouncy-tabs__ghost on-dark` | `bouncy-tabs__ghost is-dark` | PA | shared/css/service-pages.css |
| `bouncy-tabs__indicator on-dark` | `bouncy-tabs__indicator is-dark` | PA | shared/css/service-pages.css |
| `bouncy-tabs__button on-dark` | `bouncy-tabs__button is-dark` | PA | shared/css/service-pages.css |
| `bouncy-tabs__collection on-dark` | `bouncy-tabs__collection is-dark` | PA | shared/css/service-pages.css |
| `bouncy-tabs__heading on-dark` | `bouncy-tabs__heading is-dark` | PA | shared/css/service-pages.css |
| `bouncy-tabs__para on-dark` | `bouncy-tabs__para is-dark` | PA | shared/css/service-pages.css |

## Numbered steps

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `container luxury certainty` | `container is-service-steps` | LA PA 3D | shared/css/service-pages.css |
| `qstep-section top` | `service-steps_item is-first` | LA PA 3D | shared/css/service-pages.css |
| `qstep` | `service-steps_row` | LA PA 3D | shared/css/service-pages.css |
| `qstep__badge` | `service-steps_badge` | LA PA 3D | shared/css/service-pages.css |
| `qstep__num` | `service-steps_number` | LA PA 3D | shared/css/service-pages.css |
| `qstep__title` | `service-steps_title` | LA PA 3D | shared/css/service-pages.css |
| `qstep__body` | `service-steps_body` | LA PA 3D | shared/css/service-pages.css |
| `qstep__run` | `service-steps_text` | LA PA 3D | shared/css/service-pages.css |
| `qstep-section` | `service-steps_item` | LA PA 3D | shared/css/service-pages.css |
| `qcard-section` | `service-steps_cta` | LA PA | shared/css/service-pages.css |
| `qcard` | `service-steps_cta-card` | LA PA | shared/css/service-pages.css |
| `qcard__text` | `service-steps_cta-text` | LA | shared/css/service-pages.css |

## Recent approvals

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `section recent-approvals is-plan` | `section recent-approvals is-planning` | PA | services/css/planning-applications.css |

## Lead paragraph

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `vis-lead` | `visuals-lead` | 3D | services/css/3d-visualisations.css |

## The gap this fills

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `pm-gap__grid` | `pm-gap_grid` | PM | services/css/project-management.css |
| `pm-gap__aside` | `pm-gap_aside` | PM | services/css/project-management.css |
| `pm-gap__body` | `pm-gap_body` | PM | services/css/project-management.css |
| `pm-gap__lead` | `pm-gap_lead` | PM | services/css/project-management.css |
| `pm-gap__para` | `pm-gap_para` | PM | services/css/project-management.css |
| `pm-gap__closing` | `pm-gap_closing` | PM | services/css/project-management.css |
| `pm-gap__closing-text` | `pm-gap_closing-text` | PM | services/css/project-management.css |
| `pm-gap__media` | `pm-gap_media` | PM | services/css/project-management.css |
| `pm-img-cover` | `pm-gap_img` | PM | services/css/project-management.css |

## Scope phases

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `pm-scope__head` | `pm-scope_head` | PM | services/css/project-management.css |
| `pm-scope__intro` | `pm-scope_intro` | PM | services/css/project-management.css |
| `pm-phase__meta` | `pm-phase_meta` | PM | services/css/project-management.css |
| `pm-phase__num` | `pm-phase_num` | PM | services/css/project-management.css |
| `pm-phase__title` | `pm-phase_title` | PM | services/css/project-management.css |
| `pm-phase__items` | `pm-phase_items` | PM | services/css/project-management.css |
| `pm-phase__item` | `pm-phase_item` | PM | services/css/project-management.css |
| `pm-phase__item-title` | `pm-phase_item-title` | PM | services/css/project-management.css |
| `pm-phase__item-text` | `pm-phase_item-text` | PM | services/css/project-management.css |

## Case study

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `pm-case__grid` | `pm-case_grid` | PM | services/css/project-management.css |
| `pm-case__media` | `pm-case_media` | PM | services/css/project-management.css |
| `pm-case__img` | `pm-case_img` | PM | services/css/project-management.css |
| `pm-case__content` | `pm-case_content` | PM | services/css/project-management.css |
| `pm-case__project` | `pm-case_project` | PM | services/css/project-management.css |
| `pm-case__name` | `pm-case_name` | PM | services/css/project-management.css |
| `pm-case__text` | `pm-case_text` | PM | services/css/project-management.css |
| `pm-text-link` | `pm-case_link` | PM | services/css/project-management.css |

## Who it suits

| Old chain | New chain | Pages | CSS |
|---|---|---|---|
| `pm-fit__panel` | `pm-fit_panel` | PM | services/css/project-management.css |
| `pm-fit__col` | `pm-fit_col` | PM | services/css/project-management.css |
| `pm-fit__title` | `pm-fit_title` | PM | services/css/project-management.css |
| `pm-fit__list` | `pm-fit_list` | PM | services/css/project-management.css |
| `pm-fit__item` | `pm-fit_item` | PM | services/css/project-management.css |
| `pm-fit__mark` | `pm-fit_mark` | PM | services/css/project-management.css |
| `pm-fit__text` | `pm-fit_text` | PM | services/css/project-management.css |
| `pm-fit__col is-alt` | `pm-fit_col is-alt` | PM | services/css/project-management.css |
| `pm-fit__mark is-muted` | `pm-fit_mark is-muted` | PM | services/css/project-management.css |
| `pm-fit__text is-muted` | `pm-fit_text is-muted` | PM | services/css/project-management.css |

## Kept unchanged

Service-only classes that keep their names: Osmo effect components (their scripts and documentation use these names) and well-named page classes. Their styles moved out of the global stylesheet into the service files.

| Chain | Pages | CSS |
|---|---|---|
| `page-wrapper is-rural` | RC | services/css/rural-conversions.css |
| `spatial-gsap-slider` | RC HD LA PA 3D PM | shared/css/service-pages.css |
| `spatial-gsap-slider__collection` | RC HD LA PA 3D PM | shared/css/service-pages.css |
| `spatial-gsap-slider__list` | RC HD LA PA 3D PM | shared/css/service-pages.css |
| `spatial-gsap-slider__item` | RC HD LA PA 3D PM | shared/css/service-pages.css |
| `spatial-gsap-slider__controls` | RC HD LA PA 3D PM | shared/css/service-pages.css |
| `spatial-gsap-slider__dots` | RC HD LA PA 3D PM | shared/css/service-pages.css |
| `spatial-gsap-slider__control-dot` | RC HD LA PA 3D PM | shared/css/service-pages.css |
| `radial-gsap-slider` | RC | services/css/rural-conversions.css |
| `radial-gsap-slider__collection` | RC | services/css/rural-conversions.css |
| `radial-gsap-slider__list` | RC | services/css/rural-conversions.css |
| `radial-gsap-slider__item` | RC | services/css/rural-conversions.css |
| `rotating-text__heading` | RC | services/css/rural-conversions.css |
| `rotating-text__highlight` | RC | services/css/rural-conversions.css |
| `step-timeline__fill` | RC LA PA 3D | shared/css/service-pages.css |
| `step-timeline__collection` | RC LA PA 3D | shared/css/service-pages.css |
| `rural-design-section` | RC | services/css/rural-conversions.css |
| `bouncy-tabs` | LA PA 3D | shared/css/service-pages.css |
| `bouncy-tabs__nav` | LA 3D | shared/css/service-pages.css |
| `bouncy-tabs__ghost` | LA 3D | shared/css/service-pages.css |
| `bouncy-tabs__indicator` | LA 3D | shared/css/service-pages.css |
| `bouncy-tabs__button` | LA 3D | shared/css/service-pages.css |
| `bouncy-tabs__collection` | LA 3D | shared/css/service-pages.css |
| `bouncy-tabs__list` | LA PA 3D | shared/css/service-pages.css |
| `bouncy-tabs__item` | LA PA 3D | shared/css/service-pages.css |
| `bouncy-tabs__item-text` | LA PA 3D | shared/css/service-pages.css |
| `bouncy-tabs__heading` | LA 3D | shared/css/service-pages.css |
| `bouncy-tabs__para` | LA 3D | shared/css/service-pages.css |
| `bouncy-tabs__item-visual` | LA PA 3D | shared/css/service-pages.css |
| `bouncy-tabs__item-img` | LA PA 3D | shared/css/service-pages.css |
| `heading-statement is-pm` | PM | services/css/project-management.css |
| `pm-gap` | PM | services/css/project-management.css |
| `label-wrapeper is-pm` | PM | services/css/project-management.css |
| `pm-h2` | PM | services/css/project-management.css |
| `pm-scope` | PM | services/css/project-management.css |
| `pm-title-wrap` | PM | services/css/project-management.css |
| `text-size-regular is-pm-light` | PM | services/css/project-management.css |
| `pm-h2 is-light` | PM | services/css/project-management.css |
| `pm-phase` | PM | services/css/project-management.css |
| `pm-case` | PM | services/css/project-management.css |
| `pm-h2 is-case` | PM | services/css/project-management.css |
| `pm-fit` | PM | services/css/project-management.css |

Also unchanged: `text-size-medium pre-footer-ccta`, inside the global Final CTA component.
