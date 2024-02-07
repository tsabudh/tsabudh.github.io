// Determine if an element is in the visible viewport
function isInViewport(element) {
  // This function could be used by adding a “scroll” event listener to the window and then calling isInViewport().
  var rect = element.getBoundingClientRect();
  //   console.log(rect);
  console.log(element.offsetTop);
  console.log(element.offsetParent);

  var html = document.documentElement;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || html.clientHeight) &&
    rect.right <= (window.innerWidth || html.clientWidth)
  );
}
