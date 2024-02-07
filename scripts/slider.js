//- Declaring global scope variables for idle time checking and snapping scroll
let idleInterval, // for setInterval
  idleTime = 0, // setting ideal time as 0 initially
  timeoutFunction,
  snapperFunction,
  toSnap = false; // for setTimeout

//- Capturing all sticky_slider's sticky_section throughout the page
const stickySections = [];

document.querySelectorAll(".sticky_slider").forEach((stickySlider) => {
  let stickySection = stickySlider.querySelector(".sticky_section");

  stickySections.push(stickySection);

  //- Finding out number of section-items within scrollSection and adjusting dimensions
  let scrollSection = stickySlider.querySelector(".scroll_section");
  let numOfStackedElements = scrollSection.childElementCount;

  stickySlider.style.height = `${numOfStackedElements * 100}vh`;
  scrollSection.style.width = `${numOfStackedElements * 100}vw`;

  stickySlider.parentElement.addEventListener("scroll", (e) => {
    //- Transforming stickySections whenever parent of stickySlider is scrolled

    transform(stickySlider.querySelector(".sticky_section"));
  });
});

//- Transform function to horizontally transform the vertical-scrolled portion
function transform(section) {
  const stickySlider = section.parentElement;
  let sliderContainer = stickySlider.parentElement;
  const scrollSection = section.querySelector(".scroll_section");

  //- Finding out number of section-items within scrollSection and adjusting dimensions
  let numOfStackedElements = scrollSection.childElementCount;

  //- Finding out scrolled portion of stickySlider
  let scrolledPortion = sliderContainer.scrollTop - stickySlider.offsetTop;

  let percentageScrolled =
    (scrolledPortion / sliderContainer.clientHeight) * 100;

  console.log(percentageScrolled);
  let factor = (numOfStackedElements - 1) * 100;

  //- Adjusting percentageScrolled for last and first scrollSectionItems
  percentageScrolled =
    percentageScrolled < 0
      ? 0
      : percentageScrolled > factor
      ? factor
      : percentageScrolled;

  scrollSection.style.transform = `translate3d(${-percentageScrolled}vw,0,0)`;
}
