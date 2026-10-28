import { Kind, OperationTypeNode } from "graphql";
import { useMemo } from "react";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  type NormalizedCacheObject,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { useDemoModeContext } from "@/features/shared/components/DemoModeProvider";
import { useTemporarySession } from "@/features/auth/demoSession/TemporarySessionProvider";
import { getCredential } from "@/features/auth/demoSession/credentialStore";
import { createSessionErrorLink } from "@/features/auth/demoSession/sessionErrorLink";

const useGraphQLClient = () => {
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  if (!VITE_BACKEND_URL) {
    throw new Error("Backend URL was not set during frontend build process");
  }

  if (process.env.NODE_ENV !== "production") {
    loadDevMessages();
    loadErrorMessages();
  }

  const { isDemoMode } = useDemoModeContext();
  const { getAccessTokenSilently, user } = useAuth();
  const session = useTemporarySession();
  const temporary = session !== null;
  const identity = session?.identity;
  const markExpired = session?.markExpired;
  // Memoize the Apollo Client to prevent unnecessary re-creations
  const client = useMemo(() => {
    // Authentication Link to attach the token to headers
    const authLink = setContext(
      async (_, { headers }: { headers?: Record<string, string> }) => {
        try {
          const options = {
            authorizationParams: {
              audience: import.meta.env.VITE_AUDIENCE,
              scope: import.meta.env.VITE_SCOPE,
            },
          };

          let token;

          // Demo mode does not require authentication
          if (temporary) {
            // The private workspace's own credential, never the shared identity.
            token = getCredential();
          } else if (isDemoMode) {
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
      },
    );

    // HTTP Link for queries and mutations
    const httpLink = createHttpLink({
      uri: VITE_BACKEND_URL,
    });

    // Temporary sessions are HTTP only: the backend refuses their credential
    // on the WebSocket transport, so no WebSocket link is even created.
    if (temporary) {
      const apollo: ApolloClient<NormalizedCacheObject> = new ApolloClient({
        link: ApolloLink.from([
          createSessionErrorLink({
            onExpired: () => markExpired?.(),
            // Known state, not a replay: the visitor decides what to do next.
            onUnknownOutcome: () => {
              void apollo.refetchQueries({ include: "active" }).catch(() => {});
            },
          }),
          authLink.concat(httpLink),
        ]),
        // A new identity gets a new, empty cache.
        cache: new InMemoryCache(),
        connectToDevTools: process.env.NODE_ENV !== "production",
      });
      return apollo;
    }

    const addressWithoutProtocol = VITE_BACKEND_URL.replace(/https?:\/\//, "");

    const wsProtocol = VITE_BACKEND_URL.startsWith("https:")
      ? "wss://"
      : "ws://";

    // WebSocket Link for subscriptions
    const wsLink = new GraphQLWsLink(
      createClient({
        url: `${wsProtocol}${addressWithoutProtocol}`,
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
            if (isDemoMode) {
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
          definition.kind === Kind.OPERATION_DEFINITION &&
          definition.operation === OperationTypeNode.SUBSCRIPTION
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
  }, [user, isDemoMode, temporary, identity, markExpired]);
  return client;
};

export default useGraphQLClient;
