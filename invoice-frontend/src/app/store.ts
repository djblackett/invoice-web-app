import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../features/invoices/store/filterSlice.ts";

const store = configureStore({
  reducer: {
    filter: filterReducer,
  },
});

export default store;
