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
  items: Item[];
}

export type MarkAsPaidArgs = GetInvoiceByIdArgs;

export interface UserIdAndRole {
  id: string;
  role: "USER" | "ADMIN";
  username?: string;
  name: string;
}
