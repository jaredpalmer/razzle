import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './features/App';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST || '');

const scripts = Object.keys(assets).map((key) => {
  const script = assets[key].js;

  if (Array.isArray(script)) {
    return script
      .map((item) => {
        return `<script src="${item}" defer crossorigin></script>`;
      })
      .join('');
  }

  return `<script src="${script}" defer crossorigin></script>`;
});

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR || ''))
  .get('/*', (req, res) => {
    const context: { url?: string } = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to my website</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${scripts}
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      );
    }
  });

export default server;
