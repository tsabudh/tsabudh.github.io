import barba from "@barba/core";
import { initScrollSmoother, smoother } from "./gsap.js";
import gsap from "gsap";

import {
  getTitleFromHref,
  hideCurtains,
  setTextOnLoadingScreen,
  showCurtains,
} from "./transitions.js";

import { cleanupAboutPage, initAboutPage } from "./about.js";
import { cleanupHomePage, initHomePage } from "./home.js";
import { cleanupContactPage, initContactPage } from "./contact.js";

barba.init({
  preventRunning: true,
  prevent: ({ el, event, href }) => {
    console.log("Preventing navigation for:", href);
    event.preventDefault();
    // prevent on hash links
    if (href === "#") {
      event.preventDefault();
      return true;
    }

    // prevent if clicking link to the same namespace
    const nextNamespace = el?.getAttribute("data-barba-namespace");
    const currentNamespace = barba?.history?.current?.namespace;

    if (nextNamespace && currentNamespace === nextNamespace) {
      event.preventDefault();
      return true;
    }

    return false;
  },

  views: [
    {
      namespace: "home",
      afterEnter({ current }) {
        initScrollSmoother();
        initHomePage(current.container);
      },
      afterLeave() {
        cleanupHomePage();
      },
    },
    {
      namespace: "about",
      afterEnter() {
        initScrollSmoother();
        initAboutPage();
        // initScrollSmoother();
      },
      afterLeave() {
        cleanupAboutPage();
      },
    },
    {
      namespace: "contact",
      afterEnter() {
        initScrollSmoother();
        initContactPage();
      },
      afterLeave() {
        cleanupContactPage();
      },
    },
  ],
  transitions: [
    {
      name: "default",
      sync: false,
      async leave({ trigger, current, next }) {
        try {
          let nextTitle;
          gsap.to(current.container.querySelectorAll("p, h1, h2, a"), {
            opacity: 0.1,
            duration: 1.5,
            y: "80px",
            ease: "power2.inOut",
          });

          if (trigger instanceof HTMLElement) {
            // Normal click navigation
            const href = trigger.getAttribute("href");
            nextTitle = getTitleFromHref(href);
          } else {
            // Back/Forward navigation → we don’t have an href
            nextTitle = next.namespace || "Loading";
          }

          setTextOnLoadingScreen(nextTitle);
          return showCurtains(true);
        } catch (err) {
          console.error(err?.message);
        }
      },

      async after({ current, next, trigger }) {
        try {
          if (!(trigger instanceof HTMLElement)) {
            // Back/forward → no curtain to hide
          }
          return hideCurtains();
        } catch (error) {
          console.error(error.message);
        }
      },

      async once() {
        try {
          setTextOnLoadingScreen("Loading");
          showCurtains(false);
          return;
        } catch (err) {
          console.error(err.message);
        }
      },
      afterOnce() {
        hideCurtains(1);
      },
    },
  ],
});
