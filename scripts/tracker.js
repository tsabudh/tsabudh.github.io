// let trackingInfo = [];

// function trackMouse() {
//   document.onmousemove = handleMouseMove;
//   function handleMouseMove(event) {
//     console.log(event.pageX, event.pageY);
//     trackingInfo.push([event.pageX, event.pageY]);
//     console.log(trackingInfo);
//   }
// }

// // trackMouse();

// function trackMouse2() {
//   let html = document.getElementsByTagName("body")[0];
//   html.onmousemove = createData;
//   function createData(event) {
//     console.log(event.pageX, event.pageY);
//     trackingInfo.push([event.pageX, event.pageY]);
//     console.log(trackingInfo);
//   }
// }
// // trackMouse2();

// let mouseX = 0;
// let mouseY = 0;
// let clock = 0;
// let scrolled = 0;

// window.addEventListener("scroll", () => {
//   console.log("scrolled!");
//   scrolled = window.scrollY;
//   // You can add your logic here to dynamically update other elements based on the scroll position
// });

// document.addEventListener("mousemove", (event) => {
//   mouseX = event.clientX;
//   mouseY = event.clientY;
// });

// // Use setInterval to continuously log the mouse position
// setInterval(() => {
//   let positionX = mouseX + scrolled;
//   let positionY = mouseY + scrolled;
//   // console.log(`Mouse Position: X=${positionX}, Y=${positionY}, time=${clock}`);
//   trackingInfo.push([positionX, positionY, clock]);
//   // console.log(trackingInfo)
//   clock += 1;
// }, 1);
