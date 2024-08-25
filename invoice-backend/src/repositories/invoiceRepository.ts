import {Invoice} from "../types";

interface InvoiceRepositoryInterface {
    findAll(): Promise<Invoice[]>;

    findById(id: string): Promise<Invoice | null>;

    create(invoice: CreateInvoiceDto): Promise<Invoice>;

    update(id: string, invoice: UpdateInvoiceDto): Promise<Invoice>;

    delete(id: string): Promise<void>;
}