# Deploy Razzle on Plesk

First make sure your Plesk install supports Node.js

Go into the domain manager for your domain. Look on the icons below next to `Hosting Settings` there should be a green icon with `Node.js`.

If this is not the case it may be disabled for you or not installed. Ask your host to enable it or install it like so:

Under home click `Add or Remove Components`.

Then click `Add/Remove Components` - Under `Web hosting` set `NodeJS support` and
`Phusion Passenger server` to `install` and click continue.

After you made sure your Plesk supports Node.js add razzle config.

```js
// razzle.config.js
'use strict';

module.exports = {
  options: {
    forceRuntimeEnvVars: ['HOST', 'PORT']
  }
};
```

Create `handler.js` in the app root

```js
// handler.js
module.exports = require('./build/server.js');
```

Build the Razzle project and make a tar archive

```bash
yarn build
tar czvf site.tar.gz build package.json handler.js
```

Go into `File Manager` for your domain on Plesk.

Create a `site` directory in the `Home directory` upload the site.tar.gz here and extract it.

Go into the domain manager for your domain. Click the `Node.js` icon.

Set `Document Root` to `/site/build/public`,  `Application Root` to `/site` and `Application Startup File` to `handler.js`.   

Then click `Enable Node.js` followed by `NPM Install` at the top.

Go into the domain manager for your domain. Click `Open in web`.
