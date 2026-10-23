/* rc-types: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Rural Conversions. Copies the "Meet the team" list of telhaclarke.com.au/studio: while the pinned block
   ([data-rc-types-track]) scrolls, the name for the current share of the track gets is-active, with its photo and
   caption (matched by order); hovering a name selects it instead until the pointer leaves the list. */
(() => {
  function initRcTypes() {
    document.querySelectorAll('[data-rc-types]').forEach((root) => {
      if (root.dataset.rcTypesReady) return;
      root.dataset.rcTypesReady = 'true';
      const track = root.querySelector('[data-rc-types-track]');
      const items = Array.from(root.querySelectorAll('[data-rc-types-item]'));
      const photos = Array.from(root.querySelectorAll('[data-rc-types-photo]'));
      const captions = Array.from(root.querySelectorAll('[data-rc-types-caption]'));
      if (!track || !items.length) return;
      let hovered = -1;
      let current = 0;

      const show = (index) => {
        if (index === current) return;
        current = index;
        [items, photos, captions].forEach((group) => group.forEach((el, i) => el.classList.toggle('is-active', i === index)));
      };
      const fromScroll = () => {
        const r = track.getBoundingClientRect();
        const travel = Math.max(1, r.height - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -r.top / travel));
        return Math.min(items.length - 1, Math.floor(progress * items.length));
      };
      const update = () => show(hovered >= 0 ? hovered : fromScroll());

      items.forEach((item, i) => {
        item.addEventListener('mouseenter', () => { hovered = i; update(); });
      });
      const list = items[0].parentElement;
      list.addEventListener('mouseleave', () => { hovered = -1; update(); });
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initRcTypes);
  else initRcTypes();
})();
