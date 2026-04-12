import { getInvoiceResolvers } from "./invoiceResolvers";
import { getInvoiceRevisionResolvers } from "./invoiceRevisionResolvers";
import { getUserResolvers } from "./userResolvers";

export function getResolvers() {
  const invoiceResolvers = getInvoiceResolvers();
  const revisionResolvers = getInvoiceRevisionResolvers();
  const userResolvers = getUserResolvers();

  return {
    Query: {
      ...invoiceResolvers.Query,
      ...revisionResolvers.Query,
      ...userResolvers.Query,
    },
    Mutation: {
      ...invoiceResolvers.Mutation,
      ...revisionResolvers.Mutation,
      ...userResolvers.Mutation,
    },
    Subscription: {
      ...invoiceResolvers.Subscription,
    },
  };
}
