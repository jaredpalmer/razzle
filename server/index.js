import express from 'express';
import app from './server';

if (module.hot) {
  module.hot.accept('./server', function() {
    console.log('🔁  HMR Reloading `./server`...');
  });

  console.info('✅  Server-side HMR Enabled!');
} else {
  console.info('❌  Server-side HMR Disabled.');
}

export default express()
  .use((req, res) => app.handle(req, res))
  .listen(3000, function(err) {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Listening at http://localhost:3000');
  });
