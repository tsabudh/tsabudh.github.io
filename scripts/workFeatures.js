let workFeaturesEl = document.getElementsByClassName("work_features")[0];
console.log(workFeaturesEl);
let offsetTop = workFeaturesEl.offsetTop;
let offsetLeft = workFeaturesEl.offsetLeft;
let htmlEl = document.querySelector("html");
let tempRect = workFeaturesEl.getBoundingClientRect();

window.addEventListener("scroll", (event) => {
  let rect = workFeaturesEl.getBoundingClientRect();
  let { height, width, top, bottom, left } = rect;

  if (top <= 0 && bottom >= window.innerHeight) {
    //- Scroll Horizontally

    // htmlEl.style.scrollBehavior = "auto";
    // let ratio = Math.abs(height / width);
    let ratio = Math.abs((window.innerWidth + (17/2)) / window.innerHeight);
    console.log("scrolling horizontally");
    console.log(ratio);
    // console.log(height, top, offsetTop);
    // console.log(width, left, offsetLeft);
    // console.log(top);
    // window.scrollTo({ left: -top });
    workFeaturesEl.style.transform = `translate(${top * ratio}px,0px)`;
  } else {
    // workFeaturesEl.style.transform = `translateX(0px)`;
  }
  //   console.log(top, offsetTop);
  //   console.log(bottom, window.innerHeight);
});

// create a div with the scroll
// let div = document.createElement("div");

// div.style.overflowY = "scroll";
// div.style.width = "50px";
// div.style.height = "50px";

// // must put it in the document, otherwise sizes will be 0
// document.body.append(div);
// let scrollWidth = div.offsetWidth - div.clientWidth;

// div.remove();

// alert(scrollWidth);
