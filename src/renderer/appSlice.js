import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  drawShow: false,
};

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setDrawShow: (state, action) => {
      const { payload } = action;
      const { drawShow } = payload;
      state.drawShow = drawShow;
    },
  },
})

export const { setDrawShow } = appSlice.actions;

export default appSlice.reducer;
