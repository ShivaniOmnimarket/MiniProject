// frontend/store/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import thunk from 'redux-thunk';

const initialState = {
  data: [],
  symbol: 'GOOG',
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
    setSymbol(state, action) {
      state.symbol = action.payload;
    },
  },
});

export const { setData, setSymbol } = stockSlice.actions;

const makeStore = () =>
  configureStore({
    reducer: {
      stocks: stockSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);
