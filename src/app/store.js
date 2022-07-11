import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import invoicesReducer from "../features/invoices/invoicesSlice";
import filterReducer from "../features/invoices/filterSlice";
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    invoices: invoicesReducer,
    filter: filterReducer,
  },
});
