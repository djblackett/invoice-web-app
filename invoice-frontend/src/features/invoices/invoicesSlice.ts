// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import WritableDraft from "immer";
// import { v4 as uuidv4 } from "uuid";
// import { Invoice, Item, ReduxInvoiceState } from "../../types/types";
// import data from "../../data.json";

// const initialState = { data: [...data] };

// export const invoicesSlice = createSlice({
//   name: "invoices",
//   initialState,
//   reducers: {
//     addInvoice: (state, action) => {
//       //  generate id here
//       state.data.push(action.payload);
//     },
//     removeInvoice: (state, action) => {
//       state.data = state.data.filter(
//         (invoice) => invoice.id !== action.payload,
//       );
//     },
//     updateInvoice: (state, action: PayloadAction<Invoice>) => {
//       // console.log("entered updateInvoice");
//       const oldInvoice: Invoice | undefined = state.data.find(
//         (invoice: Invoice) => invoice.id === action.payload.id,
//       );

//       if (oldInvoice) {
//         const index = state.data.indexOf(oldInvoice);
//         state.data.splice(index, 1, action.payload);
//         // console.log("invoice updated");
//       }
//     },
//     markAsPaid: (state, action) => {
//       const invoice1 = state.data.find(
//         (invoice) => invoice.id === action.payload,
//       );
//       if (invoice1) {
//         invoice1.status = "paid";
//       }
//     },
//     markAsPending: (state, action) => {
//       const invoice1 = state.data.find(
//         (invoice) => invoice.id === action.payload,
//       );
//       if (invoice1) {
//         invoice1.status = "pending";
//       }
//     },
//     addItem: (state, action) => {
//       const { id, newItem } = action.payload;
//       const invoice = state.data.find((element) => element.id === id);
//       if (invoice) {
//         invoice.items.push(newItem);
//       }
//     },
//     addIdToExistingInvoices: (state) => {
//       // eslint-disable-next-line no-restricted-syntax
//       for (const i of state.data) {
//         let item: WritableDraft<Item>;
//         // eslint-disable-next-line no-restricted-syntax
//         for (item of i.items) {
//           if (!item.id) {
//             item.id = uuidv4();
//           }
//         }
//       }
//     },
//     clearInvoices: (state) => {
//       state.data = [];
//     },
//   },
// });

// export const {
//   addInvoice,
//   removeInvoice,
//   updateInvoice,
//   markAsPaid,
//   addItem,
//   addIdToExistingInvoices,
//   clearInvoices,
// } = invoicesSlice.actions;

// export const selectInvoices = (state: ReduxInvoiceState) => state.invoices.data;
// export const selectInvoiceById = (
//   state: ReduxInvoiceState,
//   id: string | undefined,
// ) => state.invoices.data.find((item) => id === item.id);

// export default invoicesSlice.reducer;
