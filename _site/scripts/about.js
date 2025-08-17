import gsap, { initScrollSmoother } from "./gsap.js";

// initStickyNavigationHeader();
let aboutPageGsapContext;

export function initAboutPage() {
  try {
    console.log("Executing initAboutPage");
    if (!aboutPageGsapContext) {
      console.log("GSAP AboutPage context not found. Initializing new context.");
      aboutPageGsapContext = gsap.context(() => {
        const text = document.querySelector(".about_hero_text");
        text.innerHTML = text.innerText
          .split("")
          .map(
            (char, i) =>
              `<span style="transform:rotate(${i * 20}deg);">${char}</span>`
          )
          .join("");

          const tl = gsap.timeline();
          // tl.from("#sabudh span", {
          //   y: "20px",
          //   duration: 1,
          //   ease: "power2.inOut",
          // });

          tl.from([".about_hero_h1"], {
            y: "20px",
            duration: 1,
            ease: "power2.inOut",
          });
          tl.from(
            [".about_hero_h2"],
            {
              y: "20px",
              duration: 1,
              ease: "power4.Out",
            },
            "-=0.95"
          );
      });

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
  } catch (error) {
    console.error(error?.message);
  }
}

export function cleanupAboutPage() {
  if (aboutPageGsapContext) {
    aboutPageGsapContext.revert(); // Kills all animations and ScrollTriggers within this context
    aboutPageGsapContext = null; // Clear the context variable
    console.log(
      "GSAP About Page Context and its animations/ScrollTriggers have been reverted."
    );
  }
}

// initAboutPage();
// initScrollSmoother();
// initScrollSmoother();
