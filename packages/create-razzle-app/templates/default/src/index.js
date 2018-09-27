import http from 'http';

let app = require('./server').default;

const server = http.createServer(app);

let currentApp = app;

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  const noErrors = () => {
    try {
      require('./server').default;
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  module.hot.accept('./server', () => {
    if (noErrors()) {
      console.log('🔁  HMR Reloading `./server`...');
      server.removeListener('request', currentApp);
      app = require('./server').default;
      server.on('request', app);
      currentApp = app;
    }
  });
}
