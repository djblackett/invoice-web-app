import { configureStore } from "@reduxjs/toolkit";
import invoicesReducer from "./invoices/invoicesSlice";
import filterReducer from "./invoices/filterSlice";

const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
    filter: filterReducer,
  },
});

export default store;
