import { InvoiceService } from "../services/invoice.service";
import { UserService } from "../services/user.service";
import { getInvoiceResolvers } from "./invoiceResolvers";
import { getUserResolvers } from "./userResolvers";
import { PubSub } from "graphql-subscriptions";

export function getResolvers(
  invoiceService: InvoiceService,
  userService: UserService,
  pubsub: PubSub,
) {
  const invoiceResolvers = getInvoiceResolvers(invoiceService, pubsub);
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
