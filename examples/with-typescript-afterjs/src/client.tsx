import { After, ensureReady } from '@jaredpalmer/after';
import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './client.css';
import routes from './routes';

ensureReady(routes).then((data) =>
  hydrate(
    <BrowserRouter>
      <After data={data} routes={routes}/>
    </BrowserRouter>,
    document.getElementById('root')
  )
);

if (module.hot) {
  module.hot.accept();
}
