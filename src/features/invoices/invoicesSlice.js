import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import data from "../../data.json";

const initialState = {
  data: data,
};

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
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
      const oldInvoice = state.data.find(
        (invoice) => invoice.id === action.payload.id
      );

      const index = state.data.indexOf(oldInvoice);
      state.data.splice(index, 1, action.payload);
    },
    markAsPaid: (state, action) => {
      let invoice1 = state.data.find(
        (invoice) => invoice.id === action.payload
      );
      invoice1.status = "paid";
    },
    markAsPending: (state, action) => {
      let invoice1 = state.data.find(
        (invoice) => invoice.id === action.payload
      );
      invoice1.status = "pending";
    },
    addItem: (state, action) => {
      const { id, newItem } = action.payload;
      const invoice = state.data.find((invoice) => invoice.id === id);
      invoice.items.push(newItem);
    },
    addIdToExistingInvoices: (state, action) => {
      for (let i of state.data) {
        // console.log(i);
        for (let item of i.items) {
          if (!item.id) {
            item["id"] = uuidv4();
          }
        }
      }
    },
    clearInvoices: (state, action) => {
      state.data = [];
    },
  },

});

export const {
  addInvoice,
  removeInvoice,
  updateInvoice,
  markAsPaid,
  addItem,
  addIdToExistingInvoices,
  clearInvoices,
} = invoicesSlice.actions;

export const selectInvoices = (state) => state.invoices.data;
export const selectInvoiceById = (state, id) => {
  // console.log(state);
  // console.log(state.data);
  // console.log(state.invoices);
  return state.invoices.data.find(item => id === item.id);
};


export default invoicesSlice.reducer;
