import App from './App';
import http from 'http';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import models, { sequelize, testConnection, close } from './sequelize';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const app = express();
const server = http.createServer(app);

// REST Route (doesn't render react)
app.get('/rest/users', async (req, res) => {
  try {
    const users = await models.User.findAll();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
});

// React render route
app
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const markup = renderToString(<App />);
    res.send(
      // prettier-ignore
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        } 
    </head>
    <body>
        <div id="root">${markup}</div>    
        <script src="${assets.client.js}" defer crossorigin></script>
    </body>
</html>`
    );
  });

const preStart = async cb => {
  try {
    await testConnection();
    await sequelize.sync({ hooks: true });
    cb();
  } catch (err) {
    console.error('preStart error', err);
  }
};

const closeDatabase = async () => {
  await close();
};

const shutdown = () => {
  console.log('Received kill signal, shutting down gracefully.');
  server.close(async () => {
    try {
      console.log('Closed out remaining connections');
      await closeDatabase();
    } catch (err) {
      console.log(err);
    } finally {
      process.exit(0);
    }
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { server as default, preStart, app };
