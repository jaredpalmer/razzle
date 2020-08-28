import App from "./App";
import React from "react";
import express from "express";
import { renderToString } from "react-dom/server";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const scripts = Object.keys(assets)
  .map((key) => {
    const script = assets[key].js;

    if (typeof script === 'undefined' || script === null) {
      return null;
    }

    if (Array.isArray(script)) {
      return script
        .map((item) => {
          return `<script src="${item}"></script>`;
        })
        .join('');
    }

    return `<script src="${script}"></script>`;
  })
  .filter((a) => typeof a !== 'undefined' || a !== null);


const server = express();

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", (req, res) => {
    const markup = renderToString(<App />);
    res.send(
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${scripts.join('\n')}
      </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
    );
  });

export default server;
