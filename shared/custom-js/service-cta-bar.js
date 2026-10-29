/* service-cta-bar: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: all six service pages. Shows the fixed bar (back-to-top square and consultation pill, one centred unit)
   once the hero's own consultation button ([data-service-hero-cta], or the Main CTA inside .service-hero) has scrolled
   out of view, and hides it while the
   footer is in view; state is the is-hidden combo class on the bar. The square ([data-service-cta-top]) scrolls
   smoothly to the top (through Lenis when the site has started it). */
(() => {
  function initServiceCtaBar() {
    const bar = document.querySelector('[data-service-cta-bar]');
    if (!bar || bar.dataset.ctaBarReady) return;
    bar.dataset.ctaBarReady = 'true';
    const topButton = bar.querySelector('[data-service-cta-top]');
    const footer = document.querySelector('[data-footer-parallax]') || document.querySelector('.footer');
    // The hero's button is a Main CTA instance; if the instance can't carry the attribute, find it by class
    const heroCta = document.querySelector('[data-service-hero-cta]') || document.querySelector('.service-hero .wrapper_cta');
    let footerInView = false;
    let heroCtaInView = !!heroCta;

    const update = () => {
      // The hero has its own consultation button: the fixed bar takes over once that has scrolled away
      bar.classList.toggle('is-hidden', footerInView || heroCtaInView);
    };

    if ('IntersectionObserver' in window) {
      if (footer) new IntersectionObserver((entries) => { footerInView = entries[0].isIntersecting; update(); }).observe(footer);
      if (heroCta) new IntersectionObserver((entries) => { heroCtaInView = entries[0].isIntersecting; update(); }).observe(heroCta);
    } else {
      heroCtaInView = false;
    }
    window.addEventListener('scroll', update, { passive: true });
    if (topButton) {
      topButton.addEventListener('click', () => {
        if (window.lenis && typeof window.lenis.scrollTo === 'function') window.lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initServiceCtaBar);
  else initServiceCtaBar();
})();
