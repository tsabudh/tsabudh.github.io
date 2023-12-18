
let isMoving = false;

function cloneFirstAndLastImage() {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, key, parent) => {
    slide.dataset.slideIndex = 1;

    const slidesArray = [...slide.querySelectorAll("img")];
    slidesArray.push(slidesArray[0]);
    slidesArray.unshift(slidesArray[slidesArray.length - 2]);
    slide.innerHTML = slidesArray.map(processImages).join("");

    console.log(slidesArray);
    moveSlides(slide.getAttribute("id"));
  });
}

function processImages(item) {
  return `<img src="${item.getAttribute("src")}" alt="${item.alt}">`;
}

function moveSlides(id) {
  // translate the slide to the first
  let slide = document.getElementById(id);
  let slideIndex = slide.dataset.slideIndex;
  slide.style.transform = `translateX(-${slideIndex * 100}%)`;

  console.log("MOVING SLIDE!!!");
}

// move when clicked

function moveHandler(id, direction) {
  isMoving = true;
  let slide = document.getElementById(id);
  slide.style.transition = `transform 450ms ease-in-out`;
  let slideIndex = new Number(slide.dataset.slideIndex);
  direction !== "right" ? (slideIndex -= 1) : (slideIndex += 1);
  slide.dataset.slideIndex = slideIndex;
  moveSlides(id);
}

cloneFirstAndLastImage();

// click right btn
document
  .querySelectorAll(".slider__btn--right")
  .forEach((button, key, parent) => {
    button.addEventListener("click", (event) => {
      if (isMoving) {
        return;
      }

      moveHandler(event.target.dataset.targetSlideId, "right");
    });
  });

document
  .querySelectorAll(".slider__btn--left")
  .forEach((button, key, parent) => {
    button.addEventListener("click", (event) => {
      if (isMoving) {
        return;
      }
      // console.log(button);
      console.log(event.target.dataset.targetSlideId);
      moveHandler(event.target.dataset.targetSlideId, "left");
    });
  });

document.querySelectorAll(".slide").forEach((slide, key, parent) => {
  slide.addEventListener("transitionend", () => {
    console.log("transition ended.");
    isMoving = false;
    const slidesArray = [...slide.querySelectorAll("img")];
    let slideIndex = Number(slide.dataset.slideIndex);
    console.log(slideIndex);
    if (slideIndex === 0) {
      console.log("GOT HIT AT INDEX 0");
      slide.style.transition = "none";
      slideIndex = slidesArray.length - 2;
      slide.dataset.slideIndex = slideIndex;
      moveSlides(slide.getAttribute("id"));
    }
    if (slideIndex === slidesArray.length - 1) {
      console.log("GOT HIT AT INDEX LAST");

      slide.style.transition = "none";
      slideIndex = 1;
      slide.dataset.slideIndex = slideIndex;
      moveSlides(slide.getAttribute("id"));
    }
  });
});
