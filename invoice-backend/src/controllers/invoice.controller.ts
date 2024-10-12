import { inject } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { getResolvers } from "../resolvers/index";
import { controller } from "inversify-express-utils";
import { UserService } from "../services/user.service";
import { PubSub } from "graphql-subscriptions";
import TYPES from "../constants/identifiers";

@controller("/api")
class InvoiceController {
  resolvers;

  constructor(
    @inject(InvoiceService) private readonly invoiceService: InvoiceService,
    @inject(UserService) private readonly userService: UserService,
    @inject(TYPES.PubSub) private readonly pubsub: PubSub,
  ) {
    this.resolvers = getResolvers(
      this.invoiceService,
      this.userService,
      this.pubsub,
    );
  }
}

export default InvoiceController;
