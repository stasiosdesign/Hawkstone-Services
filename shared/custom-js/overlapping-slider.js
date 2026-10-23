/* overlapping-slider: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Not loaded by any page (nothing on the six pages uses it). Self-contained; paste as-is inside <script></script>. */
  /* --------------------- OVERLAPPING SLIDER -------------------------------- */
  function initOverlappingSlider() {
    const inits = document.querySelectorAll('[data-overlap-slider-init]');
    if (!inits.length) return;
    inits.forEach(setupOverlappingSlider);
    function setupOverlappingSlider(init) {
      // --- attributes with defaults
      const minScale = +(init.getAttribute('data-scale') ?? 0.45);
      const maxRotation = +(init.getAttribute('data-rotate') ?? -8);
      const inertia = true;
      const wrap = init.querySelector('[data-overlap-slider-collection]');
      const slider = init.querySelector('[data-overlap-slider-list]');
      const slides = Array.from(init.querySelectorAll('[data-overlap-slider-item]'));
      if (!wrap || !slider || !slides.length) {
        console.warn('OverlappingSlider: missing required structure.');
        return;
      }
      wrap.style.touchAction = 'none';
      wrap.style.userSelect = 'none';
      let spacing = 0;
      let slideW = 0;
      let maxDrag = 0;
      let dragX = 0;
      let draggable;
      function clamp(value) {
        if (maxDrag <= 0) return 0;
        return Math.min(Math.max(value, 0), maxDrag);
      }
      // Keep slide stacking order fixed
      function setFixedStackOrder() {
        slides.forEach((slide, i) => {
          gsap.set(slide, {
            position: 'relative',
            zIndex: i + 1,
          });
        });
      }
      function update() {
        gsap.set(slider, { x: -dragX });
        slides.forEach((slide, i) => {
          const threshold = i * spacing;
          const local = Math.max(0, dragX - threshold);
          const t = spacing > 0 ? Math.min(local / spacing, 1) : 0;
          gsap.set(slide, {
            x: local,
            scale: 1 - (1 - minScale) * t,
            rotation: maxRotation * t,
            transformOrigin: '75% center',
          });
        });
      }
      function recalc() {
        if (!slides.length) return;
        const style = getComputedStyle(slides[0]);
        const gapRight = parseFloat(style.marginRight) || 0;
        slideW = slides[0].offsetWidth;
        spacing = slideW + gapRight;
        maxDrag = spacing * (slides.length - 1);
        dragX = clamp(dragX);
        setFixedStackOrder();
        update();
        if (draggable) {
          draggable.applyBounds({ minX: -maxDrag, maxX: 0 });
        }
      }
      draggable = Draggable.create(slider, {
        type: 'x',
        dragClickables: true,
        bounds: { minX: -maxDrag, maxX: 0 },
        inertia,
        maxDuration: 1,
        zIndexBoost: false,
        snap: (raw) => {
          const d = clamp(-raw);
          const idx = spacing > 0 ? Math.round(d / spacing) : 0;
          return -idx * spacing;
        },
        onDrag() {
          dragX = clamp(-this.x);
          update();
        },
        onThrowUpdate() {
          dragX = clamp(-this.x);
          update();
        },
      })[0];
      const ro = new ResizeObserver(() => recalc());
      ro.observe(init);
      let active = false;
      let currentIndex = 0;
      function goToSlide(idx) {
        idx = Math.max(0, Math.min(idx, slides.length - 1));
        currentIndex = idx;
        const targetX = idx * spacing;
        gsap.to(
          { value: dragX },
          {
            value: targetX,
            duration: 0.4,
            ease: 'power4.out',
            onUpdate: function () {
              dragX = this.targets()[0].value;
              update();
            },
          },
        );
        wrap.setAttribute('aria-label', `Slide ${idx + 1} of ${slides.length}`);
      }
      const io = new IntersectionObserver(
        (entries) => {
          active = entries[0].isIntersecting;
        },
        { threshold: 0.25 },
      );
      io.observe(init);
      // --- BUTTON LOGIC ---
      const prevBtn = init.querySelector('[data-overlap-slider-prev]');
      const nextBtn = init.querySelector('[data-overlap-slider-next]');
      function handleInteraction(direction) {
        const currentPosIndex = spacing > 0 ? Math.round(dragX / spacing) : 0;
        goToSlide(direction === 'next' ? currentPosIndex + 1 : currentPosIndex - 1);
      }
      if (prevBtn) {
        prevBtn.addEventListener('pointerup', (e) => {
          e.stopImmediatePropagation();
          handleInteraction('prev');
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('pointerup', (e) => {
          e.stopImmediatePropagation();
          handleInteraction('next');
        });
      }
      // Keyboard controls
      window.addEventListener('keydown', (e) => {
        if (!active) return;
        if (e.key === 'ArrowLeft') handleInteraction('prev');
        if (e.key === 'ArrowRight') handleInteraction('next');
      });
      recalc();
    }
  }
  document.addEventListener('DOMContentLoaded', initOverlappingSlider);
