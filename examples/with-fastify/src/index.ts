import http from 'http';

/**
 * This implementation is similar to the `with-koa` example,
 * but Fastify does not have a `app#callback()` method.
 * Thus, this import implements a similar implementation.
 * See `./server.tsx` for more information.
 */
let currentHandler: http.RequestListener = require('./server').default;

const server = http.createServer(currentHandler);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`🚀 Server Started on Port ${port}`);
});

if (module.hot) {
  module.hot.accept('./server', async function() {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      const newHandler: http.RequestListener = require('./server').default;
      server.removeListener('request', currentHandler);
      server.on('request', newHandler);
      currentHandler = newHandler;
    } catch (error) {
      console.error('ERROR', error);
    }
    console.log('🚀 Server-side HMR Complete');
  });
  console.info('✅  Server-side HMR Enabled!');
}
