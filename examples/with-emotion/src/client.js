import App from './App';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { hydrate } from 'react-dom';
import { CacheProvider, Global, css } from '@emotion/react';
import { cache } from '@emotion/css';

hydrate(
  <CacheProvider value={cache}>
    <Global
      styles={css`
        html {
          height: 100%;
          min-height: 100%;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
          min-height: 100%;
        }
      `}
    />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CacheProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
