import App from './App';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

const chunks = require(process.env.RAZZLE_CHUNKS_MANIFEST);

const server = express();

export const renderApp = (req, res) => {
  const context = {};
  const markup = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const html =
    // prettier-ignore
    `<!doctype html>
  <html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${
      chunks.client.css
        ? chunks.client.css.map(css=>`<link rel="stylesheet" href="${css}">`).join('')
        : ''
      }
  </head>
  <body>
      <div id="root">${markup}</div>
      ${
      chunks.client.js
        ? chunks.client.js.filter(js=>/\.js$/.test(js))
          .map(js=>`<script src="${js}" defer crossorigin></script>`).join('')
        : ''
      }
  </body>
</html>`;

  return { html, context };
};

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const { html, context } = renderApp(req, res);

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      return res.redirect(301, context.url);
    }

    res.send(html);
  });

export default server;
