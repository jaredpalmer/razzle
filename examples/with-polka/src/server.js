import App from './App';
import React from 'react';
import polka from 'polka';
import serve from 'serve-static';
import { renderToString } from 'react-dom/server';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

export default polka()
  .use(serve(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const markup = renderToString(<App />);
    res.end(
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
         ${
           process.env.NODE_ENV === 'production'
             ? `<script src="${assets.client.js}" defer></script>`
             : `<script src="${assets.client.js}" defer crossorigin></script>`
         }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
    );
  }).handler;
