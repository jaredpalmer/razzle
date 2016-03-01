import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.config.dev';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';

import React from 'react';
import ReactDOM from 'react-dom/server';
import { createMemoryHistory, RouterContext, match } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { trigger } from 'redial';
import { callAPIMiddleware } from '../middleware/callAPIMiddleware';
import { StyleSheetServer } from 'aphrodite';
import { configureStore } from '../store';
import Helm from 'react-helmet'; // because we are already using helmet
import reducer from '../createReducer';
import createRoutes from '../routes/root';

const isDeveloping = process.env.NODE_ENV == 'development';
const port = process.env.PORT || 5000;
const server = global.server = express();

// Security
server.disable('x-powered-by');
server.set('port', port);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(hpp());
server.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'"],
  imgSrc: ["'self'"],
  connectSrc: ["'self'", 'ws:'],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'none'"],
  frameSrc: ["'none'"],
}));
server.use(helmet.xssFilter());
server.use(helmet.frameguard('deny'));
server.use(helmet.ieNoOpen());
server.use(helmet.noSniff());
server.use(cookieParser());
server.use(compression());

// API
server.use('/api/v0/posts', require('./api/posts'));
server.use('/api/v0/post', require('./api/post'));

// Stub for assets, in case running in dev mode.
let assets;

// Webpack (for development)
if (isDeveloping) {
  server.use(morgan('dev'));
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
  const buildPath = require('../../webpack.config.prod').output.path;
  assets = require('../../assets.json');
  server.use(morgan('combined'));
  server.use('/build/static', express.static(buildPath));
}

// Render Document (include global styles)
const renderFullPage = (data, initialState, assets) => {
  const head = Helm.rewind();

  // Included are some solid resets. Feel free to add normalize etc.
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
         ${head.title.toString()}
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         ${head.meta.toString()}
         ${head.link.toString()}
         <style>

           html {
             box-sizing: border-box;
           }

           *,
           *::before,
           *::after {
             box-sizing: border-box;
           }

           @at-root {
             @-moz-viewport      { width: device-width; }
             @-ms-viewport       { width: device-width; }
             @-o-viewport        { width: device-width; }
             @-webkit-viewport   { width: device-width; }
             @viewport           { width: device-width; }
           }

           html {
           	font-size: 100%;
           	-ms-overflow-style: scrollbar;
           	-webkit-tap-highlight-color: rgba(0,0,0,0);
           	height: 100%;
           }

           body {
           	font-size: 1rem;
            background-color: #fff;
           	color: #555;
           	-webkit-font-smoothing: antialiased;
             -moz-osx-font-smoothing: grayscale;
           	font-family: -apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,sans-serif;
           }

           [tabindex="-1"]:focus {
             outline: none !important;
           }

           /* Typography */

           h1, h2, h3, h4, h5, h6 {
             margin: 0;
             letter-spacing: -0.03em;
             font-weight: bold;
           }

           p {
             margin: 0;
           }

           abbr[title],
           abbr[data-original-title] {
             cursor: help;
             border-bottom: 1px dotted #eee;
           }

           address {
             margin-bottom: 1rem;
             font-style: normal;
             line-height: inherit;
           }

           ol,
           ul,
           dl {
             margin-top: 0;
             margin-bottom: 1rem;
           }

           ol ol,
           ul ul,
           ol ul,
           ul ol {
             margin-bottom: 0;
           }

           dt {
             font-weight: bold;
           }

           dd {
             margin-bottom: .5rem;
             margin-left: 0;
           }

           blockquote {
             margin: 0 0 1rem;
           }

           /* Links */
           a,
           a:hover,
           a:focus {
           	text-decoration: none;
           }


           /* Code */
           pre {
             margin: 0;
             /*margin-bottom: 1rem;*/
           }
           /* Figures & Images */
           figure {
             margin: 0 0 1rem;
           }

           img {
           	vertical-align: middle;
           }

           [role="button"] {
             cursor: pointer;
           }

           a,
           area,
           button,
           [role="button"],
           input,
           label,
           select,
           summary,
           textarea {
             touch-action: manipulation;
           }

           /* Forms */

           label {
           	display: inline-block;
           	margin-bottom: .5rem;
           }

           button:focus {
             outline: 1px dotted;
             outline: 5px auto -webkit-focus-ring-color;
           }

           input,
           button,
           select,
           textarea {
             margin: 0;
             line-height: inherit;
             border-radius: 0;
           }

           textarea {
             resize: vertical;
           }

           fieldset {
             min-width: 0;
             padding: 0;
             margin: 0;
             border: 0;
           }

           legend {
             display: block;
             width: 100%;
             padding: 0;
             margin-bottom: .5rem;
             font-size: 1.5rem;
             line-height: inherit;
           }

           input[type="search"],
           input[type="text"],
           textarea {
             box-sizing: inherit;
             -webkit-appearance: none;
           }

           [hidden] {
             display: none !important;
           }

           body,
           button,
           input,
           textarea {
             font-family: font-family: 'Helvetica Neue', Helvetica, sans-serif;;
           }

           a,a:visited {
             text-decoration: none;
           }
         </style>
         <style data-aphrodite>${data.css.content}</style>
      </head>
      <body>
        <div id="root">${data.html}</div>
        <script>window.renderedClassNames = ${JSON.stringify(data.css.renderedClassNames)};</script>
        <script>window.INITIAL_STATE = ${JSON.stringify(initialState)};</script>
        <script src="${ isDeveloping ? '/build/static/vendor.js' : assets.vendor.js}"></script>
        <script src="${ isDeveloping ? '/build/static/main.js' : assets.main.js}"></script>
      </body>
    </html>
  `;
};

// SSR Logic
server.get('*', (req, res) => {
  const store = configureStore();
  const routes = createRoutes(store);
  const history = createMemoryHistory(req.path);
  const { dispatch } = store;
  match({ routes, history }, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    if (!renderProps)
      return res.status(404).send('Not found');

    const { components } = renderProps;

    // Define locals to be provided to all lifecycle hooks:
    const locals = {
     path: renderProps.location.pathname,
     query: renderProps.location.query,
     params: renderProps.params,

     // Allow lifecycle hooks to dispatch Redux actions:
     dispatch,
   };

    trigger('fetch', components, locals)
      .then(() => {
        const initialState = store.getState();
        const InitialView = (
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );

        // just call html = ReactDOM.renderToString(InitialView)
        // to if you don't want Aphrodite. Also change renderFullPage
        // accordingly
        const data = StyleSheetServer.renderStatic(
            () => ReactDOM.renderToString(InitialView)
        );
        res.status(200).send(renderFullPage(data, initialState, assets));
      })
      .catch(e => console.log(e));
  });
});

// Listen
server.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Listening on port %s.' +
    'Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

module.exports = server;
