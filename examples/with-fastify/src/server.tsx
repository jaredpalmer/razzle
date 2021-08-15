import fastify from "fastify";
import fastifyStatic from "fastify-static";
import type { IncomingMessage, ServerResponse } from "http";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

let assetsImport: Record<string, any>;
import(process.env.RAZZLE_ASSETS_MANIFEST!).then((res) => {
  assetsImport = res.default;
});

const cssLinksFromAssets = (assets: Record<string, any>, entryPoint: string) =>
  (assets && assets[entryPoint]?.css?.map((asset: string) => `<link rel="stylesheet" href="${asset}">`).join("")) || "";

const jsScriptTagsFromAssets = (assets: Record<string, any>, entryPoint: string, extra = "") =>
  (assets && assets[entryPoint]?.js.map((asset: string) => `<script src="${asset}"${extra}></script>`).join("")) || "";

const app = fastify()
  .register(fastifyStatic, { root: process.env.RAZZLE_PUBLIC_DIR!, prefix: "/public" })
  .get("/*", async (req, res) => {
    const context: { url?: string } = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>,
    );

    if (context.url) {
      return res.redirect(context.url);
    }
    res
      .status(200)
      .type("text/html")
      .send(
        `
        <!doctype html>
        <html lang="en-GB">
          <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              <title>Welcome to Razzle</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              ${cssLinksFromAssets(assetsImport, "client")}
          </head>
          <body>
              <div id="root">${markup}</div>
              ${jsScriptTagsFromAssets(assetsImport, "client", " defer crossorigin")}
          </body>
        </html>
`,
      );
  });

/**
 * This is a similar implementation to the one found in the Fastify docs,
 * which can be found [here]{@link https://www.fastify.io/docs/latest/Serverless/#should-you-use-fastify-in-a-serverless-platform#Vercel}.
 * The `app#ready()` is to indicate that all plugins have been loaded and the server is ready,
 * then the `app#server#emit()` method is called to handle the incoming request and Fastify handles it from there.
 */
export default async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  await app.ready();
  app.server.emit("request", req, res);
};
