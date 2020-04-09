import App from './App';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { render, hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';

const renderMethod = module.hot ? render : hydrate;

loadableReady(() => {
  renderMethod(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  );
});

if (module.hot) {
  module.hot.accept();
}
