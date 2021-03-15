import App from './App';

import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native';


const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

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

export const renderApp = (req, res) => {

  // register the app
  AppRegistry.registerComponent('App', () => App);

  // prerender the app
  const { element, getStyleElement } = AppRegistry.getApplication('App', {});
  // first the element
  const markup = ReactDOMServer.renderToString(element);
  // then the styles
  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

  const html =
    // prettier-ignore
    `<!doctype html>
  <html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${css}
  </head>
  <body>
      <div id="root">${markup}</div>
      ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
  </body>
</html>`;

  return { html };
};

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const { html } = renderApp(req, res);
    res.send(html);
  });

export default server;
