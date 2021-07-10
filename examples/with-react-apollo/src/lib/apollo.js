import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import fetch from "isomorphic-unfetch";

export function createClient() {
  const client = new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: "https://metaphysics-production.artsy.net/", // Server URL (must be absolute)
      // Use fetch() polyfill on the server
      fetch: !process.browser && fetch
    }),
    cache: process.browser
      ? new InMemoryCache().restore(window.__APOLLO_STATE__)
      : new InMemoryCache()
  });

  return client;
}
