import barba from "@barba/core";
import gsap, { initScrollSmoother, killScrollSmoother } from "./gsap.js";
import { initHomePage } from "./home.js";

// Your load animation timeline
const loadingTimeline = gsap.timeline();

// GSAP animations for the loading screen
const enterAnimation = (container) => {
  // Animate the new content in
  return gsap.from(container, {
    opacity: 0,
    y: 20,
    duration: 0.5,
  });
};

// ... (other animation functions) ...

const pageTransitions = {
  // Use an object to define different transitions
  sync: true, // You can also have async: true
  from: {
    namespace: ["home"], // Define pages where this transition starts
  },
  to: {
    namespace: ["contact"], // Define pages where this transition ends
  },
  before: ({ next }) => {
    // Kill existing ScrollTrigger and ScrollSmoother instances
    killScrollSmoother();

    // This is crucial: Tell ScrollTrigger to clear out old instances
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  },
  after: ({ next }) => {
    // Re-initialize ScrollSmoother and GSAP animations
    initScrollSmoother();

    // Use a conditional to call the correct animation function
    if (next.namespace === "home") {
      initHomePage();
    }
  },
};

barba.init({
  transitions: [
    {
      name: "opacity-transition",
      sync: true,
      // Run your animations on page transition
      enter({ next }) {
        return enterAnimation(next.container);
      },
      leave({ current }) {
        // Animate old content out
      },
      before() {
        // Kill all GSAP stuff
        killScrollSmoother();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      },
      after() {
        // Re-initialize all GSAP stuff
        initScrollSmoother();
        initHomePage(); // or a dynamic function to call the right script
      },
    },
  ],
  views: [
    {
      namespace: "home",
      beforeEnter() {
        // Optional: A good place for page-specific setup
      },
      afterEnter() {
        // This is where we call the home page animations
        initHomePage();
      },
      beforeLeave() {
        // Clean up before leaving the page
        killScrollSmoother();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      },
    },
    // ... define other views like 'contact'
  ],
});
