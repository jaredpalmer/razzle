import App from './App';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const public_path = process.env.NODE_ENV === 'development' ? '' : process.env.LOCAL_PUBLIC_PATH||process.env.PUBLIC_PATH;;

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint] ? assets[entrypoint].css ?
  assets[entrypoint].css.map(asset=>
    `<link rel="stylesheet" href="${public_path}${asset}">`
  ).join('') : '' : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') => {
  return assets[entrypoint] ? assets[entrypoint].js ?
  assets[entrypoint].js.map(asset=>
    `<script src="${public_path}${asset}"${extra}></script>`
  ).join('') : '' : '';
};

export const renderApp = (req, res) => {
  const markup = renderToString(<App />);

  const html =
    // prettier-ignore
    `<!doctype html>
  <html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"><script type="text/javascript">
          window.LOCAL_PUBLIC_PATH = '${__webpack_public_path__}';
      </script>
      ${cssLinksFromAssets(assets, 'client')}
  </head>
  <body>
      <div id="root">${markup}</div>
      ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
  </body>
</html>`;

  return { html };
};

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const { html } = renderApp(req, res);
    res.send(html);
  });

export default server;
