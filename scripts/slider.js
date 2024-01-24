const stickySections = [...document.querySelectorAll(".sticky")];

let images = [
  "/img/skd-1.png",
  "/img/skd-2.png",
  "/img/skd-3.png",
  "/img/skd-4.png",
  "/img/skd-4.png",
];

images.forEach((source) => {
  stickySections.forEach((section) => {
    let img = document.createElement("img");
    console.log(section);
    img.src = source;
    section.querySelector(".scroll_section").appendChild(img);
  });
});

window.addEventListener("scroll", (e) => {
  for (let i = 0; i < stickySections.length; i++) {
    transform(stickySections[i]);
  }
});

function transform(section) {
  const offsetTop = section.parentElement.offsetTop;
  const scrollSection = section.querySelector(".scroll_section");

  let scrolledPortion = window.scrollY - offsetTop;
  // console.log(scrolledPortion);

  let percentage = (scrolledPortion / window.innerHeight) * 100;

  percentage = percentage < 0 ? 0 : percentage > 400 ? 400 : percentage;

  console.log(percentage);
  scrollSection.style.transform = `translate3d(${-percentage}vw,0,0)`;
}
