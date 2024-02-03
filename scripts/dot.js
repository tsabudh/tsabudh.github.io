import { deviceCode, cursorType } from "./global.js"; 


export const DOT_SIZE = 40;
export const CLIP_SIZE = 46;
export let expectedDotRadius;
expectedDotRadius = DOT_SIZE; // Defines the final value that dotRadius interpolate to
 
export let dotRadius = DOT_SIZE;

//- Initializing dotEl as global variable
export const dotEl = document.createElement("div");
dotEl.id = "dotCursor"; // Setting id on dotEl
dotEl.style.width = dotRadius + "px";
dotEl.style.height = dotRadius + "px";
dotEl.style.position = "fixed";
dotEl.style.zIndex = "100";
// dotEl.style.background = "#45454587";
dotEl.style.borderRadius = "50%";
dotEl.style.pointerEvents = "none";
// dotEl.style.transition = `background 1s ease`;

document.body.appendChild(dotEl);



function followingDotCursor(options) {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: width / 2 };
  let lag = 10;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Re-initialise or destroy the cursor when the prefers-reduced-motion setting changes
  prefersReducedMotion.onchange = () => {
    if (prefersReducedMotion.matches) {
      destroy();
    } else {
      init();
    }
  };

  function init() {
    // Don't show the dot cursor if the user has prefers-reduced-motion enabled
    if (prefersReducedMotion.matches) {
      console.log(
        "This browser has prefers reduced motion turned on, so the cursor did not initialized"
      );
      return false;
    }

    bindEvents();
    loop();
  }
  function bindEvents() {
    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onWindowResize);

  }
  function onWindowResize(e) {
    width = window.innerWidth;
    height = window.innerHeight;
  }
  function onMouseMove(e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    // console.log(cursor.x, cursor.y, 'mousemove')
  }



  const moveTowards = function (x, y) {
    let { left, top } = dotEl.getBoundingClientRect();

    let previousDotRadius = dotRadius;
    let offsetDifferenceInRadius = 0;

    dotRadius = dotRadius + (expectedDotRadius - dotRadius) / lag;
    offsetDifferenceInRadius = (dotRadius - previousDotRadius) * 0.5;

    dotEl.style.left =
      left -
      offsetDifferenceInRadius +
      (x - left - dotRadius * 0.5) / lag +
      "px";

    dotEl.style.top =
      top - offsetDifferenceInRadius + (y - top - dotRadius * 0.5) / lag + "px";
  };

  function loop() {
    moveTowards(cursor.x, cursor.y);

    dotEl.style.width = dotRadius + "px";
    dotEl.style.height = dotRadius + "px";

    requestAnimationFrame(loop);
    // cursorOnHeroPage == true && isHoveringOverName == 1
  }

  init();
}

if (deviceCode >= 3)
  window.addEventListener("load", (event) => {
    new followingDotCursor({ element: document.body });
  });


//- Changing dotCursor's behavior on hovering certain elements

let blendAppliedEls = document.querySelectorAll("[data-dch-blend]");
blendAppliedEls.forEach((el) => {
  el.addEventListener("mouseover", () => {
    dotEl.classList.add("link-01");
    let x = getComputedStyle(dotEl).getPropertyValue("--dot-radius");
    expectedDotRadius = x;
  });

  el.addEventListener("mouseleave", () => {
    dotEl.classList.remove("link-01");
    expectedDotRadius = DOT_SIZE;
  });
});

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

export function updateDotSize(value){
  expectedDotRadius = value;
}