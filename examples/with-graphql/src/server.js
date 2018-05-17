import App from './App'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import express from 'express'
import { renderToString } from 'react-dom/server'
import 'isomorphic-fetch'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'

import configureStore from './store/configureStore'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {}
    const initialState = {}
    const store = configureStore(initialState)
    const state = store.getState()

    const client = new ApolloClient({
      link: createHttpLink({
        fetch: fetch,
        uri: 'https://api.graphloc.com/graphql',
        credentials: 'same-origin'
      }),
      cache: new InMemoryCache(),
      ssrMode: true
    })

    const markup = renderToString(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <StaticRouter context={context} location={req.url}>
            <App />
          </StaticRouter>
        </Provider>
      </ApolloProvider>
    )

    if (context.url) {
      res.redirect(context.url)
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${assets.client.css
          ? `<link rel="stylesheet" href="${assets.client.css}">`
          : ''}
        ${process.env.NODE_ENV === 'production'
          ? `<script src="${assets.client.js}" defer></script>`
          : `<script src="${assets.client.js}" defer crossorigin></script>`}
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      )
    }
  })

export default server
