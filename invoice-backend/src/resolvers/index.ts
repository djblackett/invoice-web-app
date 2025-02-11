import { getInvoiceResolvers } from "./invoiceResolvers";
import { getUserResolvers } from "./userResolvers";

export function getResolvers() {
  const invoiceResolvers = getInvoiceResolvers();
  const userResolvers = getUserResolvers();

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
  };
}
