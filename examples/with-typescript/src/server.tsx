import express from 'express';
import * as path from 'path';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from './App';

// tslint:disable-next-line:no-var-requires
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST as any);
const server = express();

server
  .disable('x-powered-by')
  // Setup the public directory so that we can server static assets.
  .use(
    express.static(
      process.env.NODE_ENV === 'production'
        ? path.join(__dirname, '../build/public')
        : 'public',
      {
        maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
        setHeaders(res: any, _path: any, _stat: any) {
          res.set('Access-Control-Allow-Origin', '*');
          res.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
          res.set(
            'Access-Control-Allow-Headers',
            'Content-type,Accept,X-Access-Token,X-Key'
          );
        },
      }
    )
  );

server.get('/*', (req: express.Request, res: express.Response) => {
  const context = {};
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>
  );
  res.send(
    `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Razzle TypeScript</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="${assets['client.css']}">
        <script defer crossorigin src="${assets['client.js']}"></script>
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
  );
});

export default server;
