import { combineReducers, configureStore } from '@reduxjs/toolkit';
import advertsSlice from './advertSlice';
import coordsSlice from './coordsSlice';

import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  adverts: advertsSlice,
  coords: coordsSlice,
});

export const store = configureStore({
  reducer: rootReducer,

  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
