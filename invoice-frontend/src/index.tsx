import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "./styles/index.css";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import store from "./app/store";
import App from "./app/App";


const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

if (!VITE_BACKEND_URL) {
  throw new Error("Backend URL was not set during frontend build process");
}


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("library-user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = createHttpLink({ uri: VITE_BACKEND_URL });
const wsLink = new GraphQLWsLink(createClient({ url: "ws://" + VITE_BACKEND_URL }));

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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
  connectToDevTools: true
});


const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <ApolloProvider client={client}>
      <React.StrictMode>
        <Provider store={store}>
          <HashRouter>
            <App />
          </HashRouter>
        </Provider>
      </React.StrictMode>
    </ApolloProvider>
  );
}
