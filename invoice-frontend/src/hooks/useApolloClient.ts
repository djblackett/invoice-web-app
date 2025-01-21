import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth0 } from "@auth0/auth0-react";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

const useGraphQLClient = () => {
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  if (!VITE_BACKEND_URL) {
    throw new Error("Backend URL was not set during frontend build process");
  }
  loadDevMessages();
  loadErrorMessages();

  const { getAccessTokenSilently } = useAuth0();
  // Memoize the Apollo Client to prevent unnecessary re-creations
  const client = useMemo(() => {
    // Authentication Link to attach the token to headers
    const authLink = setContext(async (_, { headers }) => {
      try {
        const options = {
          authorizationParams: {
            audience: "https://invoice-web-app/",
            scope: "openid profile email offline_access",
          },
        };
        const token = await getAccessTokenSilently(options);
        return {
          headers: {
            ...headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        };
      } catch (error) {
        console.error("Error fetching access token:", error);
        return { headers };
      }
    });

    // HTTP Link for queries and mutations
    const httpLink = createHttpLink({
      uri: VITE_BACKEND_URL,
    });

    // WebSocket Link for subscriptions
    const wsLink = new GraphQLWsLink(
      createClient({
        url: `ws://${VITE_BACKEND_URL}`, // Adjust protocol if needed (wss:// for secure)
      }),
    );

    // Split Link to direct operations to appropriate links
    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      authLink.concat(httpLink),
    );

    // Initialize Apollo Client
    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
      connectToDevTools: process.env.NODE_ENV !== "production",
    });
  }, []);
  return client;
};

export default useGraphQLClient;
