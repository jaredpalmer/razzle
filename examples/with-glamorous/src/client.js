import React from 'react';
import { hydrate } from 'react-dom';
import { rehydrate } from 'glamor';
import App from './App';

/* Rehydrate glamorous ids for faster startup */
rehydrate(window._glam);

/* Hydrate the React App */
hydrate(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
