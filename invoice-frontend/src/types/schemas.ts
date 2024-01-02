import * as Yup from "yup";
import { z } from "zod";

export const validationSchema = Yup.object().shape({
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

export const itemsZod = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(50),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
});

export const invoiceZod = z.object({
  clientAddress: z.string().min(1).max(50),
  clientEmail: z.string().email(),
  clientName: z.string().min(1).max(50),
  createdAt: z.string().min(4).max(50),
  description: z.string().min(1).max(50),
  id: z.string().min(1).max(50),
  items: itemsZod,
  paymentDue: z.string().min(1).max(50),
  paymentTerms: z.number().min(0).max(30),
  senderAddress: z.string().min(1).max(50),
  status: z.string().min(1).max(10),
  total: z.number().min(0),
});
