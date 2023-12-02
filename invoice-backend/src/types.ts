import {z} from "zod";

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

export const itemsZod = z.object({
        id: z.string().min(1).max(50).optional(),
        name: z.string().min(1).max(50),
        price: z.number(),
        quantity: z.number(),
        total: z.number()
    }
);

export const addressZod = z.object({
    street: z.string().min(1).max(50),
    city: z.string().min(1).max(50),
    postCode: z.string().min(1).max(50),
    country: z.string().min(1).max(50)
});

export const invoiceZod = z.object({
    clientAddress: addressZod,
    clientEmail: z.string().email(),
    clientName: z.string().min(1).max(50),
    createdAt: z.string().min(4).max(50),
    description: z.string().min(1).max(50),
    id: z.string().min(1).max(50),
    items: z.array(itemsZod),
    paymentDue: z.string().min(1).max(50),
    paymentTerms: z.number().min(0).max(30),
    senderAddress: addressZod,
    status: z.string().min(1).max(10),
    total: z.number().min(0)
});

