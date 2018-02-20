# Razzle JSXStyle Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-jsxstyle
cd with-jsxstyle
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example

This is demo shows how to use [JSXXtyle](https://github.com/smyte/jsxstyle) and the new server rendering API
with Razzle. On each request, JSXStyle will extract out styles into a variable called `styles` will all the critical CSS in the render
tree that we can then just drop into our `<head>`

```js
import { injectAddRule, resetCache } from 'jsxstyle/lib/styleCache';

// ..

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    resetCache();
    let styles = '';
    const context = {};
    injectAddRule(rule => (styles += rule + '\n'));

    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">${styles || ''}</style>
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        <script src="${assets.client.js}" defer></script>
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      );
    }
  });
```
