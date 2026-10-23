/* highlight-text: page custom code (Webflow: Page settings > Custom code > Before </body> tag).
   Used on: Planning Applications, Luxury Architecture. Self-contained; paste as-is inside <script></script>.
   Needs: GSAP + ScrollTrigger + SplitText (site-wide). Hooks: [data-highlight-text] (+ optional data-highlight-* settings).
   Wrapped so it runs once per page and adds no global names (the Webflow site loads other code). */
(() => {
if (window.HawkstoneService?.highlightText) return;
(window.HawkstoneService = window.HawkstoneService || {}).highlightText = true;

gsap.registerPlugin(ScrollTrigger, SplitText);
function ensureSrOnlyStyles() {
  if (document.getElementById("sr-only-styles")) return;
  const style = document.createElement("style");
  style.id = "sr-only-styles";
  style.textContent = `
    .sr-only{
      position:absolute!important;
      width:1px;height:1px;
      padding:0;margin:-1px;
      overflow:hidden;
      clip:rect(0,0,0,0);
      white-space:nowrap;
      border:0;
    }
  `;
  document.head.appendChild(style);
}
function getA11yText(el) {
  // Optional override: add data-highlight-a11y="Full heading text here"
  const fromAttr = el.getAttribute("data-highlight-a11y");
  const text = (fromAttr && fromAttr.trim()) ? fromAttr : (el.textContent || "");
  return text.replace(/\s+/g, " ").trim();
}
function injectSrOnly(el, text) {
  if (!text) return;
  // Only add once
  if (el.querySelector(":scope > .sr-only")) return;
  const span = document.createElement("span");
  span.className = "sr-only";
  span.textContent = text;
  el.prepend(span);
}
function initHighlightText() {
  ensureSrOnlyStyles();
  const splitHeadingTargets = document.querySelectorAll("[data-highlight-text]");
  splitHeadingTargets.forEach((heading) => {
    // Prevent double-init (important in Webflow interactions / re-runs)
    if (heading.dataset.highlightInit === "true") return;
    heading.dataset.highlightInit = "true";
    const originalText = getA11yText(heading);
    const scrollStart = heading.getAttribute("data-highlight-scroll-start") || "top 90%";
    const scrollEnd = heading.getAttribute("data-highlight-scroll-end") || "center 40%";
    const fadedValue = parseFloat(heading.getAttribute("data-highlight-fade")) || 0.2;
    const staggerValue = parseFloat(heading.getAttribute("data-highlight-stagger")) || 0.1;
    new SplitText(heading, {
      type: "words, chars",
      autoSplit: true,
      onSplit(self) {
        // --- Accessibility / Lighthouse patch ---
        // SplitText adds aria-label to preserve a readable name; Lighthouse dislikes it on a div.
        heading.removeAttribute("aria-label");
        // Provide one readable text node for assistive tech (doesn't affect layout/animation)
        injectSrOnly(heading, originalText);
        // --- Your animation (unchanged behaviour) ---
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              scrub: 1,
              trigger: heading,
              start: scrollStart,
              end: scrollEnd,
            }
          });
          tl.from(self.chars, {
            autoAlpha: fadedValue,
            stagger: staggerValue,
            ease: "linear"
          });
        }, heading);
        return ctx;
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", initHighlightText);
})();
