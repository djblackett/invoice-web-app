import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Filter, StatusKey} from "../../types/types";


const initialState: Filter = {
  filter: { draft: false, paid: false, pending: false },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    changeFilter: (state, action: PayloadAction<StatusKey>) => {
      const status = action.payload;
      state.filter[status] = !state.filter[status] ;
    },
  },
});

export const { changeFilter } = filterSlice.actions;
export const selectFilter = (state: { filter: Filter }) => state.filter.filter;

export default filterSlice.reducer;
