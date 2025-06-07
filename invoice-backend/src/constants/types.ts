import type express from "express";
import type { BaseContext } from "@apollo/server";
import type { Context as GraphQLWSContext } from "graphql-ws";
import type { Container } from "inversify";
import type { InvoiceService } from "@/services/invoice.service";
import type { UserService } from "@/services/user.service";
import type { RevisionService } from "@/services/revision.service";
import type { PubSub } from "graphql-subscriptions";

export interface Invoice {
  createdBy?: UserIdAndRole | undefined;
  createdById?: string | undefined;
  clientAddressId?: string | undefined;
  clientAddress: ClientAddress | undefined;
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  id: string;
  items: Item[] | undefined;
  paymentDue: string;
  paymentTerms: number;
  senderAddress: SenderAddress | undefined;
  senderAddressId?: string | undefined;
  status: string;
  total: number;
}
export interface InvoiceWithCreatedBy extends Invoice {
  createdBy: UserIdAndRole | undefined;
  createdById: string | undefined;
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
  id?: string | undefined;
  name: string | undefined;
  price: number | undefined;
  quantity: number | undefined;
  total: number | undefined;
}

export interface ContextArgs {
  req?: express.Request | undefined;
  connection?: GraphQLWSContext | undefined;
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
  revisionService?: RevisionService;
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
  id?: string | undefined;
  name?: string | undefined;
  username: string | undefined;
}

export interface UserEntity extends CreateUserArgs {
  id?: string;
  passwordHash: string;
}

export interface CreateUserDTO extends CreateUserArgs {
  password: string;
}

export interface UserDTO {
  id?: string | undefined;
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
  role: "USER" | "ADMIN" | undefined;
  username?: string | undefined;
  name: string | undefined;
}
