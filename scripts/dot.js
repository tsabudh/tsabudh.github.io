import { deviceCode, cursorType } from './global.js';

let rootEL = document.querySelector(':root');
let tsabudh = document.getElementById('tsabudh') || document.body;
let resizeDot;
let isHoveringOverName;
const DOT_SIZE = 40;
const CLIP_SIZE = 45;

function followingDotCursor(options) {
  let hasWrapperEl = options && options.element;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: width / 2 };
  let animationFrame;
  let lag = 10;
  let dotRadius = DOT_SIZE;
  let color = options?.color || '#323232a6';
  let dotSizeFactor = 1;

  let dotEl = document.createElement('div');

  dotEl.style.width = dotRadius + 'px';
  dotEl.style.height = dotRadius + 'px';
  dotEl.style.position = 'fixed';
  dotEl.style.zIndex = '100';
  dotEl.style.background = '#45454587';
  // dotEl.style.border = '1px solid #454545';
  dotEl.style.borderRadius = '50%';
  dotEl.style.pointerEvents = 'none';
  dotEl.style.transition = `width 0.5s ease, height 0.5s ease, background 1s ease`;
  document.body.appendChild(dotEl);

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  // Re-initialise or destroy the cursor when the prefers-reduced-motion setting changes
  prefersReducedMotion.onchange = () => {
    if (prefersReducedMotion.matches) {
      destroy();
    } else {
      init();
    }
  };

  function init() {
    // Don't show the cursor trail if the user has prefers-reduced-motion enabled
    if (prefersReducedMotion.matches) {
      console.log(
        'This browser has prefers reduced motion turned on, so the cursor did not init'
      );
      return false;
    }

    bindEvents();
    loop();
  }
  // Bind events that are needed
  function bindEvents() {
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    tsabudh.addEventListener('mouseover', onMouseOverTsabudh);
    tsabudh.addEventListener('mouseleave', onMouseLeaveTsabudh);
  }
  function onWindowResize(e) {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  function onMouseMove(e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    // console.log(cursor.x, cursor.y, 'mousemove')
  }

  function onMouseOverTsabudh(e) {
    isHoveringOverName = 1;
    dotRadius = CLIP_SIZE;
    dotEl.style.width = dotRadius + 'px';
    dotEl.style.height = dotRadius + 'px';
    dotEl.style.background = '#45454500';
  }
  function onMouseLeaveTsabudh(e) {
    // isHoveringOverName = null;
    dotRadius = DOT_SIZE;
    dotEl.style.width = dotRadius + 'px';
    dotEl.style.height = dotRadius + 'px';
    dotEl.style.background = '#45454587';
  }

  const moveTowards = function (x, y) {
    let { left, top } = dotEl.getBoundingClientRect();

    // let left = rects.left;
    // let top = rects.top;
    dotEl.style.left = left + (x - left - dotRadius * 0.5) / lag + 'px';
    dotEl.style.top = top + (y - top - dotRadius * 0.5) / lag + 'px';
    // console.log(x, y, l-dotRadius*0.5eft, top);
  };

  function clipMask() {
    // console.log('message')

    let { left, top } = dotEl.getBoundingClientRect();

    let { left: tsabudhLeft, top: tsabudhTop } =
      tsabudh.getBoundingClientRect();

    let { left: tLeft, top: tTop } = tsabudh
      .getElementsByClassName('red')[0]
      .getBoundingClientRect();
    let { left: nameLeft, top: nameTop } = tsabudh
      .getElementsByClassName('name')[0]
      .getBoundingClientRect();

    // console.log(left, tsabudhLeft, cursor.x);
    // tsabudh.style.setProperty('--clip-position', `50% 50%`);
    rootEL.style.setProperty(
      '--clip-position-t',
      `${left + dotRadius * 0.5 - tLeft}px ${top + dotRadius * 0.5 - tTop}px`
    );
    rootEL.style.setProperty(
      '--clip-position-sabudh',
      `${left + dotRadius * 0.5 - nameLeft}px ${
        top + dotRadius * 0.5 - nameTop
      }px`
    );

    rootEL.style.setProperty('--clip-size', `${dotRadius * 0.5}px`);
  }

  function checkCursorType() {
    console.log(document.elementFromPoint(cursor.x, cursor.y));
  }

  function loop() {
    moveTowards(cursor.x, cursor.y);
    animationFrame = requestAnimationFrame(loop);
    isHoveringOverName == 1
      ? clipMask()
      : rootEL.style.setProperty('--clip-size', `0`);
  }

  // resizeDot = function (e) {
  //   isHoveringOverName = 1;
  //   dotSizeFactor = 1.5;

  //   dotEl.style.width = dotRadius * dotSizeFactor + 'px';
  //   dotEl.style.height = dotRadius * dotSizeFactor + 'px';
  // };
  init();
}

if (deviceCode >= 3)
  window.addEventListener('load', event => {
    new followingDotCursor({ element: document.body });
  });

tsabudh.addEventListener('mouseleave', e => {});
