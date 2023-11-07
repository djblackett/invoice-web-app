import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Invoice, SenderAddress, ClientAddress, Item, ReduxInvoiceState} from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import data from "../../data.json";
import {WritableDraft} from "immer/dist/types/types-external";

const initialState = { data: [...data] };

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
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const oldInvoice: Invoice | undefined = state.data.find(
        (invoice: Invoice) => invoice.id === action.payload.id
      );

      if (oldInvoice) {
        const index = state.data.indexOf(oldInvoice);
        state.data.splice(index, 1, action.payload);
      }},
    markAsPaid: (state, action) => {
      let invoice1 = state.data.find(
        (invoice) => invoice.id === action.payload
      );
      if (invoice1) {
      invoice1.status = "paid";
    }},
    markAsPending: (state, action) => {
      let invoice1 = state.data.find(
        (invoice) => invoice.id === action.payload
      );
      if (invoice1) {
        invoice1.status = "pending";
      }},
    addItem: (state, action) => {
      const { id, newItem } = action.payload;
      const invoice = state.data.find((invoice) => invoice.id === id);
      if (invoice) {
      invoice.items.push(newItem);
    }},
    addIdToExistingInvoices: (state) => {
      for (let i of state.data) {
        let item: WritableDraft<Item>;
        for (item of i.items) {
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

export const selectInvoices = (state: ReduxInvoiceState) => state.invoices.data;
export const selectInvoiceById = (state: ReduxInvoiceState, id: string | undefined) => {
  return state.invoices.data.find(item => id === item.id);
};


export default invoicesSlice.reducer;
