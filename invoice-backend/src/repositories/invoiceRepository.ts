import {Invoice} from "../types";

interface InvoiceRepositoryInterface {
    findAll(): Promise<Invoice[]>;

    findById(id: string): Promise<Invoice | null>;

    create(invoice: CreateUserDto): Promise<Invoice>;

    update(id: string, invoice: UpdateUserDto): Promise<Invoice>;

    delete(id: string): Promise<void>;
}