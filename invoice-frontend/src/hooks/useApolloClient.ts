import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@/hooks/useAuth";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

const useGraphQLClient = () => {
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  if (!VITE_BACKEND_URL) {
    throw new Error("Backend URL was not set during frontend build process");
  }

  if (process.env.NODE_ENV !== "production") {
    loadDevMessages();
    loadErrorMessages();
  }

  const { getAccessTokenSilently } = useAuth();
  // Memoize the Apollo Client to prevent unnecessary re-creations
  const client = useMemo(() => {
    // Authentication Link to attach the token to headers
    const authLink = setContext(async (_, { headers }) => {
      try {
        const options = {
          authorizationParams: {
            audience: import.meta.env.VITE_AUDIENCE,
            scope: import.meta.env.VITE_SCOPE,
          },
        };

        let token;

        // Demo mode does not require authentication
        if (import.meta.env.IS_DEMO === "true") {
          token = "demo-token";
        } else {
          token = await getAccessTokenSilently(options);
        }
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

    const addressWithoutProtocol = VITE_BACKEND_URL.replace("https://", "");

    // WebSocket Link for subscriptions
    const wsLink = new GraphQLWsLink(
      createClient({
        url: `wss://${addressWithoutProtocol}`,
        connectionParams: async () => {
          try {
            const options = {
              authorizationParams: {
                audience: import.meta.env.VITE_AUDIENCE,
                scope: import.meta.env.VITE_SCOPE,
              },
            };

            let token;

            // Demo mode does not require authentication
            if (import.meta.env.IS_DEMO === "true") {
              token = "demo-token";
            } else {
              token = await getAccessTokenSilently(options);
            }
            return token ? { Authorization: `Bearer ${token}` } : {};
          } catch (error) {
            console.error(
              "Error fetching access token for subscriptions:",
              error,
            );
            return {};
          }
        },
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
