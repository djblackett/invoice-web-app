import { inject } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { getResolvers } from "../resolvers/index";
import { controller } from "inversify-express-utils";
import { UserService } from "../services/user.service";

@controller("/api")
class InvoiceController {
  resolvers;

  constructor(
    @inject(InvoiceService) private readonly invoiceService: InvoiceService,
    @inject(UserService) private readonly userService: UserService,
  ) {
    this.resolvers = getResolvers(this.invoiceService, this.userService);
  }
}

export default InvoiceController;
