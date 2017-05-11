import * as http from 'http';
import app from './server';

const server = http.createServer(app);

let currentApp = app;

server.listen(process.env.PORT || 3000);

if (module.hot) {
  console.info('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}