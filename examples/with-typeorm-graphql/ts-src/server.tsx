import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createConnection } from 'typeorm';
import { init_db } from './database/init_db';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from './App';

let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

const createserver = async() => {
  const connection = await createConnection();
  await init_db(connection);
  console.log('Database created.');
  //
  // const schema = await buildSchema({
  //   resolvers: [ Resolvers ],
  // });
  //
  // const apolloServer = new ApolloServer({ schema });
  // let server: express.Application = express()
  //   .disable('x-powered-by')
  // apolloServer.applyMiddleware({ app: server});

  server = server
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get('/*', (req: express.Request, res: express.Response) => {
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
  });
  return server;
};

export default createserver();
