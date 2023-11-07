import {Dispatch, SetStateAction} from "react";

export type StatusKey = 'draft' | 'paid' | 'pending';

export interface Filter {
    [key: string]: {
        draft: boolean,
        paid: boolean,
        pending: boolean
    }
}

export interface Invoice {
    id: string
    createdAt: string
    paymentDue: string
    description: string
    paymentTerms: number
    clientName: string
    clientEmail: string
    status: string
    senderAddress: SenderAddress
    clientAddress: ClientAddress
    items: Item[]
    total: number
}

export interface SenderAddress {
    street: string
    city: string
    postCode: string
    country: string
}

export interface ClientAddress {
    street: string
    city: string
    postCode: string
    country: string
}

export interface Item {
    id?: string,
    name: string
    quantity: number
    price: number
    total: number
}

export interface ReduxInvoiceState {
    invoices: {
        data: Invoice[]
    }
}

export type ScrollPosition = {
    x: number;
    y: number;
};

// Type the props for AllInvoices component
export type AllInvoicesProps = {
    setScrollPosition: Dispatch<SetStateAction<ScrollPosition>>;
};

export type FullInvoiceProps = {
    invoice: Invoice
}