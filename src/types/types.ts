import {Dispatch, SetStateAction} from "react";

export type StatusKey = "draft" | "paid" | "pending";

export interface Filter {
    [key: string]: {
        draft: boolean,
        paid: boolean,
        pending: boolean
    }
}

export interface Invoice {
    clientAddress: ClientAddress,
    clientEmail: string,
    clientName: string,
    createdAt: string,
    description: string,
    id: string,
    items: Item[],
    paymentDue: string,
    paymentTerms: number,
    senderAddress: SenderAddress,
    status: string,
    total: number
}

export interface SenderAddress {
    city: string,
    country: string,
    postCode: string
    street: string
}

export interface ClientAddress {
    city: string,
    country: string,
    postCode: string
    street: string
}

export interface Item {
    id?: string,
    name: string
    price: number,
    quantity: number,
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