import elmStaticHtml from "elm-static-html-lib";
import express from 'express';
require('./Main');

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const model = { counter: 5 };
const options = { model : model, decoder: "App.decodeModel" };

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
  return new Promise((resolve, reject) {
    elmStaticHtml(process.cwd(), "App.view", options)
    .then((markup) => {
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


      resolve({ html, status: 200 });
    }).catch((error) => {
      resolve({ html: `<h1>An error ocurred on server, please try later, or contact support</h1>`, status: 200 });
    });
  })
};


const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const { html, status } = await renderApp(req, res);
    res.status(status).send(html);
  });

export default server;
