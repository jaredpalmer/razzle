import React from 'react';
import express, { Request, Response } from 'express';
import App from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);

const server = express();

server
    .disable('x-powered-by')
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
    .get('/*', (req: Request, res: Response) => {
        const context = {};
        const markup = renderToString(
            <StaticRouter context={context} location={req.url}>
                <App/>
            </StaticRouter>
        );
        res.send(
            `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Razzle TypeScript</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${assets.client.css
                ? `<link rel="stylesheet" href="${assets.client.css}">`
                : ''}
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
