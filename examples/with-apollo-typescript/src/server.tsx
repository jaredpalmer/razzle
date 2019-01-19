import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import App from './App';
import Html from './Html';
let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

const server = express()
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get('/*', (req: express.Request, res: express.Response) => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        credentials: 'same-origin',
        fetch,
        uri: 'http://localhost:4000/graphql' // your graphql server
      } as any),
      ssrMode: true
    });
    const context = {};
    const SApp = (
      <ApolloProvider client={client}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </ApolloProvider>
    );

    renderToStringWithData(SApp).then((content) => {
      res.status(200);
      const initialState = client.extract();

      const html = (
        <Html content={content} state={initialState} assets={assets} />
      );

      res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
      res.end();
    });
  });

export default server;
