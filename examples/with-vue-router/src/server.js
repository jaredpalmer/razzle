import express from 'express';
import history from 'connect-history-api-fallback';

import { createVueApp } from './App';

const renderer = require('vue-server-renderer').createRenderer();
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(history()) // vue-router's history mode
  .get('*', async (req, res) => {
    const { app, router } = createVueApp();

    // Set server-side router's location
    router.push(req.originalUrl).catch(err => {});

    // wait until the router has resolved possible async components and hooks
    router.onReady(async () => {
      const vueMarkup = await renderer.renderToString(app);

      res.status(200).send(
        `<!doctype html>
          <html lang="en">
            <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              <title>Welcome to Razzle</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />

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
              <div id="app">
                ${vueMarkup}
              </div>
            </body>
          </html>
        `
      );
    });
  });

export default server;
