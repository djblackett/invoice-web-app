import { getInvoiceResolvers } from "./invoiceResolvers";
import { getUserResolvers } from "./userResolvers";
import { getRevisionResolvers } from "./revisionResolvers";

export function getResolvers() {
  const invoiceResolvers = getInvoiceResolvers();
  const userResolvers = getUserResolvers();
  const revisionResolvers = getRevisionResolvers();

  return {
    Query: {
      ...invoiceResolvers.Query,
      ...userResolvers.Query,
      ...revisionResolvers.Query,
    },
    Mutation: {
      ...invoiceResolvers.Mutation,
      ...userResolvers.Mutation,
      ...revisionResolvers.Mutation,
    },
    Subscription: {
      ...invoiceResolvers.Subscription,
    },
  };
}
