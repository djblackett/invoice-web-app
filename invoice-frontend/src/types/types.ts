import { Dispatch, SetStateAction } from "react";
import { User as Auth0User } from "@auth0/auth0-react";

export type StatusKey = "draft" | "paid" | "pending";

export interface FilterOptions {
  draft: boolean;
  paid: boolean;
  pending: boolean;
}

export interface Filter {
  filter: FilterOptions;
}

export interface FormType {
  city: string;
  clientCity: string;
  clientCountry: string;
  clientEmail: string;
  clientName: string;
  clientPostalCode: string;
  clientStreetAddress: string;
  country: string;
  items: [
    {
      id: string;
      name: string;
      price: number;
      quantity: number;
      total: number;
    },
  ];
  postalCode: string;
  projectDescription: string;
  status: string;
  streetAddress: string;
}

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

export interface ReduxInvoiceState {
  invoices: {
    data: Invoice[];
  };
}

export type ScrollPosition = {
  x: number;
  y: number;
};

// Type the props for AllInvoices component
export type AllInvoicesProps = {
  setScrollPosition: Dispatch<SetStateAction<ScrollPosition>>;
};

export interface FormData {
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  projectDescription: string;
  clientName: string;
  clientEmail: string;
  clientStreetAddress: string;
  clientCity: string;
  clientPostalCode: string;
  clientCountry: string;
}

export enum Role {
  "USER",
  "ADMIN",
}
export interface User extends Auth0User {
  id: string;
  username: string;
  name?: string;
  role: Role;
}
