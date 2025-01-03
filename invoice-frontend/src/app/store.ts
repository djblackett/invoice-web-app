import { configureStore } from "@reduxjs/toolkit";
// import invoicesReducer from "../features/invoices/invoicesSlice";
import filterReducer from "../features/invoices/filterSlice";

const store = configureStore({
  reducer: {
    filter: filterReducer,
  },
});

export default store;
