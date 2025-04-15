import React from 'react';
import useDrawState from 'renderer/hooks/useDrawState';
import ArrowDef from './ArrowDef';

function SvgLine(props) {
  // eslint-disable-next-line react/prop-types
  const { pathData, pathRenderOptions, index } = props;
  const { getPositionForArrow } = useDrawState();
  return (
    <>
      {pathRenderOptions[index].strokeWidth && (
        <path
          d={pathData}
          fill="transparent"
          stroke={pathRenderOptions[index].stroke}
          strokeWidth={pathRenderOptions[index].strokeWidth}
          strokeLinejoin="bevel"
          strokeLinecap="bevel"
          pointerEvents="all"
        />
      )}
      {pathRenderOptions[index].withArrow && (
        <>
          <ArrowDef
            id={`arrowhead-${index}`}
            size={pathRenderOptions[index].size}
            isFilled={pathRenderOptions[index].isFilled}
            fill={pathRenderOptions[index].fill}
            stroke={pathRenderOptions[index].stroke}
            strokeWidth={pathRenderOptions[index].strokeWidth}
            />
          <line
            x1={getPositionForArrow(index)[0]}
            y1={getPositionForArrow(index)[1]}
            x2={getPositionForArrow(index)[2]}
            y2={getPositionForArrow(index)[3]}
            stroke={0}
            strokeWidth={pathRenderOptions[index].size * 0.4}
            markerEnd={`url(#arrowhead-${index})`}
          />
        </>
      )}
      <path
        d={pathData}
        fill={
          pathRenderOptions[index].isFilled
            ? pathRenderOptions[index].fill
            : 'transparent'
        }
        stroke={
          pathRenderOptions[index].isFilled ||
          pathRenderOptions[index].strokeWidth > 0
            ? 'transparent'
            : 'black'
        }
        strokeWidth={
          pathRenderOptions[index].isFilled ||
          pathRenderOptions[index].strokeWidth > 0
            ? 0
            : 1
        }
        strokeLinejoin="round"
        strokeLinecap="round"
        pointerEvents="all"
      />
    </>
  )
}

export default React.memo(SvgLine);
