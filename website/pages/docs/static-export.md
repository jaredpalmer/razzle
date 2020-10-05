### What is Static Site Generation (SSG)?

Think of a static site generator as a script which takes in data, content and templates, processes them, and outputs a folder full of all the resultant pages and assets.

### How To Enable SSG:

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

### How Razzle SSG Wroks?

basicly in SSG proccess we SSR the app and then we save result of the SSR into a html file, so if you enable SSR you can also have SSG.

### Can I use Razzle SSG with X?

Razzle not only works with React, but also Reason, Elm, Vue, Angular, Svelte, and most importantly......whatever comes next

#### render()

behind the scenes razzle calls `render` function that exposed from `static_export` module and saves `html` string that you pass to `res.json()` into a html file. for `req` object there is only one property that is `url` which contains the url that we are going to render and save it's result to the html file.

#### routes()

you should also export a function called `routes` that returns an array of strings or a promise that will resolve array of strings. razzle will take the urls one by one and pass them one by one to `render`.

html file destination is relative to the `req.url`, for example if the url is `/product/A` html is going to get saved at `/build/product/A/index.html`.

#### page data

you may also need to save the data that your page uses to rehydrate the app on the client side.
you can also pass the `data` along the `html` to `res.json({ html, data })` and contents of data object will go inside the `page-data.json` file next to the html file.

### TypeScript Support

Static export comes with typescript support out of the box, in order to use typescript rename `static_export.js` to `static_export.ts` and you are good to go! 

### Advanced Configuration

```js
// razzle.config.js

module.exports = {
  experimental: {
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
