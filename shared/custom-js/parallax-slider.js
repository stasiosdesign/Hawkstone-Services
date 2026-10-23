/* parallax-slider: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Planning Applications (Recent approvals). Osmo Supply "Parallax Image Slider (Smooothy)": the
   initialisation below is Osmo's, unchanged, except that it keeps each Smooothy instance on its root so the site's
   previous/next buttons ([data-parallax-prev], [data-parallax-next], anywhere inside the section [data-parallax-section])
   can call goToPrev()/goToNext().
   Needs: GSAP (site-wide) and Smooothy 0.0.35 from unpkg, loaded before this script. Hooks: Osmo's
   [data-parallax-init], [data-parallax-slider], [data-parallax-inner], data-parallax-amount/-snap/-infinite/-lerp.
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
  if (window.HawkstoneService?.parallaxSlider) return;
  (window.HawkstoneService = window.HawkstoneService || {}).parallaxSlider = true;

  function initParallaxImageSlider() {
    document.querySelectorAll("[data-parallax-init]").forEach((root) => {
      // The smooothy list
      const wrapper = root.querySelector("[data-parallax-slider]");
      if (!wrapper) return;

      // One parallax layer per slide (optional)
      const parallaxItems = [...wrapper.children].map((slide) => slide.querySelector("[data-parallax-inner]"));

      // Parallax amount
      const amountAttr = wrapper.getAttribute("data-parallax-amount");
      const amount = amountAttr !== null ? parseFloat(amountAttr) : 12;

      // Snap to a slide
      const snap = wrapper.getAttribute("data-parallax-snap") !== "false";

      // Loop
      const infinite = wrapper.getAttribute("data-parallax-infinite") !== "false";

      // Slide smoothing
      const lerpAttr = wrapper.getAttribute("data-parallax-lerp");
      const lerp = lerpAttr !== null ? parseFloat(lerpAttr) : 0.3;

      const maxOffset = 25;

      const slider = new Smooothy(wrapper, {
        infinite,
        snap,
        lerpFactor: lerp,
        onUpdate: ({ parallaxValues }) => {
          parallaxItems.forEach((item, i) => {
            if (!item) return;
            const offset = gsap.utils.clamp(-maxOffset, maxOffset, parallaxValues[i] * amount);
            item.style.transform = `translateX(${offset}%)`;
          });
        },
      });

      gsap.ticker.add(() => slider.update());
      root.parallaxSlider = slider; // added: for the site's buttons
    });
  }

  // Added: previous / next buttons
  function initParallaxButtons() {
    document.querySelectorAll("[data-parallax-section]").forEach((section) => {
      const root = section.querySelector("[data-parallax-init]");
      const slider = root && root.parallaxSlider;
      if (!slider) return;
      section.querySelector("[data-parallax-prev]")?.addEventListener("click", () => slider.goToPrev());
      section.querySelector("[data-parallax-next]")?.addEventListener("click", () => slider.goToNext());
    });
  }

  function start() {
    if (typeof window.Smooothy !== "function" || !window.gsap) return;
    initParallaxImageSlider();
    initParallaxButtons();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
