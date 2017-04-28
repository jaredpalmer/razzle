import express from 'express';
import app from './server';

if (module.hot) {
  module.hot.accept('./server', function() {
    console.log('🔁  HMR Reloading `./server`...');
  });
  console.info('✅  Server-side HMR Enabled!');
}

export default express()
  .use((req, res) => app.handle(req, res))
  .listen(process.env.PORT || 3000, function(err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`> Started on 3000`);
  });
