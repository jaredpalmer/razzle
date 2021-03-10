import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import path from 'path';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { init_db } from './database/init_db';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Abilities, Pokemon, PokemonAbilities, Types } from './models';
import { Resolvers } from './schema';
import App from './App';

let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

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

export const renderApp = (req: express.Request, res: express.Response) => {
  const context = {};

  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>
  );

  if (context.url) {
    return { redirect: context.url };
  } else {
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
        <div id="root">${markup}</div>
        ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
    </body>
  </html>`;

    return { html };
  }
};

const createserver = async() => {
  const connection = await createConnection({
    type: "sqlite",
    database: path.join(process.cwd(), 'db.sqlite3'),
    synchronize: true,
    entities: [Abilities, Pokemon, PokemonAbilities, Types]
  });
  await init_db(connection);
  console.log('Database created.');

  const schema = await buildSchema({
    resolvers: [ Resolvers ],
  });

  const apolloServer = new ApolloServer({ schema });
  let server: express.Application = express()
    .disable('x-powered-by')
  apolloServer.applyMiddleware({ app: server});

  server = server
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get('/*', (req: express.Request, res: express.Response) => {
    const { html = '', redirect = false } = renderApp(req, res);
    if (redirect) {
      res.redirect(redirect);
    } else {
      res.send(html);
    }
  });
  return server;
};

export default createserver();
