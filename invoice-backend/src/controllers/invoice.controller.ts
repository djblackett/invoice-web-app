import { inject } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { getResolvers } from "../GraphQL/resolvers";
import { controller, httpPost, requestBody } from "inversify-express-utils";
import { Invoice } from "../constants/types";
import { validateInvoiceData } from "../utils";

@controller("/api")
class InvoiceController {
  resolvers;

  constructor(
    @inject(InvoiceService) private readonly invoiceService: InvoiceService,
  ) {
    this.resolvers = getResolvers(this.invoiceService);
  }

  @httpPost("/invoices")
  async newInvoice(@requestBody() unvalidatedInvoice: unknown) {
    try {
      const validatedInvoice = validateInvoiceData(unvalidatedInvoice);
      return await this.invoiceService.addInvoice(
        unvalidatedInvoice as Invoice,
      );
    } catch (error: any) {
      console.log(error);
      // res.status(400).send(error.message);
      return error;
    }
  }
}

export default InvoiceController;
