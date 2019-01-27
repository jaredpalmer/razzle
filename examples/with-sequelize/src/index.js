const serverImport = require('./server');

let server = serverImport.default;
let app = serverImport.app;
let preStart = serverImport.preStart;

let currentApp = app;

preStart(() => {
  server.listen(process.env.PORT || 3000, error => {
    if (error) {
      console.log(error);
    }

    console.log('🚀 started');
  });
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      let app = require('./server').app;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
