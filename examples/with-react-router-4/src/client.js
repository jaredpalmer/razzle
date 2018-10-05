import React from 'react';
import Router from 'react-router-dom/Router';
import { hydrate } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import RootApp from './App';

const supportsHistory = 'pushState' in window.history;
const history = createBrowserHistory();

const ClientApp = () => (
  <Router history={history} forceRefresh={!supportsHistory}>
    <RootApp />
  </Router>
)

hydrate(<ClientApp />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
