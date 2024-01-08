'use strict';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Advert } from '../util/types';
import axios from 'axios';
import { LatLngBounds } from 'leaflet';

const BASE_URL = 'https://luxequality-test-api-docker.onrender.com';

type initialType = {
	data: Advert[];
  advertLoadingStatus: 'idle' | 'loading' | 'error';
	type: 'all' | 'one';
	bounds: LatLngBounds | null;
};

const initialState: initialType = {
  data: [],
  advertLoadingStatus: 'loading',
  type: 'all',
  bounds: null,
};

export const fetchAdverts = createAsyncThunk(
  'fetchProductDetail',
  async (id: string | undefined) => {
    if (id) {
      const response = await axios.get(
        `${BASE_URL}/advertisement/geById/${id}`,
      );
      return response.data;
    }
    const response = await axios.get(
      `${BASE_URL}/advertisement/all`,
    );
    return response.data;
  },
);

export const advertSlice = createSlice({
  name: 'adverts',
  initialState,
  reducers: {
    addAdvert: (state, action: PayloadAction<Advert>) => {
      state.data.push(action.payload);
    },
    changeType: (state, action: PayloadAction<'all' | 'one'>) => {
      state.type = action.payload;
    },
    setUpBounds: (state, action: PayloadAction<LatLngBounds>) => {
      state.bounds = action.payload;
    },
    deteleAdvert: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(elem => elem.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdverts.pending, (state) => {
        state.advertLoadingStatus = 'loading';
      })
      .addCase(fetchAdverts.fulfilled, (state, action) => {
        state.advertLoadingStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(fetchAdverts.rejected, (state) => {
        state.advertLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  },
});

export const { changeType, setUpBounds } = advertSlice.actions;

export const selectAdverts = (state: RootState) => state.adverts.data;
export const selectAdvertsType = (state: RootState) => state.adverts.type;
export const selectAdvertsLoadingStatus = (state: RootState) => state.adverts.advertLoadingStatus;

export const selectAdvertsWithBounds = (state: RootState) => {
  if (!state.adverts.bounds) {
    return state.adverts.data;
  }

  const maxLat = state.adverts.bounds.getNorthEast().lat;
  const maxLng = state.adverts.bounds.getNorthEast().lng;
  const minLat = state.adverts.bounds.getSouthWest().lat;
  const minLng = state.adverts.bounds.getSouthWest().lng;

  const filtered = state.adverts.data.filter(elem => {
    const elemCoords = {
      lat: JSON.parse(elem.coords)[0],
      lng: JSON.parse(elem.coords)[1],
    };
    if ((elemCoords.lat <= maxLat && elemCoords.lat >= minLat) && elemCoords.lng <= maxLng && elemCoords.lng >= minLng)
      return elem;
  });

  return filtered;
};
export default advertSlice.reducer;
