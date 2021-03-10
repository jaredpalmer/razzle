import express from 'express';
import history from 'connect-history-api-fallback';

import { createVueApp } from './App';

const renderer = require('vue-server-renderer').createRenderer();

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint] ? assets[entrypoint].css ?
  assets[entrypoint].css.map(asset=>
    `<link rel="stylesheet" href="${asset}">`
  ).join('') : '' : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') => {
  return assets[entrypoint] ? assets[entrypoint].js ?
  assets[entrypoint].js.map(asset=>
    `<script src="${asset}"${extra}></script>`
  ).join('') : '' : '';
};

export const renderApp = async (req, res) => {
  return new Promise((resolve)=>{

    const { app, router } = createVueApp();

    // Set server-side router's location
    router.push(req.originalUrl).catch(err => {});

    // wait until the router has resolved possible async components and hooks
    router.onReady(async () => {
      const vueMarkup = await renderer.renderToString(app);

      const html =
        // prettier-ignore
        `<!doctype html>
      <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet='utf-8' />
          <title>Welcome to Razzle</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${cssLinksFromAssets(assets, 'client')}
      </head>
      <body>
      <div id="app">${vueMarkup}</div>
          ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
      </body>
    </html>`;

      resolve({ html });
    });
  });
};

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const { html } = await renderApp(req, res);
    res.send(html);
  });

export default server;
