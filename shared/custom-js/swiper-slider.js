/* swiper-slider: page custom code (Webflow: Page settings > Custom code > Before </body> tag). Osmo Swiper Slider Setup,
   as supplied except mousewheel (off) and free mode (on). Needs Swiper 12's JS from the CDN loaded before it. Used on: Luxury Architecture (step cards).
   Needs: Swiper 12 JS + CSS from the CDN (page head / before this script). Hooks: [data-swiper-group], [data-swiper-wrap], [data-swiper-prev], [data-swiper-next].
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
if (window.HawkstoneService?.swiperSlider) return;
(window.HawkstoneService = window.HawkstoneService || {}).swiperSlider = true;

function initSwiperSlider() {
  const swiperSliderGroups = document.querySelectorAll("[data-swiper-group]");

  swiperSliderGroups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if(!swiperSliderWrap) return;

    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");

    const swiper = new Swiper(swiperSliderWrap, {
      slidesPerView: 1.25,
      speed: 600,
      mousewheel: false, // changed from Osmo's true: scrolling over the cards scrolls the page
      grabCursor: true,
      freeMode: { enabled: true, momentum: true }, // added: swipes glide freely instead of snapping to a card
      breakpoints: {
        // when window width is >= 480px
        480: {
          slidesPerView: 1.8,
        },
        // when window width is >= 992px
        992: {
          slidesPerView: 3.5,
        }
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    });

  });
}

// Initialize Swiper Slider Setup
document.addEventListener('DOMContentLoaded', () => {
  initSwiperSlider();
});
})();
