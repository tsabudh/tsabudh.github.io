import barba from "@barba/core";
import { initScrollSmoother, smoother } from "./gsap.js";

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
  prevent: ({ el, href }) => href == "#",

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
      afteEnter() {
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
      async leave({ trigger }) {
        try {
          const href = trigger?.getAttribute("href");
          const nextTitle = getTitleFromHref(href);
          setTextOnLoadingScreen(nextTitle);
          return showCurtains(true);
        } catch (err) {
          console.error(err?.message);
        }
      },

      async after({ current, next }) {
        try {
          return hideCurtains();
        } catch (error) {
          console.error(error.message);
        }
      },

      async once() {
        try {
          setTextOnLoadingScreen("Loading");
          await showCurtains(false);
          return;
        } catch (err) {
          console.error(err.message);
        }
      },
      afterOnce() {
        hideCurtains();
      },
    },
  ],
});
