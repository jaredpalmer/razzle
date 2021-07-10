import Routes from "../common/Routes";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import { ApolloProvider, renderToStringWithData } from "react-apollo";
import { createClient } from "../lib/apollo";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", async (req, res) => {
    const context = {};
    const client = createClient();

    const markup = await renderToStringWithData(
      <ApolloProvider client={client}>
        <StaticRouter context={context} location={req.url}>
          <Routes />
        </StaticRouter>
      </ApolloProvider>
    );

    const initialApolloState = client.extract();
    
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
          <html lang="">
            <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              <title>Welcome to Razzle</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <meta name="Description" content="my ssr site with react">
              ${
                assets.client.css
                  ? `<link rel="stylesheet" href="${assets.client.css}">`
                  : ""
              }
              ${
                process.env.NODE_ENV === "production"
                  ? `<script src="${assets.client.js}" defer></script>`
                  : `<script src="${
                      assets.client.js
                    }" defer crossorigin></script>`
              }
            </head>
            <body>
              <div id="root">${markup}</div>
              <script>
              window.__APOLLO_STATE__ = ${JSON.stringify(
                initialApolloState
              ).replace(/</g, "\\u003c")}
            </script>
            </body>
          </html>`
      );
    }
  });

export default server;
