import path from 'path'
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import compression from 'compression'

import React from 'react'
import ReactDOM from 'react-dom/server'
import { createMemoryHistory, RouterContext, match } from 'react-router'
import { Provider } from 'react-redux'
import { trigger } from 'redial'
import { StyleSheetServer } from 'aphrodite'
import { configureStore } from '../common/store'
import Helm from 'react-helmet' // because we are already using helmet
import reducer from '../common/createReducer'
import createRoutes from '../common/routes/root'

const __PROD__ = process.env.NODE_ENV === 'production'
const __TEST__ = process.env.NODE_ENV === 'test'
const port = process.env.PORT || 5000
const server = express()

server.disable('x-powered-by')
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
let assets

if (__PROD__ || __TEST__) {
  const config = require('../tools/webpack.client.prod')
  assets = require('../assets.json')
  server.use(morgan('combined'))
  server.use(helmet())
  server.use(compression())
  server.use(config.output.publicPath, express.static(config.output.path))
} else {
  server.use(morgan('dev'))
  const config = require('../tools/webpack.client.dev')
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const compiler = webpack(config)
  const middleware = webpackDevMiddleware(compiler, {
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: true,
      modules: false
    }
  })
  server.use(middleware)
  server.use(webpackHotMiddleware(compiler, {
    log: console.log
  }))
}

server.use('/api/v0/posts', require('./api/posts'))


server.get('*', (req, res) => {
  const store = configureStore({
    sourceRequest: {
      protocol: req.headers['x-forwarded-proto'] || req.protocol,
      host: req.headers.host
    }
  })
  const routes = createRoutes(store)
  const history = createMemoryHistory(req.path)
  const { dispatch } = store

  match({ routes, history}, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Internal server error')
    }

    if (!renderProps) {
      return res.status(404).send('Not found')
    }

    const { components } = renderProps

    // Define locals to be provided to all lifecycle hooks:
    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,

      // Allow lifecycle hooks to dispatch Redux actions:
      dispatch
    }

    trigger('fetch', components, locals)
      .then(() => {
        const initialState = store.getState()
        const InitialView = (
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        )

        // just call html = ReactDOM.renderToString(InitialView)
        // to if you don't want Aphrodite. Also change renderFullPage
        // accordingly
        const data = StyleSheetServer.renderStatic(
          () => ReactDOM.renderToString(InitialView)
        )
        const head = Helm.rewind()
        res.status(200).send(`
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
                  box-sizing: border-box
                }

                *,
                *::before,
                *::after {
                  box-sizing: border-box
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

                h1,h2,h3,h4,h5,h6 {
                  margin: 0;
                  padding: 0;
                }
              </style>
              <style data-aphrodite>${data.css.content}</style>
            </head>
            <body>
              <div id="root">${data.html}</div>
              <script>window.renderedClassNames = ${JSON.stringify(data.css.renderedClassNames)};</script>
              <script>window.INITIAL_STATE = ${JSON.stringify(initialState)};</script>
              <script src="${ __PROD__ ? assets.vendor.js : '/vendor.js' }"></script>
              <script async src="${ __PROD__ ? assets.main.js : '/main.js' }" ></script>
            </body>
          </html>
        `)
      }).catch(e => console.log(e))
  })

})

console.log(__PROD__)
// Listen
server.listen(port, '0.0.0.0', function onStart (err) {
  if (err) {
    console.log(err)
  }

  console.info('==> 🌎 Listening on port %s.' +
    'Open up http://0.0.0.0:%s/ in your browser.', port, port)
})

module.exports = server
