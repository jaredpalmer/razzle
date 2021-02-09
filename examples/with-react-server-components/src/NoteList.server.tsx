/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetch } from 'react-fetch';

import { searchNotes } from './db.server';
import SidebarNote from './SidebarNote';

export default function NoteList({ searchText }) {
  // const notes = fetch('http://localhost:4000/notes').json();

  const notes = searchNotes(searchText);

  // Now let's see how the Suspense boundary above lets us not block on this.
  // fetch('http://localhost:4000/sleep/3000');

  return notes.length > 0 ? (
    <ul className="notes-list">
      {notes.map((note) => (
        <li key={note.id}>
          <SidebarNote note={note} />
        </li>
      ))}
    </ul>
  ) : (
    <div className="notes-empty">
      {searchText
        ? `Couldn't find any notes titled "${searchText}".`
        : 'No notes created yet!'}{' '}
    </div>
  );
}
