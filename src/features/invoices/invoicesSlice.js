import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import data from "../../data.json";

const initialState = {
  data: data,
};

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addInvoice: (state, action) => {
      //  generate id here
      state.data.push(action.payload);
    },
    removeInvoice: (state, action) => {
      state.data = state.data.filter(
        (invoice) => invoice.id !== action.payload
      );
    },
    updateInvoice: (state, action) => {
      state.data = state.data.filter(
        (invoice) => invoice.id !== action.payload
      );
      state.data.push(action.payload);
    },
    markAsPaid: (state, action) => {
      let invoice1 = state.data.find(
        (invoice) => invoice.id === action.payload
      );
      invoice1.status = "paid";
      invoice1 = state.data.find((invoice) => invoice.id === action.payload);
      // invoice = { ...invoice, status: "paid" };
      console.log(JSON.parse(JSON.stringify(invoice1)));
      // state.data = state.data.filter(
      //   (invoice) => invoice.id !== action.payload
      // );
      // state.data.push(invoice);

      // state.data = state.data.filter(
      //   (invoice) => invoice.id !== action.payload
      // );
      // state.data.push(invoice);
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = "idle";
  //       state.value += action.payload;
  //     });
  // },
});

export const { addInvoice, removeInvoice, updateInvoice, markAsPaid } =
  invoicesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state) => state.counter.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     // dispatch(incrementByAmount(amount));
//   }
// };

export const selectInvoices = (state) => state.invoices.data;

export default invoicesSlice.reducer;
