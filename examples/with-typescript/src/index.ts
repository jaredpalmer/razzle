import * as http from 'http';

import app from './server';

const server = http.createServer(app);

let currentApp = app;

server.listen(process.env.PORT || 3000);

if (module.hot) {
  // tslint:disable-next-line
  console.info('✅  Server-side HMR Enabled!');
  module.hot.accept();
  module.hot.accept('./server', () => {
    // tslint:disable-next-line
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
