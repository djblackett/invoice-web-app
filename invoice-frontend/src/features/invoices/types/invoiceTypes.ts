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
