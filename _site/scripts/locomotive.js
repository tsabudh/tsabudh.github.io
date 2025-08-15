import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);



ScrollSmoother.create({
  smooth: 1,
  smoothTouch: 0.1,
  effects: true,
});