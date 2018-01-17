import App from './_app';
import routes from './_routes';
import Doc from './_document';
import loadInitialProps from './loadInitialProps';
import React from 'react';
import url from 'url';
import Helmet from 'react-helmet';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

const modPageFn = Page => props => <Page {...props} />;

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    try {
      const context = {};
      const data = await loadInitialProps(routes, url.parse(req.url).pathname, {
        req,
        res,
      });

      const renderPage = (fn = modPageFn) => {
        const html = ReactDOMServer.renderToString(
          <StaticRouter location={req.url} context={context}>
            {fn(App)({ routes, data: data[0] })}
          </StaticRouter>
        );
        const helmet = Helmet.renderStatic();
        return { html, helmet };
      };

      const { html, ...docProps } = await Doc.getInitialProps({
        req,
        res,
        assets,
        renderPage,
        data: data[0],
      });

      const doc = ReactDOMServer.renderToStaticMarkup(<Doc {...docProps} />);
      res.send(
        `<!doctype html>` +
          doc.replace('DO_NOT_DELETE_THIS_YOU_WILL_BREAK_YOUR_APP', html)
      );
    } catch (error) {
      res.json(error);
    }
  });

export default server;
