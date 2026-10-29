/* service-tiers: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Rural Conversions ("Barn conversion planning permission"), Heritage Design ("The work we take on"), 3D
   Visualisations ("Architectural visualisation service options") and Project Management ("Projects that benefit from
   construction-stage support"); every [data-service-tiers] block is set up on its own. Photo cards in a row, one open:
   hovering a card (mouse), focusing it (keyboard) or tapping it (touch) opens it. The open card's flex-grow moves to
   2.4 and the others' to 1 on a spring that is slightly over critically damped (stiffness 170), so the motion eases
   in organically but never overshoots; the edges stay straight (plain DOM boxes, no canvas). The open card also gets
   the is-active combo, which reveals its text and lifts the dim (CSS). On resize the script sets the widths the
   CSS uses to keep photos and text from reflowing mid-motion (--tiers-open-w, --tiers-title-w, --tiers-text-w).
   Below 992px the cards stack (CSS) and only the is-active combo is switched. Reduced motion: the widths jump.
   Needs: nothing beyond the browser. Hooks: [data-service-tiers] (root), [data-service-tiers-card].
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
  if (window.HawkstoneService?.serviceTiers) return;
  (window.HawkstoneService = window.HawkstoneService || {}).serviceTiers = true;

  const OPEN = 2.4; // the open card's flex-grow; the others have 1
  const STIFFNESS = 170;
  const DAMPING = 2 * Math.sqrt(STIFFNESS) * 1.08; // a little over critical: no overshoot

  function initServiceTiers() {
    document.querySelectorAll('[data-service-tiers]').forEach(setup);
  }

  function setup(root) {
    const cards = Array.from(root.querySelectorAll('[data-service-tiers-card]'));
    if (!cards.length) return;
    const list = cards[0].parentElement;
    const row = window.matchMedia('(min-width: 992px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    // The card marked is-active opens first; without one, the first card (slot items in Webflow carry no marks). It
    // opens without its transition, as if marked in the markup: animating it open would move the page below after
    // other scripts (the stacking panels) have measured it.
    let active = Math.max(0, cards.findIndex((c) => c.classList.contains('is-active')));
    // (below 992px the card's own min-height animates too)
    const eased = [...cards, ...root.querySelectorAll('.service-tiers_shade, .service-tiers_reveal, .service-tiers_text')];
    eased.forEach((el) => { el.style.transition = 'none'; });
    cards.forEach((card, i) => card.classList.toggle('is-active', i === active));
    void root.offsetHeight;
    eased.forEach((el) => { el.style.transition = ''; });
    const target = (i) => (i === active ? OPEN : 1);
    const grow = cards.map((_, i) => target(i));
    const speed = cards.map(() => 0);
    let frameId = 0;
    let last = 0;

    const apply = () => cards.forEach((card, i) => { card.style.flexGrow = row.matches ? grow[i] : ''; });

    function measure() {
      if (!row.matches) {
        ['--tiers-open-w', '--tiers-title-w', '--tiers-text-w'].forEach((p) => root.style.removeProperty(p));
        apply();
        return;
      }
      const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
      const available = list.clientWidth - gap * (cards.length - 1);
      const share = available / (OPEN + cards.length - 1);
      const pad = parseFloat(getComputedStyle(cards[0].querySelector('.service-tiers_content')).left) || 0;
      root.style.setProperty('--tiers-open-w', `${OPEN * share}px`);
      root.style.setProperty('--tiers-title-w', `${Math.max(share - 2 * pad, 0)}px`);
      root.style.setProperty('--tiers-text-w', `${Math.max(OPEN * share - 2 * pad, 0)}px`);
      apply();
    }

    function frame(now) {
      frameId = 0;
      const dt = Math.min((now - last) / 1000, 1 / 30) || 1 / 60;
      last = now;
      let motion = 0;
      cards.forEach((_, i) => {
        speed[i] += (STIFFNESS * (target(i) - grow[i]) - DAMPING * speed[i]) * dt;
        grow[i] += speed[i] * dt;
        motion += Math.abs(speed[i]) + Math.abs(target(i) - grow[i]);
      });
      if (motion < 0.002) {
        cards.forEach((_, i) => { grow[i] = target(i); speed[i] = 0; });
        apply();
        return;
      }
      apply();
      frameId = requestAnimationFrame(frame);
    }

    function activate(index) {
      if (index === active) return;
      active = index;
      cards.forEach((card, i) => card.classList.toggle('is-active', i === active));
      if (!row.matches || reduce.matches) {
        cards.forEach((_, i) => { grow[i] = target(i); speed[i] = 0; });
        apply();
        return;
      }
      if (!frameId) {
        last = performance.now();
        frameId = requestAnimationFrame(frame);
      }
    }

    cards.forEach((card, i) => {
      card.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') activate(i); });
      card.addEventListener('focusin', () => activate(i));
      card.addEventListener('click', () => activate(i));
    });
    new ResizeObserver(measure).observe(list);
    row.addEventListener('change', measure);
    measure();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initServiceTiers);
  else initServiceTiers();
})();
