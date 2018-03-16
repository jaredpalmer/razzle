import './client.css';

import React from 'react';
import { render } from 'react-dom';

import App from '../lib/js/src/App'; // BuckleScript output directory

render(
  <App title="Welcome to Razzle Reason React" />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
