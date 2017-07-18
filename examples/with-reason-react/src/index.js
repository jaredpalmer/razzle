import app from './server';
import express from 'express';
import webpackProxy from 'razzle-dev-utils/webpackProxy';

if (module.hot) {
  module.hot.accept('./server');
  console.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT || 3000;

export default express()
  .use((...args) => webpackProxy(...args))
  .use((req, res) => app.handle(req, res))
  .listen(port, function(err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`> Started on port ${port}`);
  });
