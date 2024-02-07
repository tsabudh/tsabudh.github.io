//-  WORK VISIT BUTTON
let visitButton = document.querySelector(".visit_work--skd");

let stickySection = document.querySelector(".scroll_section--skd");
let modal = stickySection.parentElement;

//todo FIX VISIT BUTTON, MAKE IT AVAILABLE FOR EVERY SLIDERS
window.addEventListener("scroll", () => {
let left = stickySection.getBoundingClientRect().left;
  if (left < -900) {
    visitButton.classList.remove("hidden");
  } else {
    visitButton.classList.add("hidden");
  }
});

//-   WORK FEATURE INTRO
let skdWorkIntro = document.getElementsByClassName("work_feature--intro")[0];

function addAnimationIntro() {
  let featureTitle = skdWorkIntro.querySelector(".feature_title--intro");
  let paragraphs = skdWorkIntro.querySelectorAll("p");
  let introLogo = skdWorkIntro.querySelector(".intro_logo");

  let rect = skdWorkIntro.getBoundingClientRect();
  let ratio = rect.left / rect.width;

  featureTitle.style.transform = `translateX(${ratio * 100}%)`;
  featureTitle.style.opacity = `${1 + ratio}`;

  introLogo.style.transform = `translateX(${ratio * 2 * 100}%)`;

  paragraphs.forEach((el) => {
    el.style.transform = `translateX(${ratio * 130}%)`;
    el.style.opacity = `${1 + ratio}`;
  });
}

window.addEventListener("scroll", addAnimationIntro);

/*

//*

*/

//- WORK FEATURE SECOND

let skdWork2 = document.getElementsByClassName("work_feature--second")[0];

function animationFirst() {
  let images = skdWork2.querySelectorAll(".transaction_image,.record_image");
  // let rect = skdWorkIntro.getBoundingClientRect();
  let rect = skdWork2.getBoundingClientRect();
  let ratio = rect.left / rect.width;

  if (ratio <= 0.85) {
    images.forEach((figure) => figure.classList.add("show"));
  }
  if (ratio >= 1.8) {
    images.forEach((figure) => figure.classList.remove("show"));
  }
  // transitionSecond = false;
}

window.addEventListener("scroll", animationFirst);

/* 

//*
*/

//- WORK FEATURE THIRD
let skdWork3 = document.getElementsByClassName("work_feature--third")[0];

let scrollers = skdWork3.querySelectorAll(".scroller");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation2();
}

function addAnimation2() {
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", true);
    const iconStrip = scroller.querySelector(".icon-strip");
    const iconStripContent = Array.from(iconStrip.children);

    iconStripContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      iconStrip.appendChild(duplicatedItem);
    });
  });
}
