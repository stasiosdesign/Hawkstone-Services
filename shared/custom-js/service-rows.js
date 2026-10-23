/* service-rows: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Not loaded by any page since 23 Oct 2026: "Looking for something else?" is static everywhere (kept for reference).
   Was used on: Luxury Architecture and Heritage Design ("Looking for something else?"), on lists with
   data-service-rows-fan only. From the
   Services rows of graphichunters.com:
   rows 2-5 start stacked behind row 1 (moved up by the rows above them), each turned 5° further (-5°, -10°…) under a
   dark top shade, and fan out to their places as the list scrolls in: from the list's top at 75% of the viewport to
   12% above it, eased (power2.out), scrubbed (values measured from the reference). 768px and up only; reduced motion
   leaves the rows in place.
   Needs: GSAP + ScrollTrigger (site-wide; Lenis drives ScrollTrigger). Hooks: [data-service-rows-fan],
   [data-service-rows-row], [data-service-rows-shade].
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
  if (window.HawkstoneService?.serviceRows) return;
  (window.HawkstoneService = window.HawkstoneService || {}).serviceRows = true;

  function initServiceRows() {
    const list = document.querySelector('[data-service-rows-fan]');
    if (!list || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const rows = Array.from(list.querySelectorAll('[data-service-rows-row]'));
    // Earlier rows sit on top, so each row hides the ones still stacked behind it.
    rows.forEach((row, i) => { row.style.zIndex = rows.length - i; });

    gsap.matchMedia().add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: list, start: 'top 75%', end: 'top -12%', scrub: true, invalidateOnRefresh: true },
      });
      rows.forEach((row, i) => {
        if (!i) return;
        const above = () => rows.slice(0, i).reduce((h, r) => h + r.offsetHeight, 0);
        tl.fromTo(row, { y: () => -above(), rotation: -5 * i }, { y: 0, rotation: 0, ease: 'power2.out', duration: 1 }, 0);
        const shade = row.querySelector('[data-service-rows-shade]');
        if (shade) tl.fromTo(shade, { opacity: Math.min(0.24 * i, 0.8) }, { opacity: 0, ease: 'power2.out', duration: 1 }, 0);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initServiceRows);
  else initServiceRows();
})();
