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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoiceObject = exports.convertStringToDate = exports.convertDateToString = exports.convertedDate = exports.getMoney = exports.getCurrency = exports.generateId = void 0;
var uuid_1 = require("uuid");
var generateId = function () {
    var list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var res = "";
    for (var i = 0; i < 2; i++) {
        var rnd = Math.floor(Math.random() * list.length);
        res += list.charAt(rnd);
    }
    for (var i = 0; i < 4; i++) {
        res += String(Math.floor(Math.random() * 9));
    }
    return res;
};
exports.generateId = generateId;
function getCurrency(money) {
    return new Intl.NumberFormat("en-GB", {
        currency: "GBP",
        style: "currency",
    }).format(money); // 'CA$ 100.00'
}
exports.getCurrency = getCurrency;
function getMoney(amount) {
    return amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}
exports.getMoney = getMoney;
var convertedDate = function (dateString) {
    if (dateString) {
        var date = dateString.split("-");
        var dateObj = new Date(Date.UTC(Number(date[0]), Number(date[1]), Number(date[2])));
        return dateObj.toDateString().substring(4);
    }
};
exports.convertedDate = convertedDate;
var convertDateToString = function (date) {
    var _a = [date.getMonth(), date.getDate(), date.getFullYear()], month = _a[0], day = _a[1], year = _a[2];
    return [year, month, day].join("-");
};
exports.convertDateToString = convertDateToString;
var convertStringToDate = function (str) {
    if (!str) {
        return new Date();
    }
    var dateArray = str.split("-");
    return new Date(Date.UTC(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2])));
};
exports.convertStringToDate = convertStringToDate;
var createInvoiceObject = function (data, startDate, selectedPaymentOption, id, invoice) {
    var newInvoice = {
        id: id || "",
        clientName: data.clientName,
        clientAddress: {
            city: data.clientCity,
            country: data.clientCountry,
            postCode: data.clientPostalCode,
            street: data.clientStreetAddress,
        },
        senderAddress: {
            city: data.city,
            country: data.country,
            postCode: data.postalCode,
            street: data.streetAddress,
        },
        clientEmail: data.clientEmail,
        createdAt: (0, exports.convertDateToString)(startDate),
        description: data.projectDescription,
        items: __spreadArray([], data.items, true),
        paymentDue: "",
        paymentTerms: 0,
        status: (invoice === null || invoice === void 0 ? void 0 : invoice.status) || "draft",
        total: 0,
    };
    var invoiceTotal = 0;
    var items = newInvoice.items;
    for (var i = 0; i < items.length; i++) {
        items[i].total = items[i].quantity * items[i].price;
        invoiceTotal += Number(items[i].total);
        if (!items[i].id) {
            items[i].id = (0, uuid_1.v4)();
        }
    }
    newInvoice.total = invoiceTotal;
    newInvoice.id = newInvoice.id ? newInvoice.id : (0, exports.generateId)();
    newInvoice.paymentTerms = selectedPaymentOption;
    // newInvoice.status = isDraft ?  "draft" : "pending";
    // newInvoice.status = data.status;
    var date = new Date(startDate.getTime() + 86400000 * newInvoice.paymentTerms);
    var _a = [date.getMonth(), date.getDate(), date.getFullYear()], month = _a[0], day = _a[1], year = _a[2];
    newInvoice.paymentDue = [year, month, day].join("-");
    // console.log("end of newVoice function", newInvoice);
    return newInvoice;
};
exports.createInvoiceObject = createInvoiceObject;
