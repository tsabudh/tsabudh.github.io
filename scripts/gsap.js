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
}

export default gsap;
export { smoother };
export { ScrollSmoother };
export { ScrollTrigger };
