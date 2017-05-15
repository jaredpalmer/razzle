const App = require('../lib/js/src/app').comp;

import './client.css';

import React from 'react';
import { render } from 'react-dom';

render(
  React.createElement(App, {
    title: 'Welcome to Razzle Reason React',
  }),
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
