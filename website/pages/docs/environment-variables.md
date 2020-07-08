# Environment Variables

## Build-time Variables

**The following environment variables are embedded during the build time.**

- `process.env.RAZZLE_PUBLIC_DIR`: Absolute path to the public directory in the server's filesystem.
- `process.env.RAZZLE_CHUNKS_MANIFEST`: Path to a file containing compiled chunk outputs
- `process.env.RAZZLE_ASSETS_MANIFEST`: Path to a file containing compiled asset outputs
- `process.env.REACT_BUNDLE_PATH`: Relative path to where React will be bundled during development. Unless you are modifying the output path of your webpack config, you can safely ignore this. This path is used by `react-error-overlay` and webpack to power up the fancy runtime error iframe. For example, if you are using common chunks and an extra entry to create a vendor bundle with stuff like react, react-dom, react-router, etc. called `vendor.js`, and you've changed webpack's output to `[name].js` in development, you'd want to set this environment variable to `/static/js/vendor.js`. If you do not make this change, nothing bad will happen, you will simply not get the cool error overlay when there are runtime errors. You'll just see them in the console. Note: This does not impact production bundling.
- `process.env.VERBOSE`: default is false, setting this to true will not clear the console when you make edits in development (useful for debugging).
- `process.env.PORT`: The `BUILD_TARGET=server` build listens on this port for all NODE_ENVs. default is `3000`
- `process.env.HOST`: The IP address that the server will bind to. default is `0.0.0.0`, for INADDR_ANY
- `process.env.NODE_ENV`: `'development'` or `'production'`
- `process.env.BUILD_TYPE`: `'iso'` for isomorphic/universal applications or `'spa'` for single page applications. The default is `'iso'`. This is set by CLI arguments.
- `process.env.BUILD_TARGET`: either `'client'` or `'server'`
- `process.env.PUBLIC_PATH`: Only used in `razzle build`. You can alter the `webpack.config.output.publicPath` of the client assets (bundle, css, and images). This is useful if you plan to serve your assets from a CDN. Make sure to _include_ a trailing slash (e.g. `PUBLIC_PATH=https://cdn.example.com/`). If you are using React and altering the public path, make sure to also [include the `crossorigin` attribute](https://reactjs.org/docs/cdn-links.html#why-the-crossorigin-attribute) on your `<script>` tag in `src/server.js`.
- `process.env.CLIENT_PUBLIC_PATH`: The `NODE_ENV=development` build's `BUILD_TARGET=client` has a different `PUBLIC_PATH` than `BUILD_TARGET=server`. Default is `http://${process.env.HOST}:${process.env.PORT + 1}/`

You can create your own custom environment variables that will be inlined during the build. They must start
with `RAZZLE_`. Any other variables except the ones listed above will be ignored to avoid accidentally exposing a private key on the machine that could have the same name. Changing any environment variables will require you to restart the development server if it is running.

These environment variables will be defined for you on `process.env`. For example, having an environment variable named `RAZZLE_SECRET_CODE` will be exposed in your JS as `process.env.RAZZLE_SECRET_CODE`.

## Runtime Variables

Using the dotenv package, or by defining variables in your shell (see below), you can get access to runtime environment variables. This is useful for services like Heroku which dynamically set `process.env.PORT` for example. Be careful when referencing runtime variables in isomorphic code as they will be `undefined` in the browser, but defined when running in Node. This can lead to weird behavior. If you need to make runtime variables available to the browser, it is up to you to deliver them. You can stringify them and place them on `window`...

```js
// config.js
export const runtimeConfig =
  typeof window !== 'undefined'
    ? {
        // client
        myThing: window.env.myThing,
        anotherThing: window.env.anotherThing,
      }
    : {
        // server
        myThing: process.env.MY_THING,
        anotherThing: process.env.ANOTHER_THING,
      };
```

Now we set `window.env` as `runtimeConfig` when we go to render the HTML.

```js
import App from './App';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript'; // Safer stringify, prevents XSS attacks
import { runtimeConfig } from './config';
const chunks = require(process.env.RAZZLE_CHUNKS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const markup = renderToString(<App />);
    res.send(
      // prettier-ignore
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${chunks.client.css.map(path => `<link rel="stylesheet" href="${path}">`)} 
    </head>
    <body>
        <div id="root">${markup}</div> 
        <script>window.env = ${serialize(runtimeConfig)};</script>
        ${chunks.client.js.map(path => `<script src="${path}" defer crossorigin></script>`)}        
    </body>
</html>`
    );
  });

export default server;
```

## Adding Temporary Environment Variables In Your Shell

Defining environment variables can vary between OSes. It’s also important to know that this manner is temporary for the
life of the shell session.

### Windows (cmd.exe)

```cmd
set RAZZLE_SECRET_CODE=abcdef&&npm start
```

(Note: the lack of whitespace is intentional.)

### Linux, macOS (Bash)

```bash
RAZZLE_SECRET_CODE=abcdef npm start
```

## Adding Environment Variables In .env

To define permanent environment variables, create a file called .env in the root of your project:

```
RAZZLE_SECRET_CODE=abcdef
```

## Expanding Environment Variables In .env

Expand variables already on your machine for use in your `.env` file.

For example, to get the environment variable `npm_package_version`:

```
RAZZLE_VERSION=$npm_package_version
# also works:
# RAZZLE_VERSION=${npm_package_version}
```

Or expand variables local to the current `.env` file:

```
DOMAIN=www.example.com
RAZZLE_FOO=$DOMAIN/foo
RAZZLE_BAR=$DOMAIN/bar
```

### What other .env files are can be used?

- `.env`: Default.
- `.env.local`: Local overrides. **This file is loaded for all environments except test.**
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Files on the left have more priority than files on the right:

- `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
- `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
- `npm test`: `.env.test.local`, `.env.test`, `.env` (note `.env.local` is missing)

These variables will act as the defaults if the machine does not explicitly set them.<br/>
Please refer to the [dotenv documentation](https://github.com/motdotla/dotenv) for more details.

> Note: If you are defining environment variables for development, your CI and/or hosting platform will most likely need
> these defined as well. Consult their documentation how to do this. For example, see the documentation for [Travis CI](https://docs.travis-ci.com/user/environment-variables/) or [Heroku](https://devcenter.heroku.com/articles/config-vars).
