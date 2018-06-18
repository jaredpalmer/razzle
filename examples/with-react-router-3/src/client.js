import React from 'react';
import Routes from './routes';
import { hydrate } from 'react-dom';

hydrate(<Routes />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
