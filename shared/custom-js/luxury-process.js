/* luxury-process: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Luxury Architecture ("From first conversation to completion" carousel). Swiper with snapping portrait cards
   of fixed CSS width (slidesPerView auto): the round previous/next buttons, mouse drag and touch swipe, the arrow keys
   while the carousel is on screen, and a pagination of one button per step: the current step shows as a pill with its
   name, the others as dots. The current step is the first card in view; once the last card is fully in view (the end),
   the last step is current. The gap between cards is 2.4em of the carousel's font size, re-read on resize.
   Needs: Swiper 12.2.0 JS + CSS from jsDelivr (loaded before this script / in the page head). Hooks:
   [data-luxury-process] (root), [data-luxury-process-swiper], [data-luxury-process-step] (slide, its value the step
   name), [data-luxury-process-prev], [data-luxury-process-next], [data-luxury-process-pagination].
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
  if (window.HawkstoneService?.luxuryProcess) return;
  (window.HawkstoneService = window.HawkstoneService || {}).luxuryProcess = true;

  function initLuxuryProcess() {
    const root = document.querySelector('[data-luxury-process]');
    if (!root || typeof window.Swiper !== 'function') return;
    const el = root.querySelector('[data-luxury-process-swiper]');
    const slides = Array.from(root.querySelectorAll('[data-luxury-process-step]'));
    const pagination = root.querySelector('[data-luxury-process-pagination]');
    if (!el || !slides.length) return;

    const gap = () => parseFloat(getComputedStyle(el).fontSize) * 2.4;

    // Pagination: one button per step; the label shows only on the current one (CSS).
    const dots = slides.map((slide, i) => {
      const name = slide.getAttribute('data-luxury-process-step');
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'luxury-process_dot';
      dot.setAttribute('aria-label', `Step ${i + 1}: ${name}`);
      dot.innerHTML = '<span class="luxury-process_dot-label"></span>';
      dot.firstChild.textContent = name;
      if (pagination) pagination.appendChild(dot);
      return dot;
    });

    const swiper = new Swiper(el, {
      slidesPerView: 'auto',
      spaceBetween: gap(),
      speed: 700,
      grabCursor: true,
      threshold: 6,
      watchOverflow: true,
      navigation: {
        prevEl: root.querySelector('[data-luxury-process-prev]'),
        nextEl: root.querySelector('[data-luxury-process-next]'),
        disabledClass: 'is-disabled',
      },
      keyboard: { enabled: true, onlyInViewport: true },
      on: {
        beforeResize(s) { s.params.spaceBetween = gap(); },
      },
    });

    const current = () => (swiper.isEnd ? slides.length - 1 : swiper.activeIndex);
    const update = () => {
      const c = current();
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === c);
        if (i === c) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });
    };
    dots.forEach((dot, i) => dot.addEventListener('click', () => swiper.slideTo(Math.min(i, swiper.snapGrid.length - 1))));
    swiper.on('slideChange', update);
    swiper.on('reachEnd', update);
    swiper.on('fromEdge', update);
    swiper.on('resize', update);
    update();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLuxuryProcess);
  else initLuxuryProcess();
})();
