import http from 'http';
import app from './server';

const server = http.createServer(app);

const port = process.env.PORT || 3000;

let currentApp = app;
server.listen(port, err => {
  if (err) {
    console.log(err);
  }
  console.log(`> Started server on port ${port}`);
});

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}
