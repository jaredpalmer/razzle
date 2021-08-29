import express from 'express';
import markoMiddleware from '@marko/express';
import AppLayout from './views/www.marko';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use( markoMiddleware() ) // Enable res.marko
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const input = {
      title: 'Razzle',
      assets
    }

    res.marko( AppLayout, input );
  });

export default server;
