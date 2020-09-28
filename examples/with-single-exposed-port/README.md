# Razzle Single Exposed Port Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->Create and start the example:

```bash
npx create-razzle-app --example with-single-exposed-port with-single-exposed-port

cd with-single-exposed-port
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

Visit http://localhost:3001/ in the browser.

## Idea behind the example
This example demonstrates how to use a `razzle.config.js` file to modify Razzle's
underlying webpack devServer configuration to proxy the devServer to the express server.
It modifies the proxy of the devServer in dev (`razzle start`).

Note that this file is not transpiled, and so you must write it with vanilla
Node.js-compatible JavaScript.

```js
// razzle.config.js
'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    if (opts.env.target === 'web' && opts.env.dev) {
      config.devServer.proxy = {
        context: () => true,
        target: 'http://localhost:3000'
      };
      config.devServer.index = '';
    }

    return config;
  },
};
```

A bit more complex on a subpath behind a reverse nginx proxy:


```js
'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;


    if (target === 'web' && dev) {
      config.devServer.public = 'localhost:8080' // or 80 or 443
      config.devServer.proxy = {
        context: () => true,
        target: 'http://localhost:3000'
      };
      config.devServer.sockPath = '/razzle-dev/sockjs-node';
    }

    return config;
  },
};
```

```bash
CLIENT_PUBLIC_PATH=http://localhost:8080/razzle-dev/ yarn start
```

```nginxconf
http {

    server {
        listen       8080; # or 80 or 443
        server_name  _;
        location /razzle-dev { # no /, no regex
            return 302 /razzle-dev/; # a /
        }
        location /razzle-dev/ { # no regex
            proxy_pass   http://127.0.0.1:3001/; # a /
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
        }
        location /razzle-dev/sockjs-node/ { # no regex
            proxy_pass   http://127.0.0.1:3001; # no /
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```
