import { createSlice } from '@reduxjs/toolkit';

const INITIAL_FILL_COLOR = 'red';
const STROKE_COLOR = {
  red: 'black',
  darkblue: 'white',
  black: 'white',
  yellow: 'black',
};

const initialState = {
  drawShow: false,
  pathDatum: [],
  pointDatum: [],
  pathRenderOptions: [],
  strokeWidthFromConfig: 3,
  currentOptions: {
    size: 12,
    strokeWidth: 3,
    thinning: 0.75,
    streamline: 0.5,
    smoothing: 0.5,
    easing: 'linear',
    taperStart: 0,
    taperEnd: 0,
    capStart: true,
    capEnd: true,
    easingStart: 'linear',
    easingEnd: 'linear',
    isFilled: true,
    stroke: STROKE_COLOR[INITIAL_FILL_COLOR],
    fill: INITIAL_FILL_COLOR,
    withArrow: false
  },
  // fillWidth: 14,
  // fillColor: INITIAL_FILL_COLOR,
  // showBorder: false,
  // borderWidth: 3,
  // borderColor: BORDER_COLOR[INITIAL_FILL_COLOR]
};

export const drawSlice = createSlice({
  name: 'drawSlice',
  initialState,
  reducers: {
    setDrawShow: (state, action) => {
      const { payload } = action;
      const { drawShow } = payload;
      state.drawShow = drawShow;
    },
    setPathDatum: (state, action) => {
      const { payload } = action;
      const { pathDatum } = payload;
      state.pathDatum = pathDatum;
    },
    setPointDatum: (state, action) => {
      const { payload } = action;
      const { pointDatum } = payload;
      state.pointDatum = pointDatum;
    },
    setPathRenderOptions: (state, action) => {
      const { payload } = action;
      const { pathRenderOptions } = payload;
      state.pathRenderOptions = pathRenderOptions;
    },
    saveRenderOption: (state) => {
      const { currentOptions } = state;
      state.pathRenderOptions.push(currentOptions);
    },
    setStrokeWidthFromConfig: (state, action) => {
      const { payload } = action;
      const { strokeWidthFromConfig } = payload;
      state.strokeWidthFromConfig = strokeWidthFromConfig;
    },
    setCurrentOptionValue: (state, action) => {
      const { payload } = action;
      const { key, value } = payload;
      state.currentOptions[key] = value;
    },
  },
});

export const {
  setDrawShow,
  setPathDatum,
  setPointDatum,
  setPathRenderOptions,
  saveRenderOption,
  setCurrentOptionValue,
  setStrokeWidthFromConfig
} = drawSlice.actions;

export default drawSlice.reducer;
