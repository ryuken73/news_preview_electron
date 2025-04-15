import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from 'redux-logger';
// import audioPlayerSlice from 'Components/Players/audioPlayerSlice'
import appSlice from './appSlice'
import drawSlice from './Components/Draw/drawSlice';
// import apiSlice from './slices/apiSlice';
// import cacheSlice from "./slices/cacheSlice";
// import playControlSlice from "./slices/playControlSlice";
import CONSTANTS from './config/constants';

const { LOGLESS_REDUX_ACTIONS = [] } = CONSTANTS;

const logger = createLogger({
  predicate: (getState, action) => !LOGLESS_REDUX_ACTIONS.includes(action.type),
});

export const store = configureStore({
  reducer: {
    app: appSlice,
    draw: drawSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production'
})