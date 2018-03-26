import App from './App';
import React from 'react';
import { Capture } from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import stats from '../build/react-loadable.json';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const modules = [];
    const markup = renderToString(
      <Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Capture>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      const bundles = getBundles(stats, modules);
      const chunks = bundles.filter(bundle => bundle.file.endsWith('.js'));

      res.status(200).send(
        `<!doctype html>
<html lang="">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charSet='utf-8' />
    <title>Welcome to Razzle</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${assets.client.css
      ? `<link rel="stylesheet" href="${assets.client.css}">`
      : ''}
  </head>
  <body>
    <div id="root">${markup}</div>
    ${process.env.NODE_ENV === 'production'
      ? `<script src="${assets.client.js}"></script>`
      : `<script src="${assets.client.js}" crossorigin></script>`}
    ${chunks.map(chunk => (process.env.NODE_ENV === 'production'
      ? `<script src="/${chunk.file}"></script>`
      : `<script src="http://${process.env.HOST}:${parseInt(process.env.PORT, 10) + 1}/${chunk.file}"></script>`
    )).join('\n')}
    <script>window.main();</script>
  </body>
</html>`
      );
    }
  });

export default server;
