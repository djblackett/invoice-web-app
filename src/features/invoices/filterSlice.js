import {createSlice } from "@reduxjs/toolkit";

const initialState = {
  filter: { draft: false, paid: false, pending: false },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    changeFilter: (state, action) => {
      state.filter[action.payload] = !state.filter[action.payload];
    },
  },
});

export const { changeFilter } = filterSlice.actions;
export const selectFilter = (state) => state.filter.filter;
export default filterSlice.reducer;
