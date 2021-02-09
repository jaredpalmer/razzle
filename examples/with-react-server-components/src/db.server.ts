/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const startOfYear = require('date-fns/startOfYear');

const now = new Date();
const startOfThisYear = startOfYear(now);
// Thanks, https://stackoverflow.com/a/9035732
function randomDateBetween(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

const db = [
  {
    id: 0,
    created_at: randomDateBetween(startOfThisYear, now),
    updated_at: now,
    title: 'Meeting Notes',
    body: 'This is an example note. It contains **Markdown**!',
  },
  {
    id: 1,
    created_at: randomDateBetween(startOfThisYear, now),
    updated_at: now,
    title: 'Make a thing',
    body: `It's very easy to make some words **bold** and other words *italic* with Markdown. You can even [link to React's website!](https://www.reactjs.org).`,
  },
  {
    id: 2,
    created_at: randomDateBetween(startOfThisYear, now),
    updated_at: now,
    title:
      'A note with a very long title because sometimes you need more words',
    body: `You can write all kinds of [amazing](https://en.wikipedia.org/wiki/The_Amazing)
notes in this app! These note live on the server in the \`notes\` folder.
    
![This app is powered by React](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/React_Native_Logo.png/800px-React_Native_Logo.png)`,
  },
  {
    id: 3,
    created_at: now,
    updated_at: now,
    title: 'I wrote this note today',
    body: 'It was an excellent note.',
  },
];

let nextId = db.length;

function insertNote(title, body) {
  const now = new Date();
  const note = { id: nextId++, title, body, created_at: now, updated_at: now };
  db.push(note);
  return note;
}

function editNote(id, title, body) {
  const now = new Date();
  const note = findNote(id);
  note.title = title;
  note.body = body;
  note.updated_at = now;
}

function findNote(id) {
  return db.find((note) => note.id == id);
}

function deleteNote(id) {
  const index = db.findIndex((note) => note.id == id);
  if (index > -1) {
    db.splice(index, 1);
  }
}

function searchNotes(text) {
  return db.filter(
    (note) => note.title.includes(text) || note.body.includes(text),
  );
}

module.exports = {
  db,
  insertNote,
  findNote,
  editNote,
  deleteNote,
  searchNotes,
};
