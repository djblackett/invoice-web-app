import { configureStore } from "@reduxjs/toolkit";
import invoicesReducer from "../features/invoices/invoicesSlice";
import filterReducer from "../features/invoices/filterSlice";
export const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
    filter: filterReducer,
  },
});

