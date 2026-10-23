/* layered-slider: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Not loaded by any page (nothing on the six pages uses it). Self-contained; paste as-is inside <script></script>. */
  gsap.registerPlugin(Observer, CustomEase);
CustomEase.create('osmo', 'M0,0 C0.625,0.05 0,1 1,1');
function initLayeredImageSlider() {
  document.querySelectorAll('[data-layered-slider-init]').forEach((root) => {
    if (root._layeredSlider) root._layeredSlider.destroy();
    const titles = [...root.querySelectorAll('[data-layered-slider-title]')];
    if (!titles.length) return;
    const count = titles.length;
    const backgrounds = [...root.querySelectorAll('[data-layered-slider-bg]')];
    const maskItems = [...root.querySelectorAll('[data-layered-slider-mask-item]')];
    const maskFrame = root.querySelector('[data-layered-slider-mask]');
    const fill = root.querySelector('[data-layered-slider-fill]');
    const currentEl = root.querySelector('[data-layered-slider-current]');
    const totalEl = root.querySelector('[data-layered-slider-total]');
    const prevBtn = root.querySelector('[data-layered-slider-prev]');
    const nextBtn = root.querySelector('[data-layered-slider-next]');
    // All elements that 'pause' the autoplay on hover
    const controls = [...new Set([...titles, ...root.querySelectorAll('a, button')])];
    // Autoplay, value is seconds between slides, 0 disables autoplay
    const autoplayAttr = root.getAttribute('data-layered-slider-autoplay');
    const autoplay = autoplayAttr !== null ? parseFloat(autoplayAttr) : 5;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = gsap.utils.clamp;
    const wrap = (distance) => distance - count * Math.round(distance / count);
    const transitionDuration = 1;
    const backgroundZoom = 0;
    const titleGap = 0.5;
    const titleSpacing = 40;
    if (totalEl) totalEl.textContent = String(count).padStart(2, '0');
    let titleStep = 0;
    let maskStep = 0;
    const measure = () => {
      const widestTitle = Math.max(...titles.map((title) => title.offsetWidth));
      titleStep = Math.max(root.clientWidth * titleGap, widestTitle + titleSpacing);
      maskStep = maskFrame ? maskFrame.clientWidth : root.clientWidth;
    };
    measure();
    const state = { progress: 0 };
    let activeIndex = -1;
    // The active slide has [data-active] on its background, title, and mask
    const setActive = (previousIndex, index) => {
      [backgrounds, titles, maskItems].forEach((list) => {
        if (previousIndex >= 0 && list[previousIndex])
          list[previousIndex].removeAttribute('data-active');
        if (list[index]) list[index].setAttribute('data-active', '');
      });
    };
    const render = (progress) => {
      const centeredIndex = ((Math.round(progress) % count) + count) % count;
      for (let i = 0; i < count; i++) {
        // How far this slide sits from the centre: signed (left / right) and absolute.
        const offset = wrap(i - progress);
        const distance = Math.abs(offset);
        const background = backgrounds[i];
        if (background) {
          const backgroundOpacity = clamp(0, 1, 1 - distance);
          gsap.set(background, {
            opacity: backgroundOpacity,
            scale: 1 + backgroundZoom - backgroundZoom * backgroundOpacity,
            zIndex: Math.round(backgroundOpacity * 100),
          });
        }
        gsap.set(titles[i], {
          x: offset * titleStep,
          opacity: i === centeredIndex ? 1 : 0.4,
          pointerEvents: 'auto',
        });
        const maskItem = maskItems[i];
        if (maskItem) {
          gsap.set(maskItem, { x: offset * maskStep });
        }
      }
      // Sync the counter and [data-active] to whichever slide is now centred.
      if (centeredIndex !== activeIndex) {
        const previousIndex = activeIndex;
        activeIndex = centeredIndex;
        setActive(previousIndex, centeredIndex);
        if (currentEl) currentEl.textContent = String(centeredIndex + 1).padStart(2, '0');
      }
    };
    let hovering = 0;
    let autoTween = null;
    const startAutoplay = () => {
      if (!autoTween) return;
      autoTween.restart();
      if (hovering > 0) autoTween.pause();
    };
    let slideTween = null;
    let current = 0;
    function goTo(delta) {
      current += delta;
      if (slideTween) slideTween.kill();
      slideTween = gsap.to(state, {
        progress: current,
        duration: reduced ? 0 : transitionDuration,
        ease: 'osmo',
        onUpdate: () => render(state.progress),
      });
      startAutoplay();
    }
    // Step to a specific slide by index
    function goToIndex(i) {
      const delta = wrap(i - current);
      if (delta !== 0) goTo(delta);
    }
    // Autoplay fills the bar
    if (autoplay > 0 && !reduced && fill) {
      gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' });
      autoTween = gsap.to(fill, {
        scaleX: 1,
        duration: autoplay,
        ease: 'none',
        paused: true,
        onComplete: () => goTo(1),
      });
    }
    // Support a horizontal swipe gesture to navigate
    let gestureUsed = false;
    const observer = Observer.create({
      target: root,
      type: 'touch,pointer',
      dragMinimum: 10,
      tolerance: 25,
      lockAxis: true,
      onDragStart() {
        gestureUsed = false;
      },
      onLeft() {
        if (!gestureUsed) {
          gestureUsed = true;
          goTo(1);
        }
      },
      onRight() {
        if (!gestureUsed) {
          gestureUsed = true;
          goTo(-1);
        }
      },
    });
    const onPrev = () => goTo(-1);
    const onNext = () => goTo(1);
    if (prevBtn) prevBtn.addEventListener('click', onPrev);
    if (nextBtn) nextBtn.addEventListener('click', onNext);
    // Click a title: the active one lets its link through, any other jumps to it.
    const onTitleClick = (e) => {
      const i = titles.indexOf(e.currentTarget);
      if (i === activeIndex) return;
      e.preventDefault();
      goToIndex(i);
    };
    titles.forEach((title) => title.addEventListener('click', onTitleClick));
    // Autoplay pauses only while an interactive control is hovered
    const onEnter = () => {
      hovering++;
      if (autoTween) autoTween.pause();
    };
    const onLeave = () => {
      hovering = Math.max(0, hovering - 1);
      if (autoTween && hovering === 0) autoTween.resume();
    };
    controls.forEach((el) => {
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
    });
    const onResize = () => {
      measure();
      render(state.progress);
    };
    window.addEventListener('resize', onResize);
    // Title widths change when the web font swaps in, so re-measure then too.
    if (document.fonts) document.fonts.ready.then(onResize);
    render(0);
    startAutoplay();
    root._layeredSlider = {
      goTo,
      destroy() {
        observer.kill();
        if (slideTween) slideTween.kill();
        if (autoTween) autoTween.kill();
        window.removeEventListener('resize', onResize);
        if (prevBtn) prevBtn.removeEventListener('click', onPrev);
        if (nextBtn) nextBtn.removeEventListener('click', onNext);
        titles.forEach((title) => title.removeEventListener('click', onTitleClick));
        controls.forEach((el) => {
          el.removeEventListener('pointerenter', onEnter);
          el.removeEventListener('pointerleave', onLeave);
        });
        root._layeredSlider = null;
      },
    };
  });
}
// Initialize Layered Image Slider
document.addEventListener('DOMContentLoaded', () => {
  initLayeredImageSlider();
});
