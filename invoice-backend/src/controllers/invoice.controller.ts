import {inject} from "inversify";
import {InvoiceService} from "../services/invoice.service";
import {getResolvers} from "../GraphQL/resolvers";
import {controller, httpPost, requestBody} from "inversify-express-utils";
import {Invoice} from "../constants/types";
import {validateInvoiceData} from "../utils";

@controller("/api")
export class InvoiceController {
    // private readonly invoiceService: InvoiceService;
    resolvers;

    constructor(
        @inject(InvoiceService) private readonly invoiceService: InvoiceService
    ) {
        // this.invoiceService = myContainer.get<InvoiceService>(InvoiceService);
        // this.invoiceService = invoiceService;
        this.resolvers = getResolvers(this.invoiceService);
    }

    // @httpGet("/")
    // public async getInvoices() {
    //     return this.invoiceService.getInvoices();
    // }
//     router.get("/api/invoices", (_req, res) => {
//     const data: Invoice[] = invoiceService.getInvoices();
//     res.json(data);
// }

    @httpPost("/invoices")
    async newInvoice(@requestBody() unvalidatedInvoice: unknown) {
        try {
            const validatedInvoice = validateInvoiceData(unvalidatedInvoice);
            return await this.invoiceService.addInvoice(unvalidatedInvoice as Invoice)
        } catch (error: any) {
            console.log(error);
            // res.status(400).send(error.message);
            return error;
        }
    };
}