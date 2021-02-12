
import React from 'react';
import { render } from 'react-dom';

import { make } from 'bs/App'; // BuckleScript output directory

const App = make;

render(
  <App title="Welcome to Razzle Reason React" />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
