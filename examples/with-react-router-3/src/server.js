import React from 'react';
import express from 'express';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';

import getRoutes from './routes';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR));

server.use((req, res) => {
  match(
    { routes: getRoutes(), location: req.url },
    (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        // You can also check renderProps.components or renderProps.routes for
        // your "not found" component or route respectively, and send a 404 as
        // below, if you're using a catch-all route.
        const context = {};
        const markup = renderToString(<RouterContext {...renderProps} />);

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
                    ${
                      assets.client.css
                        ? `<link rel="stylesheet" href="${assets.client.css}">`
                        : ''
                    }
                    ${
                      process.env.NODE_ENV === 'production'
                        ? `<script src="${assets.client.js}" defer></script>`
                        : `<script src="${
                            assets.client.js
                          }" defer crossorigin></script>`
                    }
                </head>
                <body>
                    <div id="root">${markup}</div>
                </body>
            </html>`,
          );
        }
      } else {
        res.status(404).send('Not found');
      }
    },
  );
});

export default server;
