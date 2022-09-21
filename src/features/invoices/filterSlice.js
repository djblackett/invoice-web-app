import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  filter: { draft: false, paid: false, pending: false },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    changeFilter: (state, action) => {
      state.filter[action.payload] = !state.filter[action.payload];
    },
  },
});

export const { changeFilter } = filterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.filter.value)`

export const selectFilter = (state) => state.filter.filter;

export default filterSlice.reducer;
