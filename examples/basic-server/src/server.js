import App from './App';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';


export const renderApp = (req, res) => {
  const markup = renderToString(<App />);

  const html =
    // prettier-ignore
    `<!doctype html>
  <html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
      <div id="root">${markup}</div>
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
