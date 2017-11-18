import * as http from 'http';

import app from './server';

const server = http.createServer(app as any);

let currentApp = app;

server.listen(process.env.PORT || 3000, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log('started');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
