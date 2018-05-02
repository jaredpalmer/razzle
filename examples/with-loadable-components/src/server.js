import App from './App';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { getLoadableState } from 'loadable-components/server';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    // Render the app
    const app = <App />;

    // Gets the loadable state (list of loaded chunks)
    const loadableState = await getLoadableState(app);

    // Render to html markup
    const markup = renderToString(app);

    res.send(
      // prettier-ignore
      `<!doctype html>
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
  </head>
  <body>
      <div id="root">${markup}</div>
      ${loadableState.getScriptTag()}
      <script src="${assets.client.js}" crossorigin></script>
  </body>
</html>`
    );
  });

export default server;
