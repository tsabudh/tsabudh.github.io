const body = document.body;
// const scrollWrap = document.getElementsByClassName("smooth-scroll-wrapper")[0];
const scrollWrap = document.querySelector(".hero1, .section--about");

const height = scrollWrap.getBoundingClientRect().height - 1;
const speed = 0.06;

var offset = 0;

body.style.height = Math.floor(height) + "px";

function smoothScroll() {
  offset += (window.scrollY - offset) * speed;

  var scroll = "translateY(-" + offset + "px) translateZ(0)";
  scrollWrap.style.transform = scroll;

  let callScroll = requestAnimationFrame(smoothScroll);
}

// smoothScroll();
