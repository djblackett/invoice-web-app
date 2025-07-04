import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./typeDefs";
import { getResolvers } from "@/resolvers";

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: getResolvers(),
});
