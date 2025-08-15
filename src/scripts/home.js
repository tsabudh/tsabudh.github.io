import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);



const tl = gsap.timeline();

let letters = gsap.utils.toArray("#sabudh span");

tl.from(letters[1], {
  y: "0.5em",
  duration: 0.6,
  delay: 1,
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

const container = document.getElementById("index-email");
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
    ease: "power2.inOut",
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
