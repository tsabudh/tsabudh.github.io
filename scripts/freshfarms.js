import gsap, { initScrollSmoother } from "./gsap.js";

// initStickyNavigationHeader();
let freshfarmsPageGsapContext;

export function initFreshfarmsPage() {
  try {
    if (!freshfarmsPageGsapContext) {
      freshfarmsPageGsapContext = gsap.context(() => {
        const stickyTimeline = gsap.timeline();

        // Animate nav with ScrollTrigger directly inside tl.to
        stickyTimeline.to(".stickynavigationfreshfarms", {
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stickynavigationfreshfarms",
            start: "top top",
            endTrigger: "#smooth-content",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            scrub: true, // optional: animation follows scroll
            // markers: true,
            // scroller: "#smooth-wraooer"
          },
        });

        // Animate text with its own scrollTrigger inside timeline
        stickyTimeline.to(
          ".stickysabudhthapatextfreshfarms",
          {
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".stickysabudhthapatextfreshfarms",
              start: "top top",
              endTrigger: "#smooth-content",
              end: "bottom top",
              pin: true,
              pinSpacing: false,
              scrub: true,
              // markers: true,
              // scroller: "#smooth-content"
            },
          },
          ">"
        );
        stickyTimeline.to(
          ".stickysabudhthapatextfreshfarms a",
          {
            opacity: 1,
            duration: 2,
            scrollTrigger: {
              trigger: ".stickysabudhthapatextfreshfarms a",
              start: "top top",
              end: "+=100px",
              pin: true,
              pinSpacing: false,
              scrub: true,
              // markers: true,
              // scroller: "#smooth-content"
            },
          },
          ">"
        );
      });
    }
  } catch (error) {
    console.error(error?.message);
  }
}

export function cleanupFreshfarmsPage() {
  if (freshfarmsPageGsapContext) {
    freshfarmsPageGsapContext.revert(); // Kills all animations and ScrollTriggers within this context
    freshfarmsPageGsapContext = null; // Clear the context variable
  }
}
