
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const fs = require('fs');
const path = require('path');
const {readdir, unlink, writeFile} = require('fs/promises');
const startOfYear = require('date-fns/startOfYear');
const sqlite  =   require('better-sqlite3');

const NOTES_PATH = './notes';

const db = sqlite(path.join(process.cwd(), 'db.sqlite3'))

const now = new Date();
const startOfThisYear = startOfYear(now);
// Thanks, https://stackoverflow.com/a/9035732
function randomDateBetween(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const dropTableStatement = 'DROP TABLE IF EXISTS notes;';
const createTableStatement = `CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  title TEXT,
  body TEXT
);`;
const insertNoteStatement = `INSERT INTO notes(title, body, created_at, updated_at)
  VALUES (?, ?, ?, ?)`;

const selectTable = 'SELECT * FROM notes';

const seedData = [
  [
    'Meeting Notes',
    'This is an example note. It contains **Markdown**!',
    randomDateBetween(startOfThisYear, now).toISOString().split('T')[0],
    randomDateBetween(startOfThisYear, now).toISOString().split('T')[0],
  ],
  [
    'Make a thing',
    `It's very easy to make some words **bold** and other words *italic* with
Markdown. You can even [link to React's website!](https://www.reactjs.org).`,
    randomDateBetween(startOfThisYear, now).toISOString().split('T')[0],
    randomDateBetween(startOfThisYear, now).toISOString().split('T')[0],
  ],
  [
    'A note with a very long title because sometimes you need more words',
    `You can write all kinds of [amazing](https://en.wikipedia.org/wiki/The_Amazing)
notes in this app! These note live on the server in the \`notes\` folder.
![This app is powered by React](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/React_Native_Logo.png/800px-React_Native_Logo.png)`,
    randomDateBetween(startOfThisYear, now).toISOString().split('T')[0],
    randomDateBetween(startOfThisYear, now).toISOString().split('T')[0],
  ],
  ['I wrote this note today', 'It was an excellent note.', now.toISOString().split('T')[0], now.toISOString().split('T')[0]],
];

async function seed() {
  db.exec(dropTableStatement);
  db.exec(createTableStatement);
  seedData.map((row) => db.prepare(insertNoteStatement).run(row))

  const res = db.prepare(selectTable).all();
  console.log(res)
  const oldNotes = await readdir(path.resolve(NOTES_PATH));
  await Promise.all(
    oldNotes
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => unlink(path.resolve(NOTES_PATH, filename)))
  );

  await Promise.all(
    res.map((row) => {
      const id = row.id;
      const content = row.body;
      const data = new Uint8Array(Buffer.from(content));
      return writeFile(path.resolve(NOTES_PATH, `${id}.md`), data, (err) => {
        if (err) {
          throw err;
        }
      });
    })
  );
}

seed();
