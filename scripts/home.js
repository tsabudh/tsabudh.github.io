
import { deviceCode } from './global.js';

//PERSONAL AND PROFESSIONAL CHECKBOX WITH TARGET TO RESPECTIVE IDS
const goToLink = function (id) {
  //setTimeout is called because the javascript function seems to call first before the
  // display:none property of corresponding page div is changed to display:block
  setTimeout(() => {
    location.href = `#${id}`;
  }, 400);
};

//SECTION MEMORY // EXPANDING CARDS SCRIPT
const slides = document.getElementsByClassName('slide');

[...slides].forEach(slide => {
  slide.addEventListener('click', function () {
    [...slides].forEach(function (slide) {
      slide.classList.remove('active');
    });
    // [...slides].classList.remove("active"); // WON'T WORK, "array of html elements as a whole" do not have classList, each element has classList
    slide.classList.add('active');
  });
});

//* Hero 1
function getToKnowHimHandler() {
  let getToKnowHimButton = document.getElementsByClassName('make-visible')[0];
  if (deviceCode <= 2)
    getToKnowHimButton.querySelector('button').classList.remove('hidden');

  getToKnowHimButton.addEventListener('mouseover', event => {
    document.getElementsByClassName('name')[0].classList.add('focused');
  });

  getToKnowHimButton.addEventListener('click', event => {
    document
      .getElementsByClassName('section--about')[0]
      .scrollIntoView({ behavior: 'smooth' });
  });
}

getToKnowHimHandler();
