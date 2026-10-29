/* service-hero: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: all six service pages. Keeps the hero's rule that the first lines of the H1 and of the supporting text
   start level (the tops of their tallest letters), whatever the words: the H1 mixes Poppins with the taller accent
   serif, so the lift the aside needs depends on which letters open the H1. For each block it finds the words on the
   first line, measures their letters' height with the fonts' own metrics (canvas), takes the shared baseline from a
   zero-size marker, and sets the aside's top margin so the two tops meet. 992px and up only (below, the text stacks
   under the H1); the CSS lift (-.2vw) stays as the fallback without JavaScript. Re-measures on resize and font load.
   Needs: nothing beyond the browser. Hooks: .service-hero_text, its h1 and .service-hero_aside (and the h3 in it).
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
  if (window.HawkstoneService?.serviceHero) return;
  (window.HawkstoneService = window.HawkstoneService || {}).serviceHero = true;

  const ctx = document.createElement('canvas').getContext('2d');
  const desktop = window.matchMedia('(min-width: 992px)');

  // Top of the tallest letter on a block's first line, in viewport pixels
  function firstLineTop(block) {
    const marker = document.createElement('span');
    marker.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    block.insertBefore(marker, block.firstChild);
    const baseline = marker.getBoundingClientRect().bottom;
    marker.remove();
    // A word is on the first line when its box ends less than a line below the first baseline (a wrapped word's box
    // ends below the second baseline). Box tops can't be compared: the accent's zero line height lets a second-line
    // serif box reach up into the first line.
    const limit = baseline + parseFloat(getComputedStyle(block).lineHeight);
    let ascent = 0;
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const style = getComputedStyle(node.parentElement);
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      for (const match of node.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rect = range.getClientRects()[0];
        if (!rect) continue;
        if (rect.bottom > limit) return baseline - ascent; // the word has wrapped to the second line
        ascent = Math.max(ascent, ctx.measureText(match[0]).actualBoundingBoxAscent);
      }
    }
    return baseline - ascent;
  }

  function level(root) {
    const heading = root.querySelector('h1');
    const aside = root.querySelector('.service-hero_aside');
    const text = aside && aside.querySelector('h3, p');
    if (!heading || !text) return;
    aside.style.marginTop = '';
    if (!desktop.matches) return;
    const offset = firstLineTop(text) - firstLineTop(heading);
    const current = parseFloat(getComputedStyle(aside).marginTop) || 0;
    aside.style.marginTop = `${(current - offset).toFixed(2)}px`;
  }

  function init() {
    const roots = document.querySelectorAll('.service-hero_text');
    const run = () => roots.forEach(level);
    run();
    if (document.fonts) document.fonts.ready.then(run);
    window.addEventListener('resize', run);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
