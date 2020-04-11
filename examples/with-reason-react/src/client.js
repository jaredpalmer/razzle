import './client.css';

import React from 'react';
import { hydrate } from 'react-dom';

import App from '../lib/es6_global/src/App'; // BuckleScript output directory

hydrate(
  <App title="Welcome to Razzle Reason React" />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
