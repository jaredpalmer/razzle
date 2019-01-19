import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import App from './App';

const client = new ApolloClient({
  cache: new InMemoryCache().restore((window as any).__APOLLO_STATE__),
  connectToDevTools: true,
  link: new HttpLink({
    credentials: 'same-origin'
  }),
  ssrForceFetchDelay: 100
});
hydrate(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
