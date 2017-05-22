import App from './App';
import React from 'react';
import registerServiceWorker from './registerServiceWorker';
import { render } from 'react-dom';

render(<App />, document.getElementById('root'));
registerServiceWorker();

if (module.hot) {
  module.hot.accept();
}
