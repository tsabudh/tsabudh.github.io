// GLOBALS
const rootEl = document.querySelector(":root");

// GLOBAL CONSTANTS

//* 1. variable to check device type
export let deviceCode = checkDeviceType();
// 1 for mobile
// 2 for touch devices other than mobile
// 3 for touch devices which also have pointer peripherals
// 4 for non touch devices

function checkDeviceType() {
  if (/Android|iphone/i.test(navigator.userAgent)) return 1;
  else if (navigator.maxTouchPoints > 0 && matchMedia("(pointer:fine)").matches)
    return 3;
  else if (navigator.maxTouchPoints > 0) return 2;
  else return 4;
}

//* 2. variable to check if cursor is pointer
export let cursorType;
// 1 for default
// 2 fpr pointer
export const setCursorType = (typeNumber) => {
  cursorType = parseInt(typeNumber || 1);
};

//* CSS variables
window.addEventListener("mousemove", (e) => {
  rootEl.style.setProperty("--cursor-x", `${e.clientX}`);
  rootEl.style.setProperty("--cursor-y", `${e.clientY}`);
});
