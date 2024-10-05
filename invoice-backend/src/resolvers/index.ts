import { InvoiceService } from "../services/invoice.service";
import { UserService } from "../services/user.service";
import { getInvoiceResolvers } from "./invoiceResolvers";
import { getUserResolvers } from "./userResolvers";

export function getResolvers(
  invoiceService: InvoiceService,
  userService: UserService,
) {
  const invoiceResolvers = getInvoiceResolvers(invoiceService);
  const userResolvers = getUserResolvers(userService);

  return {
    Query: {
      ...invoiceResolvers.Query,
      ...userResolvers.Query,
    },
    Mutation: {
      ...invoiceResolvers.Mutation,
      ...userResolvers.Mutation,
    },
    Subscription: {
      ...invoiceResolvers.Subscription,
    },
    // Add any additional resolver mappings or custom scalar resolvers here
  };
}
