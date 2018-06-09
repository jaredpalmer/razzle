import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-fetch';
import { api } from './apollo.config';

export function createApolloClient() {
  const ssrMode = !process.browser;
  return new ApolloClient({
    ssrMode,
    link: createHttpLink({
      uri: process.env.NODE_ENV === 'production' ? api.production : api.dev,
      credentials: 'same-origin',
      fetch,
    }),
    cache: ssrMode
      ? new InMemoryCache()
      : new InMemoryCache().restore(window.__APOLLO_STATE__),
  });
}
