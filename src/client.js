import 'babel-polyfill';
import { trigger } from 'redial';

import React from 'react';
import { render } from 'react-dom';
import Router from 'react-router/lib/Router';
import match from 'react-router/lib/match';
import browserHistory from 'react-router/lib/browserHistory';
import { Provider } from 'react-redux';
import { StyleSheet } from 'aphrodite';

// Your app's reducer and routes:
import createRoutes from './routes/root';
import { configureStore } from './store';

const initialState = window.INITIAL_STATE || {};

// Set up Redux (note: this API requires redux@>=3.1.0):
const store = configureStore(initialState);
const { dispatch } = store;
const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;
const routes = createRoutes(store);
const container = document.getElementById('root');
StyleSheet.rehydrate(window.renderedClassNames);

browserHistory.listen(location => {
  // Match routes based on location object:
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    // Get array of route handler components:
    const { components } = renderProps;

    // Define locals to be provided to all lifecycle hooks:
    const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,

        // Allow lifecycle hooks to dispatch Redux actions:
        dispatch,
      };

    // Don't fetch data for initial route, server has already done the work:
    if (window.INITIAL_STATE) {
      // Delete initial data so that subsequent data fetches can occur:
      delete window.INITIAL_STATE;
    } else {
      // Fetch mandatory data dependencies for 2nd route change onwards:
      trigger('fetch', components, locals);
    }

    // Fetch deferred, client-only data dependencies:
    trigger('defer', components, locals);
  });
});

// Render app with Redux and router context to container element:
render((
  <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
  </Provider>
), container);
