import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap, { smoother } from "./gsap.js";
let homePageGsapContext;

export function initHomePage() {
  try {
    if (!homePageGsapContext) {
      homePageGsapContext = gsap.context(() => {
        const tl = gsap.timeline();
        let letters = gsap.utils.toArray("#sabudh span");

        tl.from(letters[1], {
          y: "0.5em",
          delay: 1,
          duration: 0.6,
          ease: "power4.out",
        });
        tl.from(
          letters[2],
          {
            y: "-0.5em",
            duration: 0.8,
            ease: "power1.out",
          },
          "<"
        );
        tl.from(
          letters[3],
          {
            y: "0.5em",
            duration: 1,
            ease: "power3.out",
          },
          "<"
        );

        tl.from(
          letters[4],
          {
            y: "0.2em",
            duration: 0.6,
            ease: "power2.out",
          },
          "<"
        );
        tl.from(
          letters[5],
          {
            y: "0.7em",
            duration: 0.4,
            ease: "power1.out",
          },
          "<"
        );
        tl.from(
          letters[7],
          {
            y: "0.5em",
            duration: 0.6,
            ease: "power4.out",
          },
          "<"
        );
        tl.from(
          letters[8],
          {
            y: "-0.5em",
            duration: 0.8,
            ease: "power1.out",
          },
          "<"
        );
        tl.from(
          letters[9],
          {
            y: "0.5em",
            duration: 1,
            ease: "power3.out",
          },
          "<"
        );

        tl.from(
          letters[10],
          {
            y: "0.2em",
            duration: 0.6,
            ease: "power2.out",
          },
          "<"
        );

        let currentTween = null;

        // const q = gsap.utils.selector(barbaContainer);

        // const container = q("#index-email");
        const container = document.getElementById("index-email");
        // const distortedRect = q("#distorted-rect");
        const distortedRect = document.getElementById("distorted-rect");

        // Timeline for expanding/reversing the mask

        container.addEventListener("mouseenter", (e) => {
          if (currentTween) currentTween.kill();
          currentTween = gsap.to(distortedRect, {
            attr: {
              x: "50%",
              y: "50%",
              width: "0%",
              height: "0%",
            },
            duration: 1,
            ease: "power2.out",
          });
        });

        container.addEventListener("mouseleave", () => {
          if (currentTween) currentTween.kill();

          currentTween = gsap.to(distortedRect, {
            attr: {
              x: "-50%",
              y: "-50%",
              width: "300%",
              height: "300%",
            },
            duration: 1,
            ease: "power2.inOut",
          });
        });

        // STICKY NAVIGATION
        ScrollTrigger.refresh();
        const stickyTimeline = gsap.timeline();
        let smootherContentEl = smoother.content();

        // Animate nav with ScrollTrigger directly inside tl.to
        stickyTimeline.to(".stickynavigationhome", {
          // y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stickynavigationhome",
            start: "top top",
            endTrigger: smootherContentEl,
            // endTrigger: "#smooth-content",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            scrub: true,

            // markers: true,
            // scroller: smootherContentEl,

            onComplete: () => {
              ScrollTrigger.refresh(true);
            },

            // scroller: "#smooth-content",
          },
        });

        // Animate text with its own scrollTrigger inside timeline

        stickyTimeline.to(
          ".stickysabudhthapatexthome",
          {
            duration: 0.5,
            scrollTrigger: {
              trigger: ".stickysabudhthapatexthome",
              start: "top top",
              end: "bottom bottom",
              endTrigger: "#smooth-content",
              pin: true,
              pinSpacing: false,
              scrub: true,
              // markers: true,
              // scroller: "#smooth-content",
              // scroller: scrollerEl,
            },
          },
          ">"
        );
        stickyTimeline.fromTo(
          ".stickysabudhthapatexthome a",
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 2,
            scrollTrigger: {
              trigger: ".stickysabudhthapatexthome a",
              start: "top top",
              end: "+=200px",
              endTrigger: "#smooth-content",
              pin: true,
              pinSpacing: false,
              scrub: true,
              // markers: true,
              // scroller: "#smooth-content",
              // scroller: scrollerEl,
            },
          },
          ">"
        );
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export function cleanupHomePage() {
  if (homePageGsapContext) {
    homePageGsapContext.revert(); // Kills all animations and ScrollTriggers within this context
    homePageGsapContext = null; // Clear the context variable
  }
}

// initScrollSmoother();
// initHomePage();
// initScrollSmoother();
