import {InvoiceRepositoryInterface} from "./invoiceRepository";
import {Invoice} from "../types";
import {CreateInvoiceDto} from "../dto/createInvoice.dto";
import {UpdateInvoiceDto} from "../dto/updateInvoice.dto";
import {PrismaClient} from "@prisma/client";

export class PrismaRepositoryImpl implements InvoiceRepositoryInterface {
    constructor(private prisma: PrismaClient) {}
    async findAll(): Promise<Invoice[]> {
        try {
            const response = await this.prisma.invoice.findMany({
                include: {
                    items: true,
                    clientAddress: true,
                    senderAddress: true
                }
            });
            console.log("response:", response);
            return response;
        } catch (error: any) {
            console.error(error);
            return error;
        }
    }


//     findById(id: string): Promise<Invoice | null> {
//         return null
//     }
//
//     create(invoice: CreateInvoiceDto): Promise<Invoice> {}
//
//     update(id: string, invoice: UpdateInvoiceDto): Promise<Invoice> {}
//
//     delete(id: string): Promise<void> {}
//
}