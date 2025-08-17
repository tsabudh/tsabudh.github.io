import gsap from "./gsap";

export function initStickyNavigationHeader() {
  console.log("executing initStickyNavigationHeader");
  const stickyTimeline = gsap.timeline();

  // Animate nav with ScrollTrigger directly inside tl.to
  stickyTimeline.to(".stickynavigation", {
    y: 0,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".stickynavigation",
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
    ".stickysabudhthapatext",
    {
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".stickysabudhthapatext",
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
    ".stickysabudhthapatext a",
    {
      opacity: 1,
      duration: 2,
      scrollTrigger: {
        trigger: ".stickysabudhthapatext a",
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
}
