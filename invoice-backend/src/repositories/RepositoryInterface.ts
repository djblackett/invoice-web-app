import {Invoice} from "../constants/types";
import {CreateInvoiceDto} from "../dto/createInvoice.dto";
import {UpdateInvoiceDto} from "../dto/updateInvoice.dto";


export interface RepositoryInterface {

    findAll(): Promise<any[] | null>;


    // findById(id: string): Promise<Invoice | null>;
    //
    // create(invoice: CreateInvoiceDto): Promise<Invoice>;
    //
    // update(id: string, invoice: UpdateInvoiceDto): Promise<Invoice>;
    //
    // delete(id: string): Promise<void>;
}


