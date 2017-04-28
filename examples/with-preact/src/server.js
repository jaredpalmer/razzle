import express from 'express';
import { h } from 'preact';
import render from 'preact-render-to-string';
import App from './App';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const markup = render(<App />);

    res.status(200).send(
      `<!doctype html>
    <html lang="">
    <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="${assets.client.js}" defer></script>
    </head>
    <body>
        ${markup}
    </body>
</html>`
    );
  });

export default server;
