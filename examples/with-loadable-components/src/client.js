import App from './App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component'

loadableReady(() => {
  hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  );
})

if (module.hot) {
  module.hot.accept();
}
