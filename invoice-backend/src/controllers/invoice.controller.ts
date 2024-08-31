/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { getResolvers } from "../GraphQL/resolvers";
import { controller, httpPost, requestBody } from "inversify-express-utils";
import { UserService } from "../services/user.service";

@controller("/api")
class InvoiceController {
  resolvers;

  constructor(
    @inject(InvoiceService) private readonly invoiceService: InvoiceService,
    @inject(UserService) private readonly userService: UserService
  ) {
    this.resolvers = getResolvers(this.invoiceService, this.userService);
  }

  // I'm not sure why this is here
  // @httpPost("/invoices")
  // async newInvoice(@requestBody() unvalidatedInvoice: unknown) {
  //   try {
  //     const validatedInvoice = validateInvoiceData(unvalidatedInvoice);
  //     return await this.invoiceService.addInvoice(
  //       unvalidatedInvoice as Invoice,
  //     );
  //   } catch (error: any) {
  //     console.log(error);
  //     // res.status(400).send(error.message);
  //     return error;
  //   }
  // }
}

export default InvoiceController;
