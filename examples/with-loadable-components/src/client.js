import React from 'react';
import { hydrate } from 'react-dom';
import { loadComponents } from 'loadable-components';
import App from './App';

// Load all components needed before rendering
loadComponents().then(() => {
  hydrate(<App />, document.getElementById('root'));
});

if (module.hot) {
  module.hot.accept();
}
