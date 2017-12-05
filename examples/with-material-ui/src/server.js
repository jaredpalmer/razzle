import App from './App';
import React from 'react';
import express from 'express';
import theme from './theme';
import jss from './styles';
import { SheetsRegistry } from 'react-jss';
import { JssProvider } from 'react-jss';
import { MuiThemeProvider } from 'material-ui/styles';
import { renderToString } from 'react-dom/server';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // This is needed in order to deduplicate the injection of CSS in the page.
    const sheetsManager = new WeakMap();
    // This is needed in order to inject the critical CSS.
    const sheetsRegistry = new SheetsRegistry();
    const markup = renderToString(
      <JssProvider registry={sheetsRegistry} jss={jss}>
        <MuiThemeProvider sheetsManager={sheetsManager} theme={theme}>
          <App />
        </MuiThemeProvider>
      </JssProvider>
    );
    const css = sheetsRegistry.toString();
    res.send(
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500">
        ${assets.client.css
          ? `<link rel="stylesheet" href="${assets.client.css}">`
          : ''}
        ${css ? `<style id='jss-ssr'>${css}</style>` : ''}
         ${process.env.NODE_ENV === 'production'
           ? `<script src="${assets.client.js}" defer></script>`
           : `<script src="${assets.client.js}" defer crossorigin></script>`}
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
    );
  });

export default server;
