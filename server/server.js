import 'source-map-support/register';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import StaticRouter from 'react-router-dom/StaticRouter';
import ReactHelmet from 'react-helmet';
import axios from 'axios';

import App from '../common/App';
import routes from '../common/routes';

const server = express();

// Remove annoying Express header addition.
server.disable('x-powered-by');

// Compress (gzip) assets in production.
server.use(compression());
server.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Setup server side routing.
server.get('*', (req, res) => {
  const context = {};
  const matches = routes.map(
    // we'd probably want some recursion here so our routes could have
    // child routes like `{ path, component, routes: [ { route, route } ] }`
    // and then reduce to the entire branch of matched routes, but for
    // illustrative purposes, sticking to a flat route config
    (route, index) => {
      const match = matchPath(req.url, route.path, route);
      if (match) {
        const obj = {
          route,
          match,
          promise: (
            route.component.fetchData
              ? route.component.fetchData({ match, req, res, axios })
              : Promise.resolve(null)
          )
        };
        return obj;
      }
      return null;
    }
  );

  if (matches.length === 0) {
    res.status(404).send('Not Found');
  }

  const promises = matches.map(match => match ? match.promise : null);

  Promise.all(promises)
    .then(data => {
      const context = {};
      const markup = renderToString(
        <StaticRouter context={context} location={req.url}>
          <App routes={routes} initialData={data} />
        </StaticRouter>
      );
      const head = ReactHelmet.rewind();

      if (context.url) {
        res.redirect(context.url);
      } else {
        res.status(200).send(
          `
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ${head.title.toString()}
          <script type="text/javascript" src="http://localhost:3001/client.js" defer></script>
        </head>
        <body>
          <div id="root"><div>${markup}</div></div>
          <script>window.DATA = ${JSON.stringify(data)};</script>
        </body>
      </html>
      `
        );
      }
    })
    .catch(
      e =>
        console.log(e) ||
          res.status(500).json({ error: error.message, stack: error.stack })
    );
});

export default server;
