/* service-overlap: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Planning Applications ("Is this the right service for your project?"), 3D Visualisations ("Who we produce
   visualisations for") and all six service pages' Recent Projects (shared/partials/service-projects.html: three
   full-screen panels). Copies the project rows of storeyarchitecture.co.uk (values measured from the live site):
   - Each row except the last, from its top at the top of the screen until its bottom gets there, sinks by 25% of its
     height (yPercent 0 to 25) under a black shade rising from 0 to .4, both linear and scrubbed; the next row, opaque
     and later in the page, slides over it. 768px and up.
   - Each photo is revealed once as it enters (top at 85% of the screen): its black cover fades out (1.2s) while the
     photo settles from 1.2x (1.6s, power3.out).
   Reduced motion: nothing moves and photos show at once.
   Needs: GSAP + ScrollTrigger (site-wide; Lenis drives ScrollTrigger). Hooks: [data-service-overlap] (the list),
   [data-service-overlap-row], [data-service-overlap-shade], [data-service-overlap-media] (with
   [data-service-overlap-cover] and an img inside).
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
  if (window.HawkstoneService?.serviceOverlap) return;
  (window.HawkstoneService = window.HawkstoneService || {}).serviceOverlap = true;

  function initServiceOverlap() {
    const lists = document.querySelectorAll('[data-service-overlap]');
    if (!lists.length || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    lists.forEach((list) => {
      const rows = Array.from(list.querySelectorAll('[data-service-overlap-row]'));

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        rows.slice(0, -1).forEach((row) => {
          const shade = row.querySelector('[data-service-overlap-shade]');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          });
          tl.fromTo(row, { yPercent: 0 }, { yPercent: 25, ease: 'none', duration: 1 }, 0);
          if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 0.4, ease: 'none', duration: 1 }, 0);
        });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        list.querySelectorAll('[data-service-overlap-media]').forEach((media) => {
          const cover = media.querySelector('[data-service-overlap-cover]');
          const img = media.querySelector('img');
          const tl = gsap.timeline({ scrollTrigger: { trigger: media, start: 'top 85%', once: true } });
          if (cover) tl.fromTo(cover, { opacity: 1 }, { opacity: 0, duration: 1.2, ease: 'power2.out' }, 0);
          if (img) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
        });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initServiceOverlap);
  else initServiceOverlap();
})();
