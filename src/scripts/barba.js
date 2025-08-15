import barba from "@barba/core";
import gsap from "gsap";

import {
  getTitleFromHref,
  hideCurtains,
  setTextOnLoadingScreen,
  showCurtains,
} from "./transitions.js";
import { initAboutPageHero } from "./about.js";

const tl = gsap.timeline();
barba.init({
  views: [
    {
      namespace: "about",
      afterEnter() {
        initAboutPageHero();
      },
    },
  ],
  transitions: [
    {
      name: "default",
      async leave({ current, next, trigger }) {
        try {
          const href = trigger?.getAttribute("href");
          const nextTitle = getTitleFromHref(href);
          setTextOnLoadingScreen(nextTitle);

          return showCurtains(true);
        } catch (err) {
          console.log(err);
        }
      },

      async afterEnter({ current, next }) {
        current.container.style.display = "none";
        return hideCurtains();
      },
      async once() {
        try {
          setTextOnLoadingScreen("Loading");
          await showCurtains(false);
          await hideCurtains();
          return;
        } catch (err) {
          console.log(err);
        }
      },
    },
  ],
});
