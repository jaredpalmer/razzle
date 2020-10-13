# Static Site Generation

## What is Static Site Generation (SSG)?

Think of a static site generator as a script which takes in data, content and templates, processes them, and outputs a folder full of all the resultant pages and assets.

## How To Enable SSG:

Add `export` to your `package.json`'s scripts like so:

```diff
"scripts": {
+  "export": "razzle export",
}
```

Add a `static_export.js` to your src dir:

```js
// ./src/static_export.js

import { renderApp } from './server';

export const render = (req, res) => {
  const { html } = renderApp(req, res);

  res.json({ html });
};

export const routes = () => {
  return ['/', '/about'];
};
```

Run `npm export` or `yarn export`:

Renders a static version of specified routes to the build folder based on the built production app.
Your prerendered app is ready to be served!

## How Razzle SSG Works?

Basically in the SSG proccess we SSR the app and then save result of the SSR into a html file, so if you enable SSR you can also have SSG.

## Can I use Razzle SSG with X?

Razzle not only works with React, but also Reason, Elm, Vue, Angular, Svelte, and most importantly......whatever comes next

#### render()

Behind the scenes razzle calls a `render` function that is exposed from `static_export` module and saves a html string that you pass to `res.json()` into a html file. or `req` object there is only one property that is needed `url` which contains the url that we are going to render and save it's result to the html file.
The html file destination is relative to the `req.url`, for example if the url is `/product/A` html is going to get saved at `/build/product/A/index.html`.

You should call `renderToString()` (or what ever your framework gives you to do SSR) in this function and then pass the result to `res.json()`

```js
export const render = (req, res) => {
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
  );

  res.json({ html });
};
```

(You can re-export your SRR logic from server.js file and use it `static_export`)

#### routes()

You should also export a function called `routes` that returns an array of strings or a promise that will resolve array of strings. razzle will take the urls and will pass them one by one to `render`.
You should get all paths that your app has from your CMS in this method and then return it:

```js
export const routes = async () => {
  // data should be an array of strings ["/", "/product/A", "/blog/1", "/blog/2"]
  const { data } = await getAppPaths();
  return data;
};
```

#### Page data

You may also need to save the data that your page uses to re-hydrate the app on the client side.
You can pass the `data` along the `html` to `res.json({ html, data })` and contents of `data` object will get saved in the `page-data.json` next to the related `index.html` file.

```js
export const render = async (req, res) => {
  const data = await getDataForRoute(req.url);

  const html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
  );

  res.json({ html, data });
};
```

(NOTE: You should change how your app fetches data on client-side, to read data from `page-data.json`)

## TypeScript Support

Static export comes with typescript support out of the box, in order to use typescript rename `static_export.js` to `static_export.ts` and you are good to go!

## Advanced Configuration

```js
// razzle.config.js

module.exports = {
  options: {
    staticExport: {
      parallel: 5, // how many pages to render at a time
      routesExport: 'routes',
      renderExport: 'render',
      scriptInline: false,
      windowRoutesVariable: 'RAZZLE_STATIC_ROUTES',
      windowRoutesDataVariable: 'RAZZLE_STATIC_DATA_ROUTES',
    },
  },
};
```
