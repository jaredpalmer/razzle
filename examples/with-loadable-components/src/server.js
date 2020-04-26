import App from "./App";
import React from "react";
import express from "express";
import { renderToString } from "react-dom/server";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import path from "path";

const server = express();

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", async (req, res) => {
    // We create an extractor from the statsFile
    const extractor = new ChunkExtractor({
      statsFile: path.resolve("build/loadable-stats.json"),
      // razzle client bundle entrypoint is client.js
      entrypoints: ["client"],
    });

    const markup = renderToString(
      <ChunkExtractorManager extractor={extractor}>
        <App />
      </ChunkExtractorManager>
    );

    // collect script tags
    const scriptTags = extractor.getScriptTags();

    // collect "preload/prefetch" links
    const linkTags = extractor.getLinkTags();

    // collect style tags
    const styleTags = extractor.getStyleTags();

    res.send(
      // prettier-ignore
      `<!doctype html>
<html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${linkTags}
      ${styleTags}
  </head>
  <body>
      <div id="root">${markup}</div>
      ${scriptTags}
  </body>
</html>`
    );
  });

export default server;
