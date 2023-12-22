"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectInvoiceById = exports.selectInvoices = exports.clearInvoices = exports.addIdToExistingInvoices = exports.addItem = exports.markAsPaid = exports.updateInvoice = exports.removeInvoice = exports.addInvoice = exports.invoicesSlice = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var uuid_1 = require("uuid");
var data_json_1 = require("../../data.json");
var initialState = { data: __spreadArray([], data_json_1.default, true) };
exports.invoicesSlice = (0, toolkit_1.createSlice)({
    name: "invoices",
    initialState: initialState,
    reducers: {
        addInvoice: function (state, action) {
            //  generate id here
            state.data.push(action.payload);
        },
        removeInvoice: function (state, action) {
            state.data = state.data.filter(function (invoice) { return invoice.id !== action.payload; });
        },
        updateInvoice: function (state, action) {
            // console.log("entered updateInvoice");
            var oldInvoice = state.data.find(function (invoice) { return invoice.id === action.payload.id; });
            if (oldInvoice) {
                var index = state.data.indexOf(oldInvoice);
                state.data.splice(index, 1, action.payload);
                // console.log("invoice updated");
            }
        },
        markAsPaid: function (state, action) {
            var invoice1 = state.data.find(function (invoice) { return invoice.id === action.payload; });
            if (invoice1) {
                invoice1.status = "paid";
            }
        },
        markAsPending: function (state, action) {
            var invoice1 = state.data.find(function (invoice) { return invoice.id === action.payload; });
            if (invoice1) {
                invoice1.status = "pending";
            }
        },
        addItem: function (state, action) {
            var _a = action.payload, id = _a.id, newItem = _a.newItem;
            var invoice = state.data.find(function (element) { return element.id === id; });
            if (invoice) {
                invoice.items.push(newItem);
            }
        },
        addIdToExistingInvoices: function (state) {
            // eslint-disable-next-line no-restricted-syntax
            for (var _i = 0, _a = state.data; _i < _a.length; _i++) {
                var i = _a[_i];
                var item = void 0;
                // eslint-disable-next-line no-restricted-syntax
                for (var _b = 0, _c = i.items; _b < _c.length; _b++) {
                    item = _c[_b];
                    if (!item.id) {
                        item.id = (0, uuid_1.v4)();
                    }
                }
            }
        },
        clearInvoices: function (state) {
            state.data = [];
        },
    },
});
exports.addInvoice = (_a = exports.invoicesSlice.actions, _a.addInvoice), exports.removeInvoice = _a.removeInvoice, exports.updateInvoice = _a.updateInvoice, exports.markAsPaid = _a.markAsPaid, exports.addItem = _a.addItem, exports.addIdToExistingInvoices = _a.addIdToExistingInvoices, exports.clearInvoices = _a.clearInvoices;
var selectInvoices = function (state) { return state.invoices.data; };
exports.selectInvoices = selectInvoices;
var selectInvoiceById = function (state, id) { return state.invoices.data.find(function (item) { return id === item.id; }); };
exports.selectInvoiceById = selectInvoiceById;
exports.default = exports.invoicesSlice.reducer;
