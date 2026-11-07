import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother = null;
export function initScrollSmoother() {

  if (smoother) {
    smoother.scrollTo(0);
    smoother.kill();
    ScrollTrigger.killAll();
  }

  // let sm = ScrollSmoother.get();
  // sm.scrollTo(0);
  // sm.kill();

  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1,
    smoothTouch: 0.1,
    effects: true,
  });
  ScrollTrigger.refresh();
  guardWrapperScroll();
  if (scrollToHash(location.hash, false)) settleOnHash(location.hash);
}

// Web fonts and images that arrive after the first jump change the layout
// (the advisory-lock post grows by ~740px when its fonts land), leaving the
// anchor hundreds of pixels off. Jump again once loading is done, unless the
// reader has started scrolling or the hash has changed meanwhile.
function settleOnHash(hash) {
  let readerMoved = false;
  const events = ["wheel", "touchstart", "keydown", "pointerdown"];
  const onMove = () => { readerMoved = true; };
  events.forEach((e) => window.addEventListener(e, onMove, { once: true, passive: true }));

  const pageLoaded = document.readyState === "complete"
    ? Promise.resolve()
    : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
  const fontsLoaded = document.fonts?.ready ?? Promise.resolve();

  Promise.all([pageLoaded, fontsLoaded]).then(() => {
    events.forEach((e) => window.removeEventListener(e, onMove));
    if (readerMoved || location.hash !== hash) return;
    ScrollTrigger.refresh();
    scrollToHash(hash, false);
  });
}

// The smoother wrapper is fixed with overflow:hidden, but the browser still
// scrolls it for fragment jumps (#id in the URL), find-in-page and focus.
// That offset stacks on top of the smoother's own (window) scroll and leaves
// a long blank tail at the end of the page. Move any such offset onto the
// smoother instead, so there is only ever one scroll position.
let guardedWrapper = null;
function guardWrapperScroll() {
  const wrapper = smoother?.wrapper();
  if (!wrapper || wrapper === guardedWrapper) return;
  guardedWrapper = wrapper;
  wrapper.addEventListener("scroll", () => {
    const drift = wrapper.scrollTop;
    if (!drift || !smoother) return;
    wrapper.scrollTop = 0;
    smoother.scrollTop(smoother.scrollTop() + drift);
  });
}

function targetForHash(hash) {
  if (!hash || hash === "#") return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

// Scroll to an in-page anchor through the smoother, honouring scroll-margin-top.
export function scrollToHash(hash, smooth = true) {
  const target = targetForHash(hash);
  if (!target) return false;
  if (!smoother) {
    target.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    return true;
  }
  const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  smoother.scrollTo(target, smooth, `top ${offset}px`);
  return true;
}

// Same-page anchor links ("#checklist" or "/this/page/#checklist").
export function isSamePageHashLink(el) {
  if (!el || el.target === "_blank" || !el.hash) return false;
  return el.origin === location.origin && el.pathname === location.pathname;
}

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest?.("a[href]");
  if (!isSamePageHashLink(link)) return;
  if (!scrollToHash(link.hash)) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(history.state, "", link.hash);
});

export default gsap;
export { smoother };
export { ScrollSmoother };
export { ScrollTrigger };
