import { CLIP_SIZE, DOT_SIZE, dotEl, dotRadius, updateDotSize } from "./dot.js";

let rootEl = document.querySelector(":root");
let heroPage = document.getElementById("hero");
let maskingText = document.getElementById("maskingText") || document.body;

let cursorOnHeroPage = true;

//- Setting event listeners when cursor enters or leaves hero page
heroPage.addEventListener("mouseenter", () => {
  cursorOnHeroPage = true;
});
heroPage.addEventListener("mouseleave", () => {
  cursorOnHeroPage = false;
});

function clipMask() {
  let { left, top } = dotEl.getBoundingClientRect();

  let { left: toMaskLeft, top: toMaskTop } = maskingText
    .getElementsByClassName("to-mask")[0]
    .getBoundingClientRect();

  rootEl.style.setProperty(
    "--clip-position-sabudh",
    `${left + dotRadius * 0.5 - toMaskLeft}px ${
      top + dotRadius * 0.5 - toMaskTop
    }px`
  );

  rootEl.style.setProperty("--clip-size", `${dotRadius * 0.5}px`);
}

function onMouseOverMaskingText(e) {
  // isHoveringOvertoMask = 1;
  updateDotSize(CLIP_SIZE);
  dotEl.style.background = "#45454500";
}
function onMouseLeaveMaskingText(e) {
  // isHoveringOvertoMask = null;
  updateDotSize(DOT_SIZE);
  // dotEl.style.background = "#45454587";
  dotEl.style.background = null;
}

maskingText
  .getElementsByClassName("to-mask")[0]
  .addEventListener("mouseover", onMouseOverMaskingText);
maskingText
  .getElementsByClassName("to-mask")[0]
  .addEventListener("mouseleave", onMouseLeaveMaskingText);

function loop() {
  cursorOnHeroPage == true
    ? clipMask()
    : rootEl.style.setProperty("--clip-size", `0`);

  requestAnimationFrame(loop);
}
loop();
