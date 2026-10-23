/* luxury-process: NOT LOADED since 23 Oct 2026; replaced by shared/custom-js/service-slider.js (same code, shared
   component). Kept for reference.
   Was: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Luxury Architecture ("From first conversation to completion"). Connects the section's controls to the Osmo
   Overlapping Slider (shared/custom-js/overlapping-slider.js, loaded before this file): the previous/next buttons step
   one card (disabled at the first and last), and a pagination of one button per step, built from the cards: the current
   step shows as a wider square with its name, the others as small squares; clicking one goes to that step. Both follow
   the slider however it moves (drag, throw, arrow keys, buttons).
   Needs: overlapping-slider.js. Hooks: [data-luxury-process] (root), [data-overlap-slider-init] (the slider, which
   exposes overlapSlider and fires "overlapslider:change"), [data-luxury-process-step] (slide, its value the step name),
   [data-luxury-process-prev], [data-luxury-process-next], [data-luxury-process-pagination].
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
  if (window.HawkstoneService?.luxuryProcess) return;
  (window.HawkstoneService = window.HawkstoneService || {}).luxuryProcess = true;

  function initLuxuryProcess() {
    const root = document.querySelector('[data-luxury-process]');
    if (!root) return;
    const slider = root.querySelector('[data-overlap-slider-init]');
    const slides = Array.from(root.querySelectorAll('[data-luxury-process-step]'));
    const pagination = root.querySelector('[data-luxury-process-pagination]');
    const prev = root.querySelector('[data-luxury-process-prev]');
    const next = root.querySelector('[data-luxury-process-next]');
    if (!slider || !slider.overlapSlider || !slides.length) return;
    const api = slider.overlapSlider;

    // Pagination: one button per step; the label shows only on the current one (CSS).
    const dots = slides.map((slide, i) => {
      const name = slide.getAttribute('data-luxury-process-step');
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'luxury-process_dot';
      dot.setAttribute('aria-label', `Step ${i + 1}: ${name}`);
      dot.innerHTML = '<span class="luxury-process_dot-label"></span>';
      dot.firstChild.textContent = name;
      dot.addEventListener('click', () => api.goToSlide(i));
      if (pagination) pagination.appendChild(dot);
      return dot;
    });

    const show = (c) => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === c);
        if (i === c) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });
      if (prev) prev.classList.toggle('is-disabled', c <= 0);
      if (next) next.classList.toggle('is-disabled', c >= slides.length - 1);
    };

    if (prev) prev.addEventListener('click', () => api.goToSlide(api.index - 1));
    if (next) next.addEventListener('click', () => api.goToSlide(api.index + 1));
    slider.addEventListener('overlapslider:change', (e) => show(e.detail.index));
    show(api.index);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLuxuryProcess);
  else initLuxuryProcess();
})();
