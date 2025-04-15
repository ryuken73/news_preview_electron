import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDrawShow } from '../appSlice';
import useDrawState from './useDrawState';

export default function useAppState() {
  const dispatch = useDispatch();
  const homeShow = useSelector((state) => state.app.homeShow);
  const drawShow = useSelector((state) => state.app.drawShow);
  const draggableDock = useSelector((state) => state.app.draggableDock);
  const dockWidth = useSelector((state) => state.app.dockWidth);
  const useSrcLocal = useSelector((state) => state.app.useSrcLocal);
  const showTransition = useSelector((state) => state.app.showTransition);
  const googlePositionSetter = useSelector(
    (state) => state.app.googlePositionSetter
  );
  const { clearPathDatumState } = useDrawState();

  const toggleDraw = React.useCallback(() => {
    dispatch(setDrawShow({ drawShow: !drawShow }));
    clearPathDatumState();
  }, [clearPathDatumState, dispatch, drawShow]);

  return {
    homeShow,
    drawShow,
    useSrcLocal,
    draggableDock,
    dockWidth,
    showTransition,
    googlePositionSetter,
    toggleDraw,
  };
}
