import express from 'express';
<<<<<<< HEAD
import app from './server';

if (module.hot) {
  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
=======

// this require is necessary for server HMR to recover from error
// tslint:disable-next-line:no-var-requires
let app = require('./server').default;

if (module.hot) {
  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').default;
    } catch (error) {
      console.error(error);
    }
>>>>>>> master
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT || 3000;

export default express()
<<<<<<< HEAD
  .use(app)
=======
  .use((req, res) => app.handle(req, res))
>>>>>>> master
  .listen(port, (err: Error) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`> Started on port ${port}`);
  });
