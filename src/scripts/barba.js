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
import { cleanupFreshfarmsPage, initFreshfarmsPage } from "./freshfarms.js";
import { initLinkTracking, trackPageView } from "./analytics.js";
import { initBackpressurePlayground } from "./backpressure.js";

initLinkTracking();

barba.init({
  preventRunning: true,
  prevent: ({ el, event, href }) => {
    // dummy links: swallow the click
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

    // Let the browser handle what is not a page: in-page anchors and plain files
    // (scripts, text, images, archives). Returning true leaves the click alone;
    // Barba would otherwise swallow it and try to load the file as a page.
    const url = new URL(href, window.location.href);
    const samePage =
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname;
    if (url.hash && samePage) {
      return true;
    }
    if (/\.(py|txt|md|json|csv|pdf|zip|png|jpe?g|gif|webp|svg|xml)$/i.test(url.pathname)) {
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
    {
      namespace: "freshfarms",
      afterEnter() {
        initScrollSmoother();
        initFreshfarmsPage();
      },
      afterLeave() {
        cleanupFreshfarmsPage();
      },
    },
    {
      namespace: "blog",
      afterEnter() {
        initScrollSmoother();
      },
    },
    {
      namespace: "post",
      afterEnter() {
        initScrollSmoother();
      },
    },
    {
      namespace: "hire",
      afterEnter() {
        initScrollSmoother();
      },
    },
    {
      namespace: "backpressure",
      afterEnter() {
        initScrollSmoother();
        initBackpressurePlayground();
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
          trackPageView(window.location.pathname, document.title);
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
      afterOnce({ current }) {
        if (current?.namespace === "backpressure") {
          initBackpressurePlayground();
        }
        trackPageView(window.location.pathname, document.title);
        hideCurtains(1);
      },
    },
  ],
});
