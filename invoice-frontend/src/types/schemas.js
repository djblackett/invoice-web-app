"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceZod = exports.itemsZod = exports.validationSchema = void 0;
var Yup = require("yup");
var zod_1 = require("zod");
exports.validationSchema = Yup.object().shape({
  clientName: Yup.string().required("Name is required"),
  clientEmail: Yup.string()
    .email("Email is Invalid")
    .required("Email is required"),
  clientStreetAddress: Yup.string().required("Street address is required"),
  clientCity: Yup.string().required("City is required"),
  clientPostalCode: Yup.string().required("Postal code is required"),
  clientCountry: Yup.string().required("Country is required"),
  projectDescription: Yup.string().required("Project description is required"),
  items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name is required"),
      quantity: Yup.number()
        .positive()
        .integer()
        .required("Quantity is required"),
      price: Yup.number().positive().max(10000).required("Price is required"),
    }),
  ),
});
exports.itemsZod = zod_1.z.object({
  id: zod_1.z.string().min(1).max(50),
  name: zod_1.z.string().min(1).max(50),
  price: zod_1.z.number(),
  quantity: zod_1.z.number(),
  total: zod_1.z.number(),
});
exports.invoiceZod = zod_1.z.object({
  clientAddress: zod_1.z.string().min(1).max(50),
  clientEmail: zod_1.z.string().email(),
  clientName: zod_1.z.string().min(1).max(50),
  createdAt: zod_1.z.string().min(4).max(50),
  description: zod_1.z.string().min(1).max(50),
  id: zod_1.z.string().min(1).max(50),
  items: exports.itemsZod,
  paymentDue: zod_1.z.string().min(1).max(50),
  paymentTerms: zod_1.z.number().min(0).max(30),
  senderAddress: zod_1.z.string().min(1).max(50),
  status: zod_1.z.string().min(1).max(10),
  total: zod_1.z.number().min(0),
});
