import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import path from 'path';
import React from 'react';

import App from './App';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

let statsFile;
let extractor;

if (process.env.NODE_ENV === 'production') {
  console.log('reading statsfile for PROD');
  statsFile = path.resolve('./build/public/loadable-stats.json');
  extractor = new ChunkExtractor({ statsFile, entrypoints: ['client'] });
}

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const app = (
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('reading statsfile for DEV');
      statsFile = path.resolve('./build/public/loadable-stats.json');
      extractor = new ChunkExtractor({ statsFile, entrypoints: ['client'] });
    }
    const jsx = extractor.collectChunks(app);
    const markup = renderToString(jsx);
    const scriptTags = extractor.getScriptTags();
    console.log('scriptTags', scriptTags);

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
        ${scriptTags}
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      );
    }
  });

export default server;
