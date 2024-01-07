'use strict';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { LatLng } from 'leaflet';

type initialType = {
	data: LatLng[];
};

const initialState: initialType = {
  data: [],
};

export const coordsSlice = createSlice({
  name: 'coords',
  initialState,
  reducers: {
    addCoords: (state, action: PayloadAction<LatLng[]>) => {
      state.data = action.payload;
    },
    deteleACoords: (state) => {
      state.data = [];
    },
  },
});

export const { addCoords, deteleACoords} = coordsSlice.actions;

export const selectCoords = (state: RootState) => state.coords.data;

export default coordsSlice.reducer;
