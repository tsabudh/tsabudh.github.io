//GLOBALS
export let deviceCode = checkDeviceType();
// 1 for mobile
// 2 for touch devices other than mobile
// 3 for touch devices which also have pointer peripherals
// 4 for non touch devices

function checkDeviceType() {
  if (/Android|iphone/i.test(navigator.userAgent)) return 1;
  else if(navigator.maxTouchPoints > 0 && matchMedia('(pointer:fine)').matches) return 3;
  else if (navigator.maxTouchPoints > 0) return 2;
  else return 4;
}
