import { z } from "zod";
import express from "express";
import { BaseContext } from "@apollo/server";
import { Context as GraphQLWSContext } from "graphql-ws";
import { PrismaClient } from "@prisma/client";
import { Container } from "inversify";
import { InvoiceService } from "@/services/invoice.service";
import { UserService } from "@/services/user.service";
import { PubSub } from "graphql-subscriptions";

export interface Invoice {
  createdBy?: UserIdAndRole;
  createdById?: string;
  clientAddressId?: string;
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
  senderAddressId?: string;
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

export interface InvoiceWithCreatedBy extends Invoice {
  createdBy: UserIdAndRole;
  createdById: string;
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

export const loggedInUserZod = z.object({
  id: z.string(),
  username: z.string(),
});

export const invoiceListZod = z.array(invoiceZod);

export interface ContextArgs {
  req?: express.Request;
  connection?: GraphQLWSContext;
  testPrisma?: PrismaClient;
}

export interface QueryContext extends BaseContext {
  user?: UserIdAndRole | null;
  username?: string | null;
  connection?: GraphQLWSContext;
  container?: Container;
}

export interface InjectedQueryContext {
  user?: UserIdAndRole | null;
  invoiceService?: InvoiceService;
  userService?: UserService;
  pubsub?: PubSub;
  container?: Container;
  connection?: GraphQLWSContext;
}

export interface MyContext extends BaseContext {
  applyMiddleware?: unknown;
  connection?: GraphQLWSContext;
  user?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface User {
  id: string;
  name?: string;
  username: string;
  passwordHash: string;
}

export type ReturnedUser = Omit<User, "passwordHash">;

export type LoggedInUser = Omit<ReturnedUser, "name">;

export interface LoginResponseDTO {
  token: string;
  user: UserDTO;
}

export interface CreateUserArgs {
  id?: string;
  name?: string;
  username: string;
}

export interface UserEntity extends CreateUserArgs {
  id?: string;
  passwordHash: string;
}

export interface CreateUserDTO extends CreateUserArgs {
  password: string;
}

export interface UserDTO {
  id?: string;
  name: string;
  username: string;
}

export type CreateUserNoName = Omit<CreateUserArgs, "name">;

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

export interface PrismaContext {
  prisma: PrismaClient;
}

export interface UserIdAndRole {
  id: string;
  role: "USER" | "ADMIN";
  username?: string;
  name: string;
}
