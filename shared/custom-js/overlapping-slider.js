/* overlapping-slider: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Luxury Architecture ("From first conversation to completion"). Osmo Supply "Overlapping Slider", as supplied,
   with only these adaptations (each marked "Hawkstone:" below):
   - wrapped so it runs once per page and adds no global names (the Webflow site loads other code);
   - touch-action pan-y instead of none, so a vertical swipe on the cards still scrolls the page on phones;
   - the region's aria-label comes from [data-overlap-slider-label] (default unchanged);
   - external controls: the instance exposes goToSlide() and its index on the init element (init.overlapSlider), and
     dispatches "overlapslider:change" ({ index }) whenever the nearest card changes: while dragging or throwing,
     from the arrow keys and from goToSlide(). After a drag the keyboard continues from the card it settled on.
   Needs: GSAP 3.15 with Draggable and InertiaPlugin (site-wide). Hooks: [data-overlap-slider-init] (data-scale,
   data-rotate), [data-overlap-slider-collection], [data-overlap-slider-list], [data-overlap-slider-item]. */
(() => {
if (window.HawkstoneService?.overlappingSlider) return;
(window.HawkstoneService = window.HawkstoneService || {}).overlappingSlider = true;

gsap.registerPlugin(Draggable, InertiaPlugin);

function initOverlappingSlider() {
  const inits = document.querySelectorAll('[data-overlap-slider-init]');
  if (!inits.length) return;

  inits.forEach(setupOverlappingSlider);

  function setupOverlappingSlider(init) {
    // --- attributes with defaults
    const minScale = +(init.getAttribute('data-scale')  ?? 0.45);
    const maxRotation = +(init.getAttribute('data-rotate') ?? -8);
    const inertia = true;

    const wrap = init.querySelector('[data-overlap-slider-collection]');
    const slider = init.querySelector('[data-overlap-slider-list]');
    const slides = Array.from(init.querySelectorAll('[data-overlap-slider-item]'));

    if (!wrap || !slider || !slides.length) {
      console.warn("OverlappingSlider: missing required structure. Check Osmo Vault documentation please.");
      return;
    }

    // Hawkstone: pan-y (was 'none') keeps vertical page scrolling on touch screens; Draggable still takes horizontal drags.
    wrap.style.touchAction = 'pan-y';
    wrap.style.userSelect = 'none';

    let spacing = 0;
    let slideW = 0;
    let maxDrag = 0;
    let dragX = 0;
    let draggable;

    // Hawkstone: report the nearest card to external controls when it changes.
    let reportedIndex = -1;
    function report(idx) {
      if (idx === reportedIndex) return;
      reportedIndex = idx;
      init.dispatchEvent(new CustomEvent('overlapslider:change', { detail: { index: idx } }));
    }

    // simple clamp that always uses latest maxDrag
    function clamp(value) {
      if (maxDrag <= 0) return 0;
      return Math.min(Math.max(value, 0), maxDrag);
    }

    function update() {
      // move the whole list
      gsap.set(slider, { x: -dragX });

      // update each slide's overlap transform
      slides.forEach((slide, i) => {
        const threshold = i * spacing;
        const local = Math.max(0, dragX - threshold);
        const t = spacing > 0 ? Math.min(local / spacing, 1) : 0;

        gsap.set(slide, {
          x: local,
          scale: 1 - (1 - minScale) * t,
          rotation: maxRotation * t,
          transformOrigin: '75% center'
        });
      });
    }

    function recalc() {
      if (!slides.length) return;

      // measure one slide to get width + margin-right as "gap"
      const style = getComputedStyle(slides[0]);
      const gapRight = parseFloat(style.marginRight) || 0;

      slideW = slides[0].offsetWidth;
      spacing = slideW + gapRight;
      maxDrag = spacing * (slides.length - 1);

      // Hawkstone: keep the current card in place when the card size changes (resize), instead of the old pixel offset.
      dragX = clamp(currentIndex * spacing);
      update();

      if (draggable) {
        draggable.applyBounds({ minX: -maxDrag, maxX: 0 });
      }
    }

    // Hawkstone: the card nearest the current drag position.
    const nearest = () => (spacing > 0 ? Math.round(dragX / spacing) : 0);

    // create draggable
    draggable = Draggable.create(slider, {
      type: 'x',
      bounds: { minX: -maxDrag, maxX: 0 }, // will be updated after recalc
      inertia,
      maxDuration: 1,
      snap: true
        ? (raw) => {
            // raw is the x value
            const d = clamp(-raw);
            const idx = spacing > 0 ? Math.round(d / spacing) : 0;
            return -idx * spacing;
          }
        : false,
      onDrag() {
        dragX = clamp(-this.x);
        update();
        report(nearest()); // Hawkstone
      },
      onThrowUpdate() {
        dragX = clamp(-this.x);
        update();
        report(nearest()); // Hawkstone
      },
      // Hawkstone: after a drag or throw, the keyboard and external controls continue from the card it settled on.
      onDragEnd() { currentIndex = nearest(); },
      onThrowComplete() { currentIndex = nearest(); report(currentIndex); }
    })[0];

    // recalc on resize
    const ro = new ResizeObserver(() => {
      recalc();
    });
    ro.observe(init);

    // keyboard navigation (arrow left/right)
    let active = false;
    let currentIndex = 0;

    // helper function to switch slides
    function goToSlide(idx) {
      idx = Math.max(0, Math.min(idx, slides.length - 1));
      currentIndex = idx;
      report(idx); // Hawkstone

      const targetX = idx * spacing;

      gsap.to({ value: dragX }, {
        value: targetX,
        duration: 0.35,
        ease: "power4.out",
        onUpdate: function () {
          dragX = this.targets()[0].value;
          gsap.set(slider, { x: -dragX });
          update(); // animate overlap transforms properly
        }
      });

      wrap.setAttribute("aria-label", `Slide ${idx + 1} of ${slides.length}`);
    }

    // Observe visibility
    const io = new IntersectionObserver(entries => {
      active = entries[0].isIntersecting;
    }, {
      threshold: 0.25 // slider must be at least 25% visible
    });

    io.observe(init);

    // Aria labels for accessibility
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-roledescription", "carousel");
    wrap.setAttribute("aria-label", init.getAttribute('data-overlap-slider-label') || "Testimonial slider"); // Hawkstone: label from the markup

    // key listener
    function onKey(e) {
      if (!active) return; // only respond when slider in view

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      }
    }
    window.addEventListener("keydown", onKey);

    // Hawkstone: external controls (previous/next buttons, step indicators).
    init.overlapSlider = {
      goToSlide,
      get index() { return currentIndex; },
      get count() { return slides.length; }
    };

    // initial layout
    recalc();
    report(0); // Hawkstone
  }
}

// Initialize Overlapping Slider
if (document.readyState === 'loading') document.addEventListener("DOMContentLoaded", initOverlappingSlider);
else initOverlappingSlider();
})();
