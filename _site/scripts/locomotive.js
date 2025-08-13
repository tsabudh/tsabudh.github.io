import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);



ScrollSmoother.create({
  smooth: 1,
  smoothTouch: 0.1,
  effects: true,
});