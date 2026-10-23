/* bouncy-tabs: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Luxury Architecture, Planning Applications, 3D Visualisations. Self-contained; paste as-is inside <script></script>.
   Needs: GSAP (site-wide). Hooks: [data-bouncy-tabs-init] and its data-bouncy-tabs-* children.
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
if (window.HawkstoneService?.bouncyTabs) return;
(window.HawkstoneService = window.HawkstoneService || {}).bouncyTabs = true;

function initBouncyContentTabs() {
  const config = {
    travel: 0.45,          // indicator glide duration
    travelEase: "power3.out",
    panelOut: 0.2,         // outgoing panel fade/slide; finishes before the incoming panel starts
    panelIn: 0.45,         // incoming panel fade/slide
    panelShift: 20,        // px the incoming panel slides (was 35); the outgoing one moves half this
    heightDuration: 0.4,   // panel wrapper height change
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let instanceCount = 0;
  document.querySelectorAll("[data-bouncy-tabs-init]").forEach((root) => {
    const nav = root.querySelector("[data-bouncy-tabs-nav]");
    const indicator = root.querySelector("[data-bouncy-tabs-indicator]");
    const ghost = root.querySelector("[data-bouncy-tabs-ghost]");
    const buttons = nav ? Array.from(nav.querySelectorAll("[data-bouncy-tabs-button]")) : [];
    if (!nav || !indicator || buttons.length < 2) return;
    const card = root.querySelector("[data-bouncy-tabs-card]");
    const panelsWrap = root.querySelector("[data-bouncy-tabs-panels]");
    const panels = panelsWrap
      ? Array.from(panelsWrap.querySelectorAll("[data-bouncy-tabs-panel]"))
      : [];
    const hasCard = Boolean(card && panelsWrap && panels.length);
    instanceCount += 1;
    buttons.forEach((button, i) => {
      const panel = panels[i];
      if (!panel) return;
      if (!button.id) button.id = "bouncy-tabs-" + instanceCount + "-tab-" + (i + 1);
      if (!panel.id) panel.id = "bouncy-tabs-" + instanceCount + "-panel-" + (i + 1);
      button.setAttribute("aria-controls", panel.id);
      panel.setAttribute("aria-labelledby", button.id);
    });
    let activeIndex = Math.max(0, buttons.findIndex((b) => b.hasAttribute("data-active")));
    const pos = { left: 0, right: 0 };
    let ghostVisible = false;
    let cardTimeline = null;
    const dur = (d) => (reduceMotion.matches ? 0 : d);
    function syncButtonState() {
      buttons.forEach((b, i) => {
        b.toggleAttribute("data-active", i === activeIndex);
        b.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
        b.tabIndex = i === activeIndex ? 0 : -1;
      });
    }
    function rectFor(button) {
      return {
        left: button.offsetLeft,
        right: button.offsetLeft + button.offsetWidth,
        top: button.offsetTop,
        height: button.offsetHeight,
      };
    }
    function render() {
      gsap.set(indicator, { x: pos.left, width: pos.right - pos.left });
    }
    function place(index) {
      const target = rectFor(buttons[index]);
      pos.left = target.left;
      pos.right = target.right;
      gsap.killTweensOf(pos);
      gsap.killTweensOf(indicator);
      gsap.set(indicator, { y: target.top, height: target.height });
      render();
    }
    function setPanelsHeight() {
      if (hasCard) gsap.set(panelsWrap, { height: panels[activeIndex].offsetHeight });
    }
    function swapPanelsInstant() {
      if (!hasCard) return;
      panels.forEach((p, i) => {
        gsap.killTweensOf(p);
        gsap.set(p, { autoAlpha: i === activeIndex ? 1 : 0, x: 0 });
        p.toggleAttribute("data-active", i === activeIndex);
      });
      setPanelsHeight();
    }
    function transitionCard(prevIndex, movingRight) {
      if (!hasCard) return;
      const direction = movingRight ? 1 : -1;
      const incoming = panels[activeIndex];
      const outgoing = panels[prevIndex];
      if (!incoming || !outgoing) return;
      // Stop the previous change outright (a quick second click), so no tween from it keeps running
      if (cardTimeline) cardTimeline.kill();
      panels.forEach((p) => {
        if (p !== incoming && p !== outgoing) {
          gsap.killTweensOf(p);
          gsap.set(p, { autoAlpha: 0, x: 0 });
          p.removeAttribute("data-active");
        }
      });
      incoming.setAttribute("data-active", "");
      outgoing.removeAttribute("data-active");
      gsap.killTweensOf([panelsWrap, incoming, outgoing]);
      const targetHeight = incoming.offsetHeight;
      // The panels are stacked in the same place, so they run one after the other: the outgoing panel
      // fades out completely before the incoming one fades in. Running them together showed both
      // panels' text and images on top of each other, sliding in opposite directions.
      cardTimeline = gsap.timeline()
        .to(outgoing, {
          x: direction * -config.panelShift * 0.5,
          autoAlpha: 0,
          duration: config.panelOut,
          ease: "power1.out",
        }, 0)
        .to(panelsWrap, {
          height: targetHeight,
          duration: config.heightDuration,
          ease: "power3.inOut",
        }, 0)
        .fromTo(
          incoming,
          { x: direction * config.panelShift, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: config.panelIn, ease: "power3.out", immediateRender: true },
          config.panelOut
        )
        .set(outgoing, { x: 0 });
    }
    function goTo(index) {
      if (index === activeIndex) return;
      const prevIndex = activeIndex;
      const movingRight = index > activeIndex;
      activeIndex = index;
      syncButtonState();
      if (reduceMotion.matches) {
        place(index);
        swapPanelsInstant();
        return;
      }
      transitionCard(prevIndex, movingRight);
      const target = rectFor(buttons[index]);
      gsap.killTweensOf(pos);
      gsap.killTweensOf(indicator);
      gsap.to(indicator, {
        y: target.top,
        height: target.height,
        duration: config.travel,
        ease: config.travelEase,
      });
      gsap.to(pos, {
        left: target.left,
        right: target.right,
        duration: config.travel,
        ease: config.travelEase,
        onUpdate: render,
      });
    }
    function moveGhost(button) {
      if (!ghost) return;
      const target = rectFor(button);
      if (!ghostVisible) {
        ghostVisible = true;
        gsap.killTweensOf(ghost);
        gsap.set(ghost, {
          x: target.left,
          y: target.top,
          width: target.right - target.left,
          height: target.height,
        });
        gsap.to(ghost, { autoAlpha: 1, duration: dur(0.25), ease: "power2.out" });
      } else {
        gsap.to(ghost, {
          x: target.left,
          y: target.top,
          width: target.right - target.left,
          height: target.height,
          autoAlpha: 1,
          duration: dur(0.3),
          ease: "power3.out",
        });
      }
    }
    function hideGhost() {
      if (!ghost) return;
      ghostVisible = false;
      gsap.to(ghost, { autoAlpha: 0, duration: dur(0.2), ease: "power1.out" });
    }
    function refreshLayout() {
      const rows = new Set(buttons.map((b) => b.offsetTop));
      nav.toggleAttribute("data-wrapped", rows.size > 1);
      place(activeIndex);
      setPanelsHeight();
    }
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => goTo(index));
      button.addEventListener("mouseenter", () => moveGhost(button));
    });
    nav.addEventListener("mouseleave", hideGhost);
    nav.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight") next = Math.min(buttons.length - 1, activeIndex + 1);
      if (event.key === "ArrowLeft") next = Math.max(0, activeIndex - 1);
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next === null) return;
      event.preventDefault();
      if (next !== activeIndex) {
        goTo(next);
        buttons[next].focus();
      }
    });
    window.addEventListener("resize", refreshLayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshLayout);
    if (ghost) gsap.set(ghost, { autoAlpha: 0 });
    panels.forEach((p, i) => gsap.set(p, { autoAlpha: i === activeIndex ? 1 : 0 }));
    syncButtonState();
    refreshLayout();
  });
}
document.addEventListener("DOMContentLoaded", () => {
  initBouncyContentTabs();
});
})();
