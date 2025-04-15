// const { constants } = require('renderer/config/constants');
import  constants from 'renderer/config/constants';

const arrayBitWiseSum = (arrayParent) => {
  return arrayParent.reduce((acct, arrayChild) => {
    return arrayChild.map((value, childIndex) => {
      return value + (acct[childIndex] === undefined ? 0 : acct[childIndex]);
    });
  }, []);
};

const arrayBitWiseAvg = (arrayParent) => {
  const { length } = arrayParent;
  const sumArray = arrayBitWiseSum(arrayParent);
  return sumArray.map((value) => value / length);
};

const pickArrayFraction = (array, from, to) => {
  return array.slice(from, to + 1);
};

export const getSmoothLine = (positions, level = 5) => {
  const fractions = positions.slice(level * 2 * -1);
  // console.log(fractions)
  const { length } = fractions;
  const fromLength = Math.ceil(length / 2);
  const fromPostions = pickArrayFraction(fractions, 0, fromLength - 1);
  const toPositions = pickArrayFraction(fractions, fromLength, length);
  return [arrayBitWiseAvg(fromPostions), arrayBitWiseAvg(toPositions)];
};


// Turn the points returned from perfect-freehand into SVG path data.
export const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
};
// easing functions
export const easingStrings = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeInExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) =>
    t <= 0
      ? 0
      : t >= 1
      ? 1
      : t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2,
};
