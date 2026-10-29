/* service-slider: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Luxury Architecture ("From first conversation to completion") and 3D Visualisations ("How the process
   works"); each [data-service-slider] section on the page is set up on its own. Connects the section's controls to the Osmo
   Overlapping Slider (shared/custom-js/overlapping-slider.js, loaded before this file): the previous/next buttons step
   one card (disabled at the first and last), and a pagination of one button per step, built from the cards: the current
   step shows as a wider square with its name, the others as small squares; clicking one goes to that step. Both follow
   the slider however it moves (drag, throw, arrow keys, buttons).
   Needs: overlapping-slider.js. Hooks: [data-service-slider] (root), [data-overlap-slider-init] (the slider, which
   exposes overlapSlider and fires "overlapslider:change"), [data-overlap-slider-item] (a slide; its step name is its
   card title, .service-slider_title, without a closing full stop, or a data-service-slider-step value if one is set),
   [data-service-slider-prev], [data-service-slider-next], [data-service-slider-pagination].
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
  if (window.HawkstoneService?.serviceSlider) return;
  (window.HawkstoneService = window.HawkstoneService || {}).serviceSlider = true;

  function initServiceSlider() {
    document.querySelectorAll('[data-service-slider]').forEach(setup);
  }

  function setup(root) {
    const slider = root.querySelector('[data-overlap-slider-init]');
    const slides = Array.from(root.querySelectorAll('[data-overlap-slider-item]'));
    const pagination = root.querySelector('[data-service-slider-pagination]');
    const prev = root.querySelector('[data-service-slider-prev]');
    const next = root.querySelector('[data-service-slider-next]');
    if (!slider || !slider.overlapSlider || !slides.length) return;
    const api = slider.overlapSlider;

    // Pagination: one button per step; the label shows only on the current one (CSS).
    const dots = slides.map((slide, i) => {
      const title = slide.querySelector('.service-slider_title');
      const name = slide.getAttribute('data-service-slider-step') || (title ? title.textContent.trim().replace(/\.$/, '') : '');
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'service-slider_dot';
      dot.setAttribute('aria-label', `Step ${i + 1}: ${name}`);
      dot.innerHTML = '<span class="service-slider_dot-label"></span>';
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initServiceSlider);
  else initServiceSlider();
})();
