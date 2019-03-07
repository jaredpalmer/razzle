import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './App';

// Create an ApolloClient instance
// Pass your GraphQL endpoint to uri
const client = new ApolloClient({
  link: createHttpLink({
    uri: 'https://gql-placeholder.herokuapp.com/graphql',
  }),
  cache: new InMemoryCache(),
});

ReactDOM.hydrate(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
