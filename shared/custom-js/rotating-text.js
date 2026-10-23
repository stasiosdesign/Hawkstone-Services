/* rotating-text: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Rural Conversions. Self-contained; paste as-is inside <script></script>.
   Needs: GSAP + SplitText (site-wide). Hooks: [data-rotating-title] with data-words; class rotating-text__highlight.
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
if (window.HawkstoneService?.rotatingText) return;
(window.HawkstoneService = window.HawkstoneService || {}).rotatingText = true;

 function initRotatingText() {
  document.querySelectorAll('[data-rotating-title]').forEach((heading) => {
    const rawWords =
      heading.getAttribute('data-words') ||
      heading.getAttribute('data-rotating-words') ||
      '';
    const words = rawWords
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);
    if (!words.length) return;
    // Keep this off the heading: the CSS for it would affect the H1.
    heading.removeAttribute('data-rotating-words');
    const stepDuration = parseFloat(heading.getAttribute('data-step-duration') || '1.75');
    const inDuration = 0.75;
    const outDuration = 0.6;
    let loop = null;
    let split = null;
    function build() {
      if (loop) {
        loop.kill();
        loop = null;
      }
      const spans = Array.from(heading.querySelectorAll('.rotating-text__highlight'));
      const target = spans.find((el) => el.textContent.trim().length) || spans[0];
      if (!target) return;
      const wrapper = document.createElement('span');
      wrapper.className = 'rotating-text__inner';
      const wordEls = words.map((word) => {
        const el = document.createElement('span');
        el.className = 'rotating-text__word';
        el.textContent = word;
        wrapper.appendChild(el);
        return el;
      });
      target.textContent = '';
      target.appendChild(wrapper);
      requestAnimationFrame(() => {
        gsap.set(wordEls, { yPercent: 150, autoAlpha: 0 });
        let activeIndex = 0;
        const firstWord = wordEls[0];
        gsap.set(firstWord, { yPercent: 0, autoAlpha: 1 });
        wrapper.style.width = firstWord.getBoundingClientRect().width + 'px';
        function showNext() {
          const nextIndex = (activeIndex + 1) % wordEls.length;
          const prev = wordEls[activeIndex];
          const current = wordEls[nextIndex];
          gsap.to(wrapper, {
            width: current.getBoundingClientRect().width,
            duration: inDuration,
            ease: 'power4.inOut'
          });
          if (prev && prev !== current) {
            gsap.to(prev, {
              yPercent: -150,
              autoAlpha: 0,
              duration: outDuration,
              ease: 'power4.inOut'
            });
          }
          gsap.fromTo(
            current,
            { yPercent: 150, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: inDuration,
              ease: 'power4.inOut'
            }
          );
          activeIndex = nextIndex;
          loop = gsap.delayedCall(stepDuration, showNext);
        }
        if (wordEls.length > 1) {
          loop = gsap.delayedCall(stepDuration, showNext);
        }
      });
    }
    function splitHeading() {
      if (split) split.revert();
      split = SplitText.create(heading, {
        type: 'lines',
        mask: 'lines',
        autoSplit: false,
        linesClass: 'rotating-line',
        onSplit: build
      });
    }
    splitHeading();
    let lastWidth = window.innerWidth;
    let resizeTimer;
    window.addEventListener('resize', () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(splitHeading, 200);
    });
  });
}
function startRotatingText() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initRotatingText);
  } else {
    initRotatingText();
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startRotatingText);
} else {
  startRotatingText();
}
})();
