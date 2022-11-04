import { configureStore } from '@reduxjs/toolkit';
import stationsReducer from './stationsSlice';
import projectReducer from "./projectSlice";

export const store = configureStore({
  reducer: {
    stations: stationsReducer,
    project: projectReducer
  },
})