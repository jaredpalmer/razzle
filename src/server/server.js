import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.config.dev';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { trigger } from 'redial';
import React from 'react';
import { renderToString } from 'react-dom/server';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import useQueries from 'history/lib/useQueries';
import { Router, RoutingContext, match, createRoutes } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {callAPIMiddleware} from '../middleware/callAPIMiddleware';
import { StyleSheetServer } from 'aphrodite';
import { configureStore } from '../store';

// Your app's reducer and routes:
import reducer from '../reducers';
import genRoutes from '../routes/root';

// import oldRoutes from '../routes-old';

const isDeveloping = process.env.NODE_ENV != 'production';
const port = process.env.PORT || 5000;
const server = global.server = express();

server.disable('x-powered-by');
server.set('port', port);
server.use(helmet());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(morgan('dev'));

server.use('/api/v0/posts', require('./api/posts'));
server.use('/api/v0/post', require('./api/post'));

const redial = (path) => new Promise((resolve, reject) => {
  // Set up Redux (note: this API requires redux@>=3.1.0):
  const store = configureStore();

  // console.log(oldRoutes);
  const routes = genRoutes(store);

  // console.log(routes);

  const { dispatch } = store;

  // Set up history for router:
  const history = useQueries(createMemoryHistory)();
  const location = history.createLocation(path);

  // Match routes based on location object:
  match({ routes, history, location }, (routerError, redirectLocation, renderProps) => {
    // Get array of route components:
    // console.log(routes);
    // console.log(gen);
    try {
      const components = renderProps.routes.map(route => route.component);
      console.log(renderProps);

      // console.log(components);

      // Define locals to be provided to all fetcher functions:
      const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,

        // Allow fetcher functions to dispatch Redux actions:
        dispatch,
      };

      // Wait for async actions to complete, then render:
      trigger('fetch', components, locals)
        .then(() => {
          const state = store.getState();
          console.log('STATE:');
          console.log(state);
          const html = renderToString(
            <Provider store={store}>
              <RoutingContext {...renderProps} />
            </Provider>
          );

          console.log('HTML');
          console.log(html);

          resolve({ state, html });
        })
        .catch(e => {
          console.log(e);
          reject;
        });
    } catch (e) {
      console.log(e);
    }

  });
});

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: true,
      modules: false,
    },

  });
  server.use(middleware);

  server.use(webpackHotMiddleware(compiler, {
    log: console.log,
  }));
} else {
  server.use('/build/static', express.static(__dirname + '../../../build/static'));
}

server.get('*', (req, res) => {
  redial(req.path).then(result => {
    console.log(result);
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <title>React Starter</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="React Email Workflow." />

        </head>
        <body>
          <div id="root">${result.html}</div>
          <script>window.INITIAL_STATE = ${JSON.stringify(result.html)};</script>

          <script src="/build/static/common.js"></script>
          <script src="/build/static/main.js"></script>
        </body>
      </html>
      `);
  }).catch(e => console.log(e));
});

// UNCOMMENT to DISABLE ISOMORPHISM
// server.get('/', (req, res) => {
//   res.status(200).send(`
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
//         <title>React Starter</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <meta name="description" content="React Email Workflow." />
//       </head>
//       <body>
//         <div id="root"></div>
//         <script src="/build/static/common.js"></script>
//         <script src="/build/static/main.js"></script>
//       </body>
//     </html>
//     `);
// });

server.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.log(isDeveloping);
  console.info('==> 🌎 Listening on port %s.' +
    'Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

module.exports = server;
