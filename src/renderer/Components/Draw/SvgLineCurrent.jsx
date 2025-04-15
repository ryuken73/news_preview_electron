import React from 'react';
import { getStroke } from 'perfect-freehand';
import {
  getSmoothLine,
  getSvgPathFromStroke,
  easingStrings,
} from 'renderer/lib/appUtil';
import useDrawState from 'renderer/hooks/useDrawState';
import ArrowDef from './ArrowDef';

function SvgLineCurrent(props) {
  // eslint-disable-next-line react/prop-types
  const { mouseUp, points, pathData } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentOptions, changePathOptionState } = useDrawState();

  const {
    size,
    strokeWidth,
    thinning,
    streamline,
    smoothing,
    easing,
    taperStart,
    taperEnd,
    capStart,
    capEnd,
    easingStart,
    easingEnd,
    isFilled,
    stroke,
    fill,
    withArrow
  } = currentOptions;

  const options = {
    size,
    thinning: withArrow ? 0 : thinning,
    smoothing,
    streamline,
    easing: easingStrings[easing],
    start: {
      taper: taperStart,
      easing: easingStrings[easingStart],
      cap: capStart,
    },
    end: {
      taper: taperEnd,
      easing: easingStrings[easingEnd],
      cap: withArrow ? capEnd : capEnd,
    },
    simulatePressur: false
  };

  const outlinePoints = getStroke(points, options);
  pathData.current = getSvgPathFromStroke(outlinePoints);
  const [[x0, y0], [x1, y1]] = getSmoothLine(points, 3);

  return (
    <>
      {points && !mouseUp && strokeWidth ? (
        <path
          d={pathData.current}
          fill="transparent"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          pointerEvents="all"
        />
      ) : null}
      {!mouseUp && withArrow && (
        <>
          <ArrowDef
            id="arrowHeadCurrent"
            size={size}
            isFilled={isFilled}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <line
            x1={x0}
            y1={y0}
            x2={x1}
            y2={y1}
            stroke={0}
            strokeWidth={size * 0.4}
            markerEnd="url(#arrowHeadCurrent)"
          />
          <use href="#arrowHeadCurrent" />
        </>
      )}
      {points && !mouseUp && (
        <path
          d={pathData.current}
          fill={isFilled ? fill : 'transparent'}
          stroke={isFilled || strokeWidth > 0 ? 'transparent' : 'black'}
          strokeWidth={isFilled || strokeWidth > 0 ? 0 : 1}
          strokeLinejoin="round"
          strokeLinecap="round"
          pointerEvents="all"
        />
      )}
    </>
  )
}

export default React.memo(SvgLineCurrent)
