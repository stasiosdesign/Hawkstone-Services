/* sticky-steps: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Rural Conversions, Heritage Design, 3D Visualisations. Self-contained; paste as-is inside <script></script>.
   Needs: nothing beyond the browser. Hooks: [data-sticky-steps-init], [data-sticky-steps-item].
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
if (window.HawkstoneService?.stickySteps) return;
(window.HawkstoneService = window.HawkstoneService || {}).stickySteps = true;

  function initStickyStepsBasic() {
    const containers = document.querySelectorAll('[data-sticky-steps-init]');
    if (!containers.length) return;
    containers.forEach((container) => {
      const items = [...container.querySelectorAll('[data-sticky-steps-item]')];
      if (!items.length) return;
      function updateSteps() {
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;
        items.forEach((item, index) => {
          const anchor = item.querySelector('[data-sticky-steps-anchor]');
          if (!anchor) return;
          const rect = anchor.getBoundingClientRect();
          const anchorCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - anchorCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        items.forEach((item, index) => {
          let status = 'active';
          if (index < closestIndex) status = 'before';
          if (index > closestIndex) status = 'after';
          item.setAttribute('data-sticky-steps-item-status', status);
        });
      }
      window.addEventListener('scroll', updateSteps);
      window.addEventListener('resize', updateSteps);
      requestAnimationFrame(updateSteps);
    });
  }
  // Initialize Sticky Steps (Basic)
  document.addEventListener('DOMContentLoaded', function () {
    initStickyStepsBasic();
  });
})();
