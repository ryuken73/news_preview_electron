import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setPathDatum,
  setPointDatum,
  setPathRenderOptions,
  saveRenderOption,
  setCurrentOptionValue,
  setStrokeWidthFromConfig
} from 'renderer/Components/Draw/drawSlice';
import { getSmoothLine } from '../lib/appUtil';

const STROKE_COLOR = {
  red: 'black',
  darkblue: 'white',
  black: 'white',
  yellow: 'black',
};

export default function useDrawState() {
  const dispatch = useDispatch();
  const pathDatum = useSelector((state) => state.draw.pathDatum);
  const pointDatum = useSelector((state) => state.draw.pointDatum);
  const strokeWidthFromConfig = useSelector(
    (state) => state.draw.strokeWidthFromConfig
  );
  const currentOptions = useSelector((state) => state.draw.currentOptions);
  const pathRenderOptions = useSelector(
    (state) => state.draw.pathRenderOptions
  );

  const addPathDatumState = React.useCallback((newPathData) => {
    dispatch(setPathDatum({ pathDatum: [...pathDatum, newPathData] }));
    },
    [dispatch, pathDatum]
  );
  const addPointDatumState = React.useCallback((newPoints) => {
    dispatch(setPointDatum({ pointDatum: [...pointDatum, newPoints] }));
    },
    [dispatch, pointDatum]
  );

  const clearPathDatumState = React.useCallback(() => {
    dispatch(setPathDatum({ pathDatum: [] }));
    dispatch(setPointDatum({ pointDatum: [] }));
    dispatch(setPathRenderOptions({ pathRenderOptions: [] }));
  }, [dispatch]);

  const undoPathDatumState = React.useCallback(() => {
    dispatch(
      setPathDatum({ pathDatum: pathDatum.slice(0, pathDatum.length - 1) })
    );
    dispatch(
      setPointDatum({ pointDatum: pointDatum.slice(0, pointDatum.length - 1) })
    );
    dispatch(
      setPathRenderOptions({
        pathRenderOptions: pathRenderOptions.slice(
          0,
          pathRenderOptions.length - 1
        ),
      })
    );
  }, [dispatch, pathDatum, pathRenderOptions, pointDatum]);

  const saveRenderOptionState = React.useCallback(() => {
    dispatch(saveRenderOption());
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const setStrokeWidthFromConfigState = React.useCallback((strokeWidthFromConfig) => {
      dispatch(setStrokeWidthFromConfig({ strokeWidthFromConfig }));
      dispatch(
        setCurrentOptionValue({
          key: 'strokeWidth',
          value: strokeWidthFromConfig,
        })
      );
    },
    [dispatch]
  );

  const changePathOptionState = React.useCallback((key, value) => {
    dispatch(setCurrentOptionValue({ key, value }));
    },
    [dispatch]
  );

  const getPositionForArrow = React.useCallback((dataIndex) => {
    const points = pointDatum[dataIndex];
    const [[x0, y0], [x1, y1]] = getSmoothLine(points, 3);
    return [x0, y0, x1, y1];
    },
    [pointDatum]
  );

  return {
    pathDatum,
    pointDatum,
    currentOptions,
    pathRenderOptions,
    strokeWidthFromConfig,
    addPathDatumState,
    addPointDatumState,
    clearPathDatumState,
    undoPathDatumState,
    saveRenderOptionState,
    changePathOptionState,
    getPositionForArrow,
    setStrokeWidthFromConfigState
  };
}
