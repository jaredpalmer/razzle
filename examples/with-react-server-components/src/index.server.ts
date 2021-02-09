import express from 'express';
import compress from 'compression';
import { readFileSync } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import { pipeToNodeWritable } from 'react-server-dom-webpack/writer';
import path from 'path';
import React from 'react';
import ReactApp from './App.server';

const { db } = require('./db.server');


db.exec(`CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  title TEXT,
  body TEXT
);`);

const app = express();

app.use(compress());
app.use(express.json());

function handleErrors(fn) {
  return async function (req, res, next) {
    try {
      return await fn(req, res);
    } catch (x) {
      next(x);
    }
  };
}

app.get(
  '/',
  handleErrors(async function (_req, res) {
    await waitForWebpack();
    const html = readFileSync(
      path.resolve(__dirname, '../build/public/index.html'),
      'utf8',
    );

    // Note: this is sending an empty HTML shell, like a client-side-only app.
    // However, the intended solution (which isn't built out yet) is to read
    // from the Server endpoint and turn its response into an HTML stream.
    res.send(html);
  }),
);

async function renderReactTree(res, props) {
  await waitForWebpack();
  const manifest = readFileSync(
    path.resolve(__dirname, '../build/public/react-client-manifest.json'),
    'utf8',
  );
  const moduleMap = JSON.parse(manifest);
  pipeToNodeWritable(React.createElement(ReactApp, props), res, moduleMap);
}

function sendResponse(req, res, redirectToId) {
  const location = JSON.parse(req.query.location);
  if (redirectToId) {
    location.selectedId = redirectToId;
  }
  res.set('X-Location', JSON.stringify(location));

  renderReactTree(res, {
    selectedId: location.selectedId,
    isEditing: location.isEditing,
    searchText: location.searchText,
  });
}

app.get('/react', function (req, res) {
  sendResponse(req, res, null);
});

const NOTES_PATH = path.resolve(__dirname, '../notes');

app.post(
  '/notes',
  handleErrors(async function(req, res) {
    const now = new Date();
    const insert = db.prepare(
      'INSERT INTO notes (title, body, created_at, updated_at) VALUES (?, ?, ?, ?)').bind(
        req.body.title, req.body.body, now.toISOString().split('T')[0], now.toISOString().split('T')[0]
      )
      const getid = db.prepare('SELECT last_insert_rowid()')
      const insertGetId = db.transaction(() => {
        insert.run();
        return getid.pluck().get();
      })
      const insertedId = insertGetId();
      await writeFile(
        path.resolve(NOTES_PATH, `${insertedId}.md`),
        req.body.body,
        'utf8'
      );
      sendResponse(req, res, insertedId);
    })
  );

app.put(
  '/notes/:id',
  handleErrors(async function(req, res) {
    const now = new Date();
    const updatedId = Number(req.params.id);
    const update = db.prepare(
      'UPDATE notes set title = ?, body = ?, updated_at = ? WHERE id = ?').bind(
        req.body.title, req.body.body, now.toISOString().split('T')[0], updatedId
      ).run();
      await writeFile(
        path.resolve(NOTES_PATH, `${updatedId}.md`),
        req.body.body,
        'utf8'
      );
      sendResponse(req, res, null);
    })
  );

app.delete(
  '/notes/:id',
  handleErrors(async function(req, res) {
    db.prepare('DELETE FROM notes where id = ?').bind(req.params.id).run();
    await unlink(path.resolve(NOTES_PATH, `${req.params.id}.md`));
    sendResponse(req, res, null);
  })
);

app.get(
  '/notes',
  handleErrors(async function(_req, res) {
    const rows = db.prepare('SELECT * FROM notes ORDER BY id DESC').all();
    res.json(rows);
  })
);

app.get(
  '/notes/:id',
  handleErrors(async function(req, res) {
    const row = db.prepare('SELECT * FROM notes WHERE id = ?').bind(req.params.id).get();;
    res.json(row);
  })
);
app.get('/sleep/:ms', function (req, res) {
  setTimeout(() => {
    res.json({ ok: true });
  }, req.params.ms);
});

app.use(express.static('build/public'));
app.use(express.static('public'));

app.on('error', function (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

async function waitForWebpack() {
  while (true) {
    try {
      readFileSync(path.resolve(__dirname, '../build/public/index.html'));
      return;
    } catch (err) {
      console.log(
        'Could not find webpack build output. Will retry in a second...',
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export default app;
