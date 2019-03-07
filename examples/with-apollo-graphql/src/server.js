// Note you don't have to use any particular fetch polyfill, but
// we're using isomorphic-fetch in this example
// https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-http#fetch-polyfill
import 'isomorphic-fetch';

// React Apollo makes use of Object.assign, which is not supported in certain browsers (most prominently, IE11)
// https://github.com/apollographql/react-apollo#polyfills
import 'core-js/fn/object/assign';

import React from 'react';
import express from 'express';
import ReactDOM from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './App';

// Create an ApolloClient instance
// Pass your GraphQL endpoint to uri
const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: 'https://gql-placeholder.herokuapp.com/graphql',
  }),
  cache: new InMemoryCache(),
});

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const Application = (
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    );

    // Your markup in this case can look something like:
    const Html = ({ content, state }) => {
      return (
        <html>
          <title>Welcome to Razzle</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
          <body>
            <div
              id="root"
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__APOLLO_STATE__=${JSON.stringify(
                  state
                ).replace(/</g, '\\u003c')};`,
              }}
            />
            <script src={assets.client.js} defer crossorigin="anonymous" />
          </body>
        </html>
      );
    };

    // during request (see above)
    getDataFromTree(Application).then(() => {
      // We are ready to render for real
      const content = ReactDOM.renderToString(Application);
      const initialState = client.extract();

      const html = <Html content={content} state={initialState} />;

      res.status(200);
      res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
      res.end();
    });
  });

export default server;
