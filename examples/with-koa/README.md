# Using Razzle and Koa

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->Create and start the example:

```bash
npx create-razzle-app --example with-koa with-koa

cd with-koa
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example

This is an example of how to use [Koa][koa], a popular web application framework, with a Razzle project, as an alternative to the default [Express][express] `server.js` setup.

Being minimalistic in its philosophy, [Koa][koa] doesn't include most required dependencies to mimic its [Express][express] counterpart, so this example relies on some additional packages.

- `koa-static` ([docs][koa-static])

Static file serving middleware. Used to serve resources under `process.env.RAZZLE_PUBLIC_DIR`.

- `koa-router` ([docs][koa-router])

Express-styling router middleware for [Koa][koa]. Will direct `HTTP GET` requests to your React client.

- `koa-helmet` ([docs][koa-helmet])

Provides important security headers to make your app more secure by default. Among other things, it prevents the `X-Powered-By` header from [being sent to requesting clients][hide-powered-by].

---

For additional information, refer to [Koa offical documentation][koa-docs].

[razzle-repo]: https://github.com/jaredpalmer/razzle.git
[koa]: http://koajs.com
[express]: https://expressjs.com/
[koa-static]: https://github.com/koajs/static
[koa-router]: https://github.com/alexmingoia/koa-router
[koa-helmet]: https://github.com/venables/koa-helmet
[hide-powered-by]: https://helmetjs.github.io/docs/hide-powered-by/
[koa-docs]: https://github.com/koajs/koa/tree/master/docs
