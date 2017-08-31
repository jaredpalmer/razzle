import './client.css';

import React from 'react';
import { render } from 'react-dom';

const App = require('../lib/js/src/app').comp; // BuckleScript output directory

render(
  <App title="Welcome to Razzle Reason React" />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
