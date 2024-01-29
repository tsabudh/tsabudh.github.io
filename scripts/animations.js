let animatedEl = document.querySelector(".a-slide-from-top");

let animate = (e) => {
  let left = animatedEl.getBoundingClientRect().left;
  if (left <= 0.9 * window.innerWidth) {
    animatedEl.classList.add("triggered");
  } else {
    animatedEl.classList.remove("triggered");
  }
};

// window.addEventListener("scroll", animate);
