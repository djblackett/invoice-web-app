// import {
//   createHttpLink,
//   split,
//   ApolloClient,
//   InMemoryCache,
// } from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
// import { getMainDefinition } from "@apollo/client/utilities";
// import { createClient } from "graphql-ws";
// import { getAccessTokenSilently } from "src/utils/auth";

// const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// if (!VITE_BACKEND_URL) {
//   throw new Error("Backend URL was not set during frontend build process");
// }

// const authLink = setContext(async (_, { headers }) => {
//   const token = await getAccessTokenSilently();
//   return {
//     headers: {
//       ...headers,
//       ...(token ? { authorization: `Bearer ${token}` } : {}),
//     },
//   };
// });

// const httpLink = createHttpLink({ uri: VITE_BACKEND_URL });
// const wsLink = new GraphQLWsLink(
//   createClient({ url: "ws://" + VITE_BACKEND_URL }),
// );

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink,
//   authLink.concat(httpLink),
// );

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: splitLink,
//   connectToDevTools: true,
// });

// export default client;
