/* flick-cards: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Planning Applications. Self-contained; paste as-is inside <script></script>.
   Needs: GSAP + Draggable (site-wide). Hooks: [data-flick-cards-init] and its data-flick-cards-* children.
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
if (window.HawkstoneService?.flickCards) return;
(window.HawkstoneService = window.HawkstoneService || {}).flickCards = true;

gsap.registerPlugin(Draggable);
function initFlickCards() {
  const sliders = document.querySelectorAll('[data-flick-cards-init]');
  sliders.forEach(slider => {
    const list = slider.querySelector('[data-flick-cards-list]');
    const cards = Array.from(list.querySelectorAll('[data-flick-cards-item]'));
    const total = cards.length;
    let activeIndex = 0;
    const sliderWidth = slider.offsetWidth;
    const threshold = 0.1;
    // Generate draggers inside each card and store references
    const draggers = [];
    cards.forEach(card => {
      const dragger = document.createElement('div');
      dragger.setAttribute('data-flick-cards-dragger', '');
      card.appendChild(dragger);
      draggers.push(dragger);
    });
    // Set initial drag status
    slider.setAttribute('data-flick-drag-status', 'grab');
    function getConfig(i, currentIndex) {
      let diff = i - currentIndex;
      if (diff > total / 2) diff -= total;
      else if (diff < -total / 2) diff += total;
      switch (diff) {
        case  0: return { x: 0,   y: 0,   rot: 0,  s: 1,   o: 1, z: 5 };
        case  1: return { x: 25,  y: 1,   rot: 10, s: 0.9, o: 1, z: 4 };
        case -1: return { x: -25, y: 1,   rot: -10,s: 0.9, o: 1, z: 4 };
        case  2: return { x: 45,  y: 5,   rot: 15, s: 0.8, o: 1, z: 3 };
        case -2: return { x: -45, y: 5,   rot: -15,s: 0.8, o: 1, z: 3 };
        default:
          const dir = diff > 0 ? 1 : -1;
          return { x: 55 * dir, y: 5, rot: 20 * dir, s: 0.6, o: 0, z: 2 };
      }
    }
    function renderCards(currentIndex) {
      cards.forEach((card, i) => {
        const cfg = getConfig(i, currentIndex);
        let status;
        if (cfg.x === 0)        status = 'active';
        else if (cfg.x === 25)  status = '2-after';
        else if (cfg.x === -25) status = '2-before';
        else if (cfg.x === 45)  status = '3-after';
        else if (cfg.x === -45) status = '3-before';
        else                    status = 'hidden';
        card.setAttribute('data-flick-cards-item-status', status);
        card.style.zIndex = cfg.z;
        gsap.to(card, {
          duration: 0.6,
          ease: 'elastic.out(1.2, 1)',
          xPercent: cfg.x,
          yPercent: cfg.y,
          rotation: cfg.rot,
          scale: cfg.s,
          opacity: cfg.o
        });
      });
    }
    renderCards(activeIndex);
// Arrow controls
const prevBtn = slider.querySelector('[data-flick-cards-prev]');
const nextBtn = slider.querySelector('[data-flick-cards-next]');
let isAnimating = false;
const ANIM_DURATION_MS = 200;
function go(shift) {
  if (isAnimating) return;
  isAnimating = true;
  activeIndex = (activeIndex + shift + total) % total;
  renderCards(activeIndex);
  setTimeout(() => (isAnimating = false), ANIM_DURATION_MS);
}
if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
if (nextBtn) nextBtn.addEventListener('click', () => go(1));
    if (total < 7) {
      console.log('Not minimum of 7 cards');
      return;
    }
    let pressClientX = 0;
    let pressClientY = 0;
    Draggable.create(draggers, {
      type: 'x',
      edgeResistance: 0.8,
      bounds: { minX: -sliderWidth / 2, maxX: sliderWidth / 2 },
      inertia: false,
      onPress() {
        pressClientX = this.pointerEvent.clientX;
        pressClientY = this.pointerEvent.clientY;
        slider.setAttribute('data-flick-drag-status', 'grabbing');
      },
      onDrag() {
        const rawProgress = this.x / sliderWidth;
        const progress = Math.min(1, Math.abs(rawProgress));
        const direction = rawProgress > 0 ? -1 : 1;
        const nextIndex = (activeIndex + direction + total) % total;
        cards.forEach((card, i) => {
          const from = getConfig(i, activeIndex);
          const to = getConfig(i, nextIndex);
          const mix = prop => from[prop] + (to[prop] - from[prop]) * progress;
          gsap.set(card, {
            xPercent: mix('x'),
            yPercent: mix('y'),
            rotation: mix('rot'),
            scale: mix('s'),
            opacity: mix('o')
          });
        });
      },
      onRelease() {
        slider.setAttribute('data-flick-drag-status', 'grab');
        const releaseClientX = this.pointerEvent.clientX;
        const releaseClientY = this.pointerEvent.clientY;
        const dragDistance = Math.hypot(releaseClientX - pressClientX, releaseClientY - pressClientY);
        const raw = this.x / sliderWidth;
        let shift = 0;
        if (raw > threshold) shift = -1;
        else if (raw < -threshold) shift = 1;
        if (shift !== 0) {
          activeIndex = (activeIndex + shift + total) % total;
          renderCards(activeIndex);
        }
        gsap.to(this.target, {
          x: 0,
          duration: 0.3,
          ease: 'power1.out'
        });
        if (dragDistance < 4) {
          // Temporarily allow clicks to pass through
          this.target.style.pointerEvents = 'none';
          // Allow the DOM to register pointer-through
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const el = document.elementFromPoint(releaseClientX, releaseClientY);
              if (el) {
                const evt = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: true
                });
                el.dispatchEvent(evt);
              }
              // Restore pointer events
              this.target.style.pointerEvents = 'auto';
            });
          });
        }
      }
    });
  });
}
// Initialize Flick Cards Slider
document.addEventListener('DOMContentLoaded', function() {
  initFlickCards();
});
})();
