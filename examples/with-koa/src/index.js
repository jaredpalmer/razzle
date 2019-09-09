import http from 'http';
import os from 'os';

let app = require('./server').default;

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback
let currentHandler = app.callback();
const server = http.createServer(currentHandler);

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.log(error);
  }

  console.log(`🚀 started at: http://${getNetworkAddress()}:${process.env.PORT || 3000}`);
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      const newHandler = require('./server').default.callback();
      server.removeListener('request', currentHandler);
      server.on('request', newHandler);
      currentHandler = newHandler;
    } catch (error) {
      console.error(error);
    }
  });
}

function getNetworkAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interf of interfaces[name]) {
      const { address, family, internal } = interf;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
};