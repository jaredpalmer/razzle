import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import App from '../common/App';
import routes from '../common/routes';
import axios from 'axios';

const server = express();

server.get('/api', (req, res) => {
  res.send({
    message: 'I am a server route and can also be hot reloaded!',
  });
});

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
          promise: route.component.fetchData
            ? route.component.fetchData({ match, req, res, axios })
            : Promise.resolve(null),
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

      if (context.url) {
        res.redirect(context.url);
      } else {
        res.status(200).send(
          `<!doctype html>
    <html class="no-js" lang="">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>HMR all the things!</title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width,  initial-scale=1">
            <script src="http://localhost:3001/client.js" defer></script>
            
        </head>
        <body>
            <div id="root">${markup}</div>
            <script>window.DATA = ${JSON.stringify(data)};</script>
        </body>
    </html>`
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
