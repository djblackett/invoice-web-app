import { Prisma } from "@prisma/client";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

export const itemsZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  total: z.coerce.number(),
});
export const addressZod = z.object({
  id: z.number().optional(),
  street: z.string(),
  city: z.string(),
  postCode: z.string(),
  country: z.string(),
});
const createdByZod = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  role: z.enum(["USER", "ADMIN"]),
});
const decimalToNumber = (val: unknown): number => {
  if (val instanceof Decimal) {
    return val.toNumber();
  }
  return Number(val);
};

export const paymentZod = z.object({
  id: z.string(),
  invoiceId: z.string(),
  amount: z.preprocess(decimalToNumber, z.number().positive()),
  date: z.string().datetime(),
});

export const invoiceZod = z.object({
  createdBy: createdByZod,
  createdById: z.string(),
  clientAddress: addressZod,
  clientEmail: z.string(),
  clientName: z.string(),
  createdAt: z.string(),
  description: z.string(),
  id: z.string(),
  items: z.array(itemsZod),
  paymentDue: z.string(),
  paymentTerms: z.number(),
  senderAddress: addressZod,
  status: z.string(),
  total: z.coerce.number(),
  amountPaid: z.preprocess(
    (v) => (v instanceof Prisma.Decimal ? v.toNumber() : v),
    z.number().min(0),
  ),
  payments: z.array(paymentZod).default([]), // New
});
export const userCreateZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  username: z.string(),
  password: z.string(),
});
export const userZod = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
});
export const invoiceListZod = z.array(invoiceZod);
