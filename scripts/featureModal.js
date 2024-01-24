document
  .getElementById("button-modalToggler1")
  .addEventListener("click", displayModal);

let htmlEl = document.querySelector("html");
let featureGallery, modalOverlay;
modalOverlay = document.getElementById("modal-type-1:1");

function displayModal(e) {
  let temp = window.scrollY;
  console.log(temp);

  //   document.documentElement.style.scrollBehavior = "auto";
  htmlEl.style.scrollBehavior = "auto";
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.position = "fixed";

  window.scrollTo({ top: temp });

  modalOverlay.classList.remove("modal-type-1--hidden");

  modalOverlay
    .getElementsByClassName("modal")[0]
    .addEventListener("click", (e) => {
      e.stopPropagation();
    });
  modalOverlay.addEventListener("click", () => {
    modalOverlay.classList.add("modal-type-1--hidden");

    document.body.style.position = "relative";
    document.body.style.top = null;
    window.scrollTo({ top: temp });
    // document.documentElement.style.scrollBehavior = "smooth";
    htmlEl.style.scrollBehavior = "smooth";
  });
}

featureGallery = modalOverlay.getElementsByClassName("feature-gallery")[0];
console.log(featureGallery);
document.addEventListener("scroll", () => {
  console.log("scrolling");
});
featureGallery.addEventListener("scroll", () => {
  console.log("gallery scroll");
});
