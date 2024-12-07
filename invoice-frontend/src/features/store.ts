import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./invoices/filterSlice";

const store = configureStore({
  reducer: {
    filter: filterReducer,
  },
});

export default store;
