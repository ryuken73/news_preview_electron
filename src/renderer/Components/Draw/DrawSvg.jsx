import * as React from 'react';
import styled from 'styled-components';
import useDrawState from 'renderer/hooks/useDrawState';
// import useConfigState from 'renderer/hooks/useConfigState';
import SvgLine from './SvgLine';
import SvgLineCurrent from './SvgLineCurrent';

const StyledSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100vh;
  opacity: ${(props) => (props.opacity === undefined ? 0.8 : props.opacity)};
  touch-action: none;
  z-index: 9999;
`;

const INITIAL_POSITIONS = [
  [-1000, -1000, 0.5],
  [-1001, -1001, 0.5],
];

const DrawSvg = () => {
  const {
    currentOptions,
    pathDatum,
    pathRenderOptions,
    strokeWidthFromConfig,
    addPathDatumState,
    addPointDatumState,
    saveRenderOptionState,
    changePathOptionState
  } = useDrawState();

  const [mouseUp, setMouseUP] = React.useState(false);
  const [points, setPoints] = React.useState([...INITIAL_POSITIONS]);

  // const { config } = useConfigState();
  // const { lineOpacity } = config;
  const lineOpacity = 0.8;

  const doubleTouched = React.useRef(false);
  const pathData = React.useRef([]);

  const { withArrow } = currentOptions;

  const toggleWithArrow = React.useCallback(() => {
    const nextValue = !withArrow;
    changePathOptionState('withArrow', nextValue);
    // if (nextValue === true) {
    //   changePathOptionState('strokeWidth', 0);
    // } else {
    //   changePathOptionState('strokeWidth', strokeWidthFromConfig);
    // }
  }, [changePathOptionState, withArrow]);

  const handlePointerDown = React.useCallback(
    (e) => {
    // if (e.isPrimary === false) return;
    if (e.isPrimary) {
      doubleTouched.current = false;
    }
    if (e.isPrimary === false) {
      doubleTouched.current = true;
      toggleWithArrow();
      setMouseUP(true);
      return;
    }
    e.target.setPointerCapture(e.pointerId);
    setMouseUP(false);
    setPoints([[e.pageX, e.pageY, e.pressure]]);
    },
    [toggleWithArrow]
  );

  const handlePointerMove = React.useCallback((e) => {
    if (e.buttons !== 1) return;
    if (e.isPrimary === false) return;
    if (doubleTouched.current) return;
    setPoints([...points, [e.pageX, e.pageY, e.pressure]]);
    },
    [points]
  );

  const handlePointerUp = React.useCallback((e) => {
    if (doubleTouched.current) return;
    setMouseUP(true);
    addPathDatumState(pathData.current);
    addPointDatumState(points);
    saveRenderOptionState();
    },
    [addPathDatumState, addPointDatumState, points, saveRenderOptionState]
  );


  return (
    <StyledSvg
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'none' }}
      opacity={lineOpacity}
    >
      {/* draw saved datum */}
      {pathDatum.map((savedData, index) => (
        <SvgLine
          pathData={savedData}
          pathRenderOptions={pathRenderOptions}
          index={index}
         />
      ))}
      {/* draw currnt point  */}
      <SvgLineCurrent mouseUp={mouseUp} points={points} pathData={pathData} />
    </StyledSvg>
  );
};

export default React.memo(DrawSvg);
