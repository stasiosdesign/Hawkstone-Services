/* service-expand: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Planning Applications ("Is this the right service for your project?"). Clicking a card's title button (it
   covers the card) opens that card and closes the one that was open; clicking an open card closes it. All cards start
   closed (no is-open in the markup). State is the is-open combo on the card and aria-expanded on its button; the
   motion is CSS. Also on Heritage Design ("How a heritage project runs").
   Needs: nothing beyond the browser. Hooks: [data-service-expand] (the list), [data-service-expand-item],
   [data-service-expand-button].
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
  if (window.HawkstoneService?.serviceExpand) return;
  (window.HawkstoneService = window.HawkstoneService || {}).serviceExpand = true;

  function initServiceExpand() {
    document.querySelectorAll('[data-service-expand]').forEach((list) => {
      const items = Array.from(list.querySelectorAll('[data-service-expand-item]'));
      const set = (item, open) => {
        item.classList.toggle('is-open', open);
        const button = item.querySelector('[data-service-expand-button]');
        if (button) button.setAttribute('aria-expanded', String(open));
      };
      items.forEach((item) => {
        const button = item.querySelector('[data-service-expand-button]');
        if (!button) return;
        button.addEventListener('click', () => {
          const open = !item.classList.contains('is-open');
          items.forEach((other) => { if (other !== item) set(other, false); });
          set(item, open);
        });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initServiceExpand);
  else initServiceExpand();
})();
