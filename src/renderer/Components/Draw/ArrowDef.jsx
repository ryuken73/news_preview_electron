import React from 'react';
// import useConfigState from 'renderer/hooks/useConfigState';


const ArrowDef = (props) => {
  // eslint-disable-next-line react/prop-types, @typescript-eslint/no-unused-vars
  // const { config } = useConfigState();
  const { id, size, isFilled, fill, stroke, strokeWidth } = props;
  // const { arrowShape } = config;
  const arrowShape = 'normal';

  // eslint-disable-next-line no-nested-ternary
  const arrowStrokeSize = size > 30 ? 0.3 : size > 18 ? 0.4 : size > 12 ? 0.7 : 0.9;
  // const arrowStrokeSize = 0.5
  // eslint-disable-next-line no-nested-ternary
  // const markerWidth = size === 6 ? "15" : size === 12 ? "14" : size === 18 ? "12" : "12";
  const markerWidth = size > 30 ? "12" : size > 18 ? "12" : size > 12 ? "12" : "12"
  const refX = size > 30 ? "1.0" : size > 18 ? "0.6 ": size > 12 ? "0.6" : "0.2";
  const arrowNormal = "0.5 0.5, 11 4, 0.5 7.5";
  const arrowSharp = "0.5 0.5, 11 4, 0.5 7.5, 2, 4";
  return (
    <defs>
      <marker
        id={id}
        markerWidth={markerWidth}
        markerHeight="8"
        refX={refX}
        refY="4"
        orient="auto"
      >
        <polygon
          fill={isFilled ? fill : 'red'}
          stroke={stroke}
          strokeWidth={strokeWidth > 0 ? arrowStrokeSize : 0}
          // points={`0 0, ${markerWidth} 4, 0 8, 2 4`}
          points={arrowShape === 'normal' ? arrowNormal:arrowSharp}
          // points={ArrowNormal}
        />
      </marker>
    </defs>
  )
}

export default React.memo(ArrowDef);
