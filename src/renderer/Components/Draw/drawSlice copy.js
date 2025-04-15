import { createSlice } from '@reduxjs/toolkit';

const INITIAL_FILL_COLOR = 'red';
const BORDER_COLOR = {
  red: 'black',
  darkblue: 'white',
  black: 'white',
  yellow: 'black',
};

const initialState = {
  drawShow: false,
  pathDatum: [],
  pathRenderOptions: [],
  fillWidth: 14,
  fillColor: INITIAL_FILL_COLOR,
  showBorder: false,
  borderWidth: 3,
  borderColor: BORDER_COLOR[INITIAL_FILL_COLOR]
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
    setPathRenderOptions: (state, action) => {
      const { payload } = action;
      const { pathRenderOptions } = payload;
      state.pathRenderOptions = pathRenderOptions;
    },
    saveRenderOption: (state) => {
      const { fillWidth, fillColor, showBorder, borderWidth, borderColor } = state;
      const currentOption = {
        fillWidth,
        fillColor,
        showBorder,
        borderWidth,
        borderColor,
      };
      state.pathRenderOptions = [...state.pathRenderOptions, currentOption];
    },
    setFillColor: (state, action) => {
      const { payload } = action;
      const { fillColor } = payload;
      state.fillColor = fillColor;
    },
    setFillWidth: (state, action) => {
      const { payload } = action;
      const { fillWidth } = payload;
      state.fillWidth = fillWidth;
    },
    setShowBorder: (state, action) => {
      const { payload } = action;
      const { showBorder } = payload;
      state.showBorder = showBorder;
    },
    setBorderColor: (state, action) => {
      const { payload } = action;
      const { fillColor } = payload;
      state.borderColor = BORDER_COLOR[fillColor];
    },
    setBorderWidth: (state, action) => {
      const { payload } = action;
      const { borderWidth } = payload;
      state.borderWidth = borderWidth;
    },
  },
});

export const {
  setDrawShow,
  setPathDatum,
  setFillColor,
  setFillWidth,
  setShowBorder,
  setBorderColor,
  setBorderWidth,
  setPathRenderOptions,
  saveRenderOption
} = drawSlice.actions;

export default drawSlice.reducer;
