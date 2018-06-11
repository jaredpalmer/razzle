import App from './App';
import React from 'react';
import { hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import BrowserRouter from 'react-router-dom/BrowserRouter';

window.main = () => {
  Loadable.preloadReady().then(() => {
    hydrate(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('root')
    );
  });
};

if (module.hot) {
  module.hot.accept();
}
