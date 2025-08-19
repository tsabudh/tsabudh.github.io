import gsap, { initScrollSmoother } from "./gsap.js";

// initStickyNavigationHeader();
let contactPageGsapContext;

export function initContactPage() {
  try {
    if (!contactPageGsapContext) {
      contactPageGsapContext = gsap.context(() => {
        const stickyTimeline = gsap.timeline();

        // Animate nav with ScrollTrigger directly inside tl.to
        stickyTimeline.to(".stickynavigationcontact", {
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stickynavigationcontact",
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
          ".stickysabudhthapatextcontact",
          {
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".stickysabudhthapatextcontact",
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
          ".stickysabudhthapatextcontact a",
          {
            opacity: 1,
            duration: 2,
            scrollTrigger: {
              trigger: ".stickysabudhthapatextcontact a",
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

export function cleanupContactPage() {
  if (contactPageGsapContext) {
    contactPageGsapContext.revert(); // Kills all animations and ScrollTriggers within this context
    contactPageGsapContext = null; // Clear the context variable
  }
}
