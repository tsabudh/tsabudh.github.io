// Declaring global variables

function clockCursor(options) {
  let hasWrapperEl = options && options.element;
  let element = hasWrapperEl || document.body;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: height / 2 }; // initializing cursor position as center
  let canvas, context, animationFrame;
  let delay = 0.4; //* delay to animate characters following cursor position
  // Initializing constants

  // color passed in options initialized as string color

  const dateColor = (options && options.dateColor) || 'blue';
  const faceColor = (options && options.faceColor) || 'blue';
  const secondsColor = (options && options.secondsColor) || 'red';
  const minutesColor = (options && options.minutesColor) || 'green';
  const hoursColor = (options && options.hoursColor) || 'blue';

  let dateString = new Date().toDateString();
  console.log(dateString);

  //* clock starts from 3 because x axis is taken for reference of angle for 0 degree
  // clock face numbers
  const clockFace = [
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '1',
    '2',
  ];
  const hourHandString = '•••';
  const minuteHandString = '••••';
  const secondHandString = '•••••';

  const clockFaceLength = clockFace.length;
  const sizeOfClock = 45;
  const handSize = sizeOfClock / 6.5;
  const unitCharacterSpaceOfClockFace = 360 / clockFaceLength;
  const unitCharacterSpaceOfDateString = 360 / dateString.length;

  //For properties of each character in different strings
  const charactersOfSecondHandString = [];
  const charactersOfMinuteHandString = [];
  const charactersOfHourHandString = [];
  const charactersOfDateString = [];
  const charactersOfClockFace = [];

  // For position z and difference d of each character kept in array
  const dy = [];
  const dx = [];
  const zy = [];
  const zx = [];

  // sumStringLength is summation of total length of each string
  const sumStringLength = parseInt(
    dateString.length +
      clockFaceLength +
      hourHandString.length +
      minuteHandString.length +
      secondHandString.length// +10
      
  );
  console.log(sumStringLength);

  function init() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');

    canvas.style.top = '0rem';
    canvas.style.left = '0rem';
    canvas.style.pointerEvents = 'none';
    canvas.style.border = '1px solid blue ';

    if (hasWrapperEl) {
      canvas.style.position = 'absolute';
      element.appendChild(canvas);
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.style.position = 'fixed';
      document.body.appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
    }

    context.font = 'Roboto';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // For initializing position and difference of each character  in an array
    for (let i = 0; i < sumStringLength; i++) {
      dy[i] = 0;
      dx[i] = 0;
      zy[i] = 0;
      zx[i] = 0;
    }

    // Defining properties for each characters in dateString
    for (let i = 0; i < dateString.length; i++) {
      charactersOfDateString[i] = {
        color: dateColor,
        value: dateString[i],
      };

      // Defining properties of each characters in clockFaceNumbers
      for (let i = 0; i < clockFace.length; i++) {
        charactersOfClockFace[i] = {
          color: faceColor,
          value: clockFace[i],
        };
      }

      // Defining properties of each character in hourHandString
      for (let i = 0; i < hourHandString.length; i++) {
        charactersOfHourHandString[i] = {
          color: hoursColor,
          value: hourHandString[i],
        };
      }

      // Defining properties of each character of minuteHandString
      for (let i = 0; i < minuteHandString.length; i++) {
        charactersOfMinuteHandString[i] = {
          color: minutesColor,
          value: minuteHandString[i],
        };
      }

      // Defining properties of each character of secondHandString
      for (let i = 0; i < secondHandString.length; i++) {
        charactersOfSecondHandString[i] = {
          color: secondsColor,
          value: secondHandString[i],
        };
      }
    }

    bindEvents();
    loop();
  }
  function bindEvents() {
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('resize', onWindowResizeOfClock);
  }
  function onWindowResizeOfClock(e) {
    width = window.innerWidth;
    height = window.innerHeight;

    if (hasWrapperEl) {
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      if (hasWrapperEl) {
        const boundingRect = element.getBoundingClientRect();
        cursor.x = e.touches[0].clientX - boundingRect.left;
        cursor.y = e.touches[0].clientY - boundingRect.top;
      } else {
        cursor.x = e.touches[0].clientX;
        cursor.y = e.touches[0].clientY;
      }
    }
  }

  function onMouseMove(e) {
    if (hasWrapperEl) {
      const boundingRect = element.getBoundingClientRect();
      cursor.x = e.clientX - boundingRect.left;
      cursor.y = e.clientY - boundingRect.top;
    } else {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    }
  }

  function updatePositions() {
    // Initialize position of first character of strings
    // based on the current cursor position and current character position
    // cursor.x -dx of first character
    // calculate the positions of second character based on the first character
    // third character based on second character and so on

    dy[0] = Math.trunc(dy[0] + (cursor.y - dy[0]) * delay);
    zy[0] = Math.round(dy[0]);

    dx[0] = Math.round(dx[0] + (cursor.x - dx[0]) * delay);
    zx[0] = Math.round(dx[0]);

    for (let i = 1; i < sumStringLength; i++) {
      // already calculated for i=0 ie: zx[0], zy[0]

      dy[i] = dy[i] + (zy[i - 1] - dy[i]) * delay;
      zy[i] = Math.round(dy[i]);

      dx[i] = dx[i] + (zx[i - 1] - dx[i]) * delay;
      zx[i] = Math.round(dx[i]);
    }
  }

  function updateParticles() {
    context.clearRect(0, 0, width, height);
    const time = new Date();
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    //* Angle in radians made by secondHand, minuteHand, hourHand with x axis
    // one second movement = 6 degrees, converting to radians
    // since we calculate angle with respect to x axis, we need to offset current
    // angle of hands with 90deg (ie: angle between x axis and y axis)
    // or we can decrease seconds, minutes by 15
    // (ie: 15 minutes/seconds makes second/minute hand lie  parallel to/in x-axis)
    // and hours by 3 (ie: 3 hr makes hand parallel to x axis)

    const radSecondHand = 6 * (seconds - 15) * (Math.PI / 180);
    const radMinuteHand = 6 * (minutes - 15) * (Math.PI / 180);

    // unit hour to degree plus minute degree to move further past that hour indicator
    const radHourHand =
      30 * (hours - 3) * (Math.PI / 180) + (Math.PI * parseInt(minutes)) / 360;

    // * Movement of outermost string ie: dateString around the clock per second
    //  'T h u r s d a y'
    //  '0 1 2 3 4 5 6 7' value of i =0 to i= 7 determines letter position offset  in thursday
    // i * eqd degrees is converted to radians by multiplying with PI/180
    // 1.5 is the factor for increasing radius to outside of clock
    // * dy = rSin(theta) and dx = rCos(theta)
    // radSecondHand is to provide movement in each second by offsetting by sec radians
    // -negative sign in radSecondHand is to provide movement in anticlockwise direction

    let radiusScalingFactor = 1.5;
    for (let i = 0; i < charactersOfDateString.length; i++) {
      charactersOfDateString[i].y =
        dy[i] +
        sizeOfClock *
          radiusScalingFactor *
          Math.sin(
            -radSecondHand +
              i * unitCharacterSpaceOfDateString * (Math.PI / 180)
          );

      charactersOfDateString[i].x =
        dx[i] +
        sizeOfClock *
          radiusScalingFactor *
          Math.cos(
            -radSecondHand +
              i * unitCharacterSpaceOfDateString * (Math.PI / 180)
          );

      context.fillStyle = charactersOfDateString[i].color;
      context.fillText(
        charactersOfDateString[i].value,
        charactersOfDateString[i].x,
        charactersOfDateString[i].y
      );
    }

    //* ClockFace
    // since clock faces are always static relative to center of clock "radSecondHand" is not needed
    // [charactersOfDateString.length + i] in dy[charactersOfDateString.length + i]is to make
    // charactersOfClockFace follow after the charactersOfDateString ends

    for (let i = 0; i < charactersOfClockFace.length; i++) {
      charactersOfClockFace[i].y =
        dy[charactersOfDateString.length + i] +
        sizeOfClock *
          Math.sin(i * unitCharacterSpaceOfClockFace * (Math.PI / 180));
      charactersOfClockFace[i].x =
        dx[charactersOfDateString.length + i] +
        sizeOfClock *
          Math.cos(i * unitCharacterSpaceOfClockFace * (Math.PI / 180));

      context.fillStyle = charactersOfClockFace[i].color;
      context.fillText(
        charactersOfClockFace[i].value,
        charactersOfClockFace[i].x,
        charactersOfClockFace[i].y
      );
    }

    // * Hour hand of clock
    for (let i = 0; i < charactersOfHourHandString.length; i++) {
      charactersOfHourHandString[i].y =
        dy[charactersOfDateString.length + clockFaceLength + i] +
        i * handSize * Math.sin(radHourHand);

      charactersOfHourHandString[i].x =
        dx[charactersOfDateString.length + clockFaceLength + i] +
        i * handSize * Math.cos(radHourHand);

      context.fillStyle = charactersOfHourHandString[i].color;
      context.fillText(
        charactersOfHourHandString[i].value,
        charactersOfHourHandString[i].x,
        charactersOfHourHandString[i].y
      );
    }

    // * Minute hand of clock
    for (let i = 0; i < charactersOfMinuteHandString.length; i++) {
      charactersOfMinuteHandString[i].y =
        dy[
          charactersOfDateString.length +
            clockFaceLength +
            charactersOfHourHandString.length +
            i
        ] +
        i * handSize * Math.sin(radMinuteHand);

      charactersOfMinuteHandString[i].x =
        dx[
          charactersOfDateString.length +
            clockFaceLength +
            charactersOfHourHandString.length +
            i
        ] +
        i * handSize * Math.cos(radMinuteHand);

      context.fillStyle = charactersOfMinuteHandString[i].color;
      context.fillText(
        charactersOfMinuteHandString[i].value,
        charactersOfMinuteHandString[i].x,
        charactersOfMinuteHandString[i].y
      );
    }

    // * Second Hand of clock
    for (let i = 0; i < charactersOfSecondHandString.length; i++) {
      charactersOfSecondHandString[i].y =
        dy[
          charactersOfDateString.length +
            clockFaceLength +
            charactersOfHourHandString.length +
            charactersOfMinuteHandString.length +
            i
        ] +
        i * handSize * Math.sin(radSecondHand);

      charactersOfSecondHandString[i].x =
        dx[charactersOfDateString.length + clockFaceLength + +i] +
        i * handSize * Math.cos(radSecondHand);

      context.fillStyle = charactersOfSecondHandString[i].color;

      context.fillText(
        charactersOfSecondHandString[i].value,
        charactersOfSecondHandString[i].x,
        charactersOfSecondHandString[i].y
      );
    }
  }

  function loop() {
    updatePositions();
    updateParticles();

    animationFrame = requestAnimationFrame(loop);
  }

  init();
}
// window.addEventListener('load', event => {
//   new clockCursor({ element: document.getElementById('cursorClock') });
// });
