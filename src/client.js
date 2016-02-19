import 'babel-polyfill';
import { trigger } from 'redial';

import React from 'react';
import { render } from 'react-dom';
import { Router, match, browserHistory as history  } from 'react-router';
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

StyleSheet.rehydrate(window.renderedClassNames);

const callProvidedHooks = (location, callback) => {
  // Match routes based on location object:
  match({ routes, location }, (routerError, redirectLocation, renderProps) => {
    // Get array of route components:
    const components = renderProps.routes.map(route => route.component);

    // Define locals to be provided to all lifecycle hooks:
    const locals = {
       path: renderProps.location.pathname,
       query: renderProps.location.query,
       params: renderProps.params,

       // Allow lifecycle hooks to dispatch Redux actions:
       dispatch,
     };
    const invoke = window.INITIAL_STATE ? Promise.resolve.bind(Promise) : trigger;

    invoke('fetch', components, locals) // Fetch mandatory data dependencies for 2nd route change onwards
     .then(() => trigger('defer', components, locals)) // Fetch deferred, client-only data dependencies
     .then(() => trigger('done', components, locals)) // Finally, trigger 'done' lifecycle hooks
     .then(callback);
  });
};

// Handle initial rendering
history.listen((location) => {
  if (window.INITIAL_STATE) {
    // Delete global data so that subsequent data fetches can occur:
    callProvidedHooks(location, () => delete window.INITIAL_STATE);
  }
});

// Handle following rendering
history.listenBefore(callProvidedHooks);

// Render app with Redux and router context to container element:

match({ routes, location }, () => {
  render((
    <Provider store={store}>
      <Router routes={routes} history={history}/>
    </Provider>
  ), document.getElementById('root'));
});
