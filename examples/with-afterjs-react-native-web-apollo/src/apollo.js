import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-fetch';

export function createApolloClient() {
  const ssrMode = !process.browser;
  const uri = 'http://localhost:64895';
  return new ApolloClient({
    ssrMode,
    link: createHttpLink({
      uri,
      credentials: 'same-origin',
      fetch,
    }),
    cache: ssrMode
      ? new InMemoryCache()
      : new InMemoryCache().restore(window.__APOLLO_STATE__),
  });
}
