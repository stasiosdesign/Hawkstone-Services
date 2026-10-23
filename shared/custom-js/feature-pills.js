/* feature-pills: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Rural Conversions (building types). Osmo Supply "Expanding Feature Pills", unchanged.
   Needs GSAP 3.15, which the site already loads globally. Self-contained; paste as-is inside <script></script>.
   Needs: GSAP (site-wide). Hooks: [data-feature-pills-init] and its data-feature-pills-* children.
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
if (window.HawkstoneService?.featurePills) return;
(window.HawkstoneService = window.HawkstoneService || {}).featurePills = true;

function initExpandingFeaturePills() {
  const wraps = document.querySelectorAll("[data-feature-pills-init]");
  if (!wraps.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  wraps.forEach((wrap, wrapIdx) => {
    const items = Array.from(wrap.querySelectorAll("[data-feature-pills-item]"));
    const visuals = Array.from(wrap.querySelectorAll("[data-feature-pills-visual]"));
    const cover = wrap.querySelector("[data-feature-pills-cover]");
    const closeBtn = wrap.querySelector("[data-feature-pills-close]");
    if (!items.length) return;

    if (visuals.length && visuals.length !== items.length) {
      console.warn(
        `[ExpandingFeaturePills] items (${items.length}) and visuals (${visuals.length}) mismatch in module #${wrapIdx}. Visual syncing uses index order.`
      );
    }

    const uidBase = `feature-pills-${wrapIdx}`;
    const ease = "back.out(2)";
    const animationDuration = 0.5;

    const getExpandedWidth = () =>
      getComputedStyle(wrap).getPropertyValue("--content-item-expanded").trim() || "";

    const getActiveIndex = () => {
      const active = items.find((it) => it.getAttribute("data-active") === "true");
      return active ? Number(active.getAttribute("data-feature-pills-index")) : null;
    };

    const setWrapActive = (isActive) => {
      wrap.setAttribute("data-feature-pills-active", isActive ? "true" : "false");
      if (closeBtn) closeBtn.setAttribute("aria-hidden", isActive ? "false" : "true");
      if (cover) {
        cover.setAttribute("data-active", isActive ? "false" : "true");
        cover.setAttribute("aria-hidden", isActive ? "true" : "false");
      }
    };

    const setVisualActive = (indexOrNull) => {
      if (!visuals.length) return;
      visuals.forEach((v) => {
        const idx = Number(v.getAttribute("data-feature-pills-index"));
        const isActive = indexOrNull !== null && idx === indexOrNull;
        v.setAttribute("data-active", isActive ? "true" : "false");
        v.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
    };

    const setItemA11y = (item, isOpen) => {
      const btn = item.querySelector("[data-feature-pills-button]");
      const content = item.querySelector("[data-feature-pills-content]");
      if (!btn || !content) return;
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      content.setAttribute("aria-hidden", isOpen ? "false" : "true");
    };

    const measureButtonH = (item) => {
      const btn = item.querySelector("[data-feature-pills-button]");
      return btn ? Math.ceil(btn.getBoundingClientRect().height) : 0;
    };

    const measureInnerH = (item, expandedW) => {
      const inner = item.querySelector("[data-feature-pills-inner]");
      if (!inner) return 0;

      const mask = item.querySelector(".feature-pills__item-mask");

      const prevMaskOverflow = mask ? mask.style.overflow : null;
      if (mask) mask.style.overflow = "visible";

      const prevMaxW = inner.style.maxWidth;
      if (expandedW) inner.style.maxWidth = expandedW;

      const h = Math.ceil(inner.getBoundingClientRect().height);

      if (expandedW) inner.style.maxWidth = prevMaxW || "";
      if (mask) mask.style.overflow = prevMaskOverflow || "";

      return h;
    };

    const getHeights = (item, expandedW) => {
      const buttonH = measureButtonH(item);
      const innerH = measureInnerH(item, expandedW);
      const openH = Math.max(buttonH, innerH);
      return { buttonH, openH };
    };

    const collapsedWidthPx = new Map();

    const captureCollapsedWidths = () => {
      items.forEach((item) => {
        const prev = item.style.width;
        item.style.width = "";
        collapsedWidthPx.set(item, Math.ceil(item.getBoundingClientRect().width));
        item.style.width = prev;
      });
    };

    const animateBox = (el, vars) => {
      gsap.killTweensOf(el);
      if (prefersReducedMotion) {
        if (vars.height != null) el.style.height = `${vars.height}px`;
        if (vars.width != null) el.style.width = typeof vars.width === "number" ? `${vars.width}px` : vars.width;
        return;
      }
      gsap.to(el, { ...vars, duration: animationDuration, ease, overwrite: true });
    };

    const openItem = (item) => {
      const expandedW = getExpandedWidth();
      const { openH } = getHeights(item, expandedW);

      item.setAttribute("data-active", "true");
      setItemA11y(item, true);
      setWrapActive(true);

      const targetW = expandedW || `${collapsedWidthPx.get(item) || Math.ceil(item.getBoundingClientRect().width)}px`;
      animateBox(item, { height: openH, width: targetW });
    };

    const closeItem = (item) => {
      const expandedW = getExpandedWidth();
      const { buttonH } = getHeights(item, expandedW);

      item.setAttribute("data-active", "false");
      setItemA11y(item, false);

      const targetW = collapsedWidthPx.get(item) || Math.ceil(item.getBoundingClientRect().width);
      animateBox(item, { height: buttonH, width: targetW });
    };

    const switchTo = (nextIndex) => {
      const current = getActiveIndex();
      if (current === nextIndex) return;

      const nextItem = items[nextIndex];
      if (!nextItem) return;

      if (current !== null) closeItem(items[current]);
      openItem(nextItem);

      setVisualActive(nextIndex);
    };

    const closeAll = () => {
      const current = getActiveIndex();
      if (current === null) return;
      closeItem(items[current]);
      setVisualActive(null);
      setWrapActive(false);
    };

    items.forEach((item, i) => {
      item.setAttribute("data-feature-pills-index", String(i));
      if (!item.hasAttribute("data-active")) item.setAttribute("data-active", "false");

      const btn = item.querySelector("[data-feature-pills-button]");
      const content = item.querySelector("[data-feature-pills-content]");
      if (btn) {
        btn.setAttribute("data-feature-pills-index", String(i));
        btn.type = "button";
        const triggerId = `${uidBase}-trigger-${i}`;
        if (!btn.id) btn.id = triggerId;
      }
      if (content && btn) {
        content.setAttribute("data-feature-pills-index", String(i));
        const panelId = `${uidBase}-panel-${i}`;
        if (!content.id) content.id = panelId;
        btn.setAttribute("aria-controls", content.id);
        content.setAttribute("role", "region");
        content.setAttribute("aria-labelledby", btn.id);
        if (!content.hasAttribute("aria-hidden")) content.setAttribute("aria-hidden", "true");
        if (!btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
      }
    });

    visuals.forEach((v, i) => v.setAttribute("data-feature-pills-index", String(i)));

    if (closeBtn) {
      closeBtn.type = "button";
      if (!closeBtn.hasAttribute("aria-hidden")) closeBtn.setAttribute("aria-hidden", "true");
      closeBtn.addEventListener("click", closeAll);
    }

    items.forEach((item) => {
      const h = measureButtonH(item);
      item.style.height = `${h}px`;
    });

    setWrapActive(false);
    setVisualActive(null);

    items.forEach((item, i) => {
      const btn = item.querySelector("[data-feature-pills-button]");
      if (!btn) return;
      btn.addEventListener("click", () => switchTo(i));
    });

    wrap.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });

    const debounce = (fn, wait = 150) => {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
      };
    };

    const handleResize = () => {
      const current = getActiveIndex();

      items.forEach((item) => {
        if (item.getAttribute("data-active") !== "true") item.style.width = "";
      });

      captureCollapsedWidths();

      if (current !== null) {
        const item = items[current];
        const expandedW = getExpandedWidth();
        const { openH } = getHeights(item, expandedW);
        const targetW = expandedW || "";

        if (prefersReducedMotion) {
          item.style.height = `${openH}px`;
          if (targetW) item.style.width = targetW;
        } else {
          const fallbackW = `${Math.ceil(item.getBoundingClientRect().width)}px`;
          const widthForActive = targetW || fallbackW;

          gsap.set(item, { height: openH, width: widthForActive });
          if (targetW) item.style.width = targetW;
        }
      } else {
        items.forEach((item) => {
          const h = measureButtonH(item);
          item.style.height = `${h}px`;
        });
      }
    };

    const debouncedResize = debounce(handleResize, 200);

    captureCollapsedWidths();
    window.addEventListener("resize", debouncedResize, { passive: true });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initExpandingFeaturePills();
});
})();
