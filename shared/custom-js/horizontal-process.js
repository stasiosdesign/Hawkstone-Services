/* horizontal-process: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Rural Conversions, Luxury Architecture, Planning Applications, 3D Visualisations. Copies the "Our process" section of fluid.glass/approach: on desktop the section
   ([data-h-process]) is made as tall as the horizontal travel needs, its inner frame pins (CSS sticky) and the track
   ([data-h-process-track]) slides left with the scroll; the rule ([data-h-process-bar]) fills as a progress bar; each
   full-bleed photo ([data-h-process-asset]) drifts against the track (parallax); the first photo of each step eases
   in from 20% to rest as the step arrives (values from the captured fluid.glass DOM). Scroll smoothing comes from the
   site's Lenis, which drives ScrollTrigger.
   Below 992px nothing runs and the panels stack (CSS). Requires GSAP + ScrollTrigger (site-wide). */
(() => {
  // Track pixels moved per pixel scrolled (fluid.glass: 8811px of travel over 5400px of scroll)
  const SPEED = 1.63;

  function initHorizontalProcess() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-h-process]').forEach((section) => {
      if (section.dataset.hProcessReady) return;
      section.dataset.hProcessReady = 'true';
      const track = section.querySelector('[data-h-process-track]');
      const bar = section.querySelector('[data-h-process-bar]');
      if (!track) return;

      gsap.matchMedia().add('(min-width: 992px)', () => {
        // Travel ends with the last panel's left edge exactly at the screen edge (measured, not rounded), so nothing of
        // the panel before it can show
        const lastPanel = track.lastElementChild;
        const travel = () => Math.ceil(lastPanel.getBoundingClientRect().left - track.getBoundingClientRect().left);
        const distance = () => travel() / SPEED;
        const setHeight = () => { section.style.height = (distance() + window.innerHeight) + 'px'; };
        setHeight();

        const scrub = { trigger: section, start: 'top top', end: 'bottom bottom', scrub: true };
        const slide = gsap.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: { ...scrub, invalidateOnRefresh: true, onRefreshInit: setHeight },
        });
        if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: scrub });

        // Full-bleed photos (fluid.glass .process-asset > .asset): scaled 1.1, drifting from -25% to 25% while the
        // panel crosses the screen, so the photo travels slower than the track; the panel clips the edges
        section.querySelectorAll('[data-h-process-asset]').forEach((asset) => {
          const inner = asset.firstElementChild;
          if (!inner) return;
          gsap.fromTo(inner, { xPercent: -25, scale: 1.1 }, {
            xPercent: 25,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: { trigger: asset, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
          });
        });

        // Steps: only the first photo of each pair moves (as on fluid.glass), from 20% right to rest as its step arrives
        section.querySelectorAll('.h-process_slide').forEach((step) => {
          step.querySelectorAll('.h-process_photo.is-primary').forEach((photo) => {
            gsap.fromTo(photo, { xPercent: 20 }, {
              xPercent: 0,
              ease: 'none',
              scrollTrigger: { trigger: step, containerAnimation: slide, start: 'left right', end: 'left left', scrub: true },
            });
          });
        });

        return () => { section.style.height = ''; };
      });

      // Panel widths depend on the photos and fonts having loaded
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHorizontalProcess);
  else initHorizontalProcess();
})();
