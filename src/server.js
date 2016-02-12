import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config.dev';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { trigger } from 'redial';
import React from 'react';
import { renderToString } from 'react-dom/server';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import useQueries from 'history/lib/useQueries';
import { RoutingContext, match } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {callAPIMiddleware} from './middleware/callAPIMiddleware';
import { StyleSheetServer } from 'aphrodite';

// Your app's reducer and routes:
import reducer from './reducers';
import routes from './routes';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 5000 : process.env.PORT;
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
  const store = createStore(
    reducer,
    applyMiddleware(thunk, callAPIMiddleware)
  );
  const { dispatch } = store;

  // Set up history for router:
  const history = useQueries(createMemoryHistory)();
  const location = history.createLocation(path);

  // Match routes based on location object:
  match({ routes, location }, (routerError, redirectLocation, renderProps) => {
    // Get array of route components:
    const components = renderProps.routes.map(route => route.component);

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
        const data = store.getState();
        const { html, css } = StyleSheetServer.renderStatic(
        () => renderToString(
          <Provider store={store}>
            <RoutingContext {...renderProps} />
          </Provider>
        ));

        resolve({ data, html, css });
      })
      .catch(reject);
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
      chunkModules: false,
      modules: false,
    },
  });
  server.use(middleware);
  server.use(webpackHotMiddleware(compiler, {
    log: console.log,
  }));
} else {
  server.use('/static', express.static(__dirname + '/dist'));
}

server.get('*', (req, res) => {
  redial(req.path).then(result => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <title>React Starter</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="React Email Workflow." />
          <style data-aphrodite>${result.css.content}</style>
        </head>
        <body>
          <div id="root">${result.html}</div>
          <script>window.INITIAL_STATE = ${JSON.stringify(result.data)};</script>
          <script>window.renderedClassNames = ${JSON.stringify(result.css.renderedClassNames)};</script>
          <script src="/static/bundle.js"></script>
        </body>
      </html>
      `);
  });
});

server.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

module.exports = server;
