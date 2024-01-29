//- Declaring global scope variables for idle time checking and snapping scroll
let idleInterval, // for setInterval
  idleTime = 0, // setting ideal time as 0 initially
  timeoutFunction,
  snapperFunction,
  toSnap = false; // for setTimeout

//- Capturing all sticky_slider's sticky_section throughout the page
const stickySections = [];
document.querySelectorAll(".sticky_slider").forEach((stickySlider) => {
  stickySections.push(stickySlider.querySelector(".sticky_section"));
});

//- Transforming stickySections whenever window is scrolled
window.addEventListener("scroll", (e) => {
  for (let i = 0; i < stickySections.length; i++) {
    transform(stickySections[i]);
  }
});


//- Transform function to horizontally transform the vertical-scrolled portion
function transform(section) {
  const stickySlider = section.parentElement;
  const scrollSection = section.querySelector(".scroll_section");

  //- Finding out number of section-items within scrollSection and adjusting dimensions
  let numOfStackedElements = scrollSection.childElementCount;

  stickySlider.style.height = `${numOfStackedElements * 100}vh`;
  scrollSection.style.width = `${numOfStackedElements * 100}vw`;

  //- Finding out scrolled portion of stickySlider
  let scrolledPortion = window.scrollY - stickySlider.offsetTop;
  // console.log(scrolledPortion);
  let percentageScrolled = (scrolledPortion / window.innerHeight) * 100;

  let factor = (numOfStackedElements - 1) * 100;
  // console.log("percentageScrolled:", percentageScrolled, "factor:", factor);

  //- EXPERIMENT

  snapperFunction = () => {
    // Calculating modulus of 100 of current scrolled percentage(we want scroll to snap at multiples of 100)
    let remainder = percentageScrolled % 100;

    if (!toSnap) {
      return;
    }
    if (remainder == 0) return;

    // Finding closest multiple of multiples of 100 to scroll to
    let roundedPercentageScrolled = Math.round(percentageScrolled / 100) * 100;

    // calculating window offsetY to scroll to. (total scrolled portion within stickySection is divided by window.innerHeight)
    let toScrollTo =
      (roundedPercentageScrolled / 100) * innerHeight + stickySlider.offsetTop;

    // Only snap if remainder is close to 100, ie. percentageScrolled is close to multiples of 100
    if (remainder <= 10 || remainder >= 90) {
      if (idleTime >= 3) {
        // Scroll to the calculated scrollY position
        window.scrollTo({ top: toScrollTo, behavior: "smooth" });

        idleTime = 0;
        clearInterval(idleInterval);
      }
    }
  };
  // timeoutFunction = setTimeout(snapperFunction, 0);
  //- EXPERIMENT ENDS

  //- Adjusting percentageScrolled for last and first scrollSectionItems
  percentageScrolled =
    percentageScrolled < 0
      ? 0
      : percentageScrolled > factor
      ? factor
      : percentageScrolled;

  scrollSection.style.transform = `translate3d(${-percentageScrolled}vw,0,0)`;
}


//- SNAPPING SCROLL TO FIT OF SCROLL ITEMS
window.addEventListener("scroll", () => {
  toSnap = false;
  clearInterval(idleInterval);
  // idleTime = 0;
  clearTimeout(timeoutFunction);
});

window.addEventListener("scrollend", (e) => {
  // Start to increase idleTime when scroll ends
  idleTime = 0;
  toSnap = true;
  idleInterval = setInterval(() => {
    idleTime += 1;
    // console.log("Interval running", idleTime);
    if (idleTime >= 7 && toSnap == true) {
      clearTimeout(timeoutFunction);
      timeoutFunction = setTimeout(snapperFunction, 0);
    }
  }, 100);
});