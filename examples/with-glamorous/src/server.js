import App from './App';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';

// Glamor SSR utilities
import { renderStatic } from 'glamor/server';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // Gather html, css and component ids
    const { html, css, ids } = renderStatic(() => renderToString(<App />));

    res.send(
      `
<!doctype html>
  <html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
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
          : `<script src="${assets.client.js}" defer crossorigin></script>`
      }

      <!-- Render style tags gathered from renderStatic into the DOM -->
      <style>${css}</style>
  </head>
  <body>
      <div id="root">${html}</div>
      <!-- Render glamorous ids for rehydration in client.js, for faster startup -->
      <script>window._glam=${JSON.stringify(ids)}</script>
  </body>
</html>`
    );
  });

export default server;
