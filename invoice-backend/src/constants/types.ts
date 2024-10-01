import { z } from "zod";
import express from "express";
import { BaseContext } from "@apollo/server/dist/cjs";
import { Context as GraphQLWSContext } from "graphql-ws";

export interface Invoice {
  clientAddress: ClientAddress;
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  id: string;
  items: Item[];
  paymentDue: string;
  paymentTerms: number;
  senderAddress: SenderAddress;
  status: string;
  total: number;
}

export interface InvoiceUpdateArgs {
  clientAddress?: ClientAddress;
  clientEmail?: string;
  clientName?: string;
  createdAt?: string;
  description?: string;
  id: string;
  items?: Item[];
  paymentDue?: string;
  paymentTerms?: number;
  senderAddress?: SenderAddress;
  status?: string;
  total?: number;
}

// New interface for the update object
export interface InvoiceUpdatePayload {
  id: string | undefined;
  clientAddress?: ClientAddress | undefined;
  clientEmail?: string | undefined;
  clientName?: string | undefined;
  createdAt?: string | undefined;
  description?: string | undefined;
  items?: Item[] | undefined;
  paymentDue?: string | undefined;
  paymentTerms?: number | undefined;
  senderAddress?: SenderAddress | undefined;
  status?: string | undefined;
  total?: number | undefined;
}

export interface SenderAddress {
  city: string;
  country: string;
  postCode: string;
  street: string;
}

export interface ClientAddress {
  city: string;
  country: string;
  postCode: string;
  street: string;
}

export interface Item {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export const itemsZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  total: z.coerce.number(),
});

export const addressZod = z.object({
  id: z.number().optional(), // Assuming id is optional
  street: z.string(),
  city: z.string(),
  postCode: z.string(),
  country: z.string(),
});

export const invoiceZod = z.object({
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
});

export const invoiceListZod = z.array(invoiceZod);

export interface ContextArgs {
  req: express.Request;
  connection?: GraphQLWSContext;
}

export interface QueryContext extends BaseContext {
  user?: ReturnedUser;
  connection?: GraphQLWSContext;
}

export interface MyContext extends BaseContext {
  // token?: string;
  applyMiddleware?: unknown;
  connection?: GraphQLWSContext;
  user?: {
    id: number;
    name: string;
    username: string;
  };
}

export interface User {
  id: number;
  name: string;
  username: string;
  passwordHash: string;
}

// export interface ReturnedUser {
//   id: number;
//   name: string;
//   username: string;
// }

export type ReturnedUser = Omit<User, "passwordHash">;

export interface CreateUserArgs {
  name: string;
  username: string;
  password: string;
}

export interface LoginArgs {
  username: string;
  password: string;
}

export interface GetInvoiceByIdArgs {
  id: string;
}

export interface InvoiceCreateArgs {
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  id: string;
  paymentDue: string;
  paymentTerms: number;
  status: string;
  total: number;
  clientAddress: {
    city: string;
    country: string;
    postCode: string;
    street: string;
  };
  senderAddress: {
    city: string;
    country: string;
    postCode: string;
    street: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    total: number;
    id?: string | undefined;
  }>;
}

export type MarkAsPaidArgs = GetInvoiceByIdArgs;
