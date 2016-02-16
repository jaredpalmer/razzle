import { trigger } from 'redial';

import React from 'react';
import { render } from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useQueries from 'history/lib/useQueries';
import { Router, match } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {callAPIMiddleware} from './middleware/callAPIMiddleware';

// Your app's reducer and routes:
import reducers from './reducers';
import routes from './routes';

// Render the app client-side to a given container element:
// Your server rendered response needs to expose the state of the store, e.g.
// <script>
//   window.INITIAL_STATE = <%- JSON.stringify(store.getState())%>
// </script>
const initialState = window.INITIAL_STATE;

// Set up Redux (note: this API requires redux@>=3.1.0):
const store = createStore(reducers, initialState,
  compose(
    applyMiddleware(
      thunk,
      callAPIMiddleware
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);
const { dispatch } = store;

// Set up history for router and listen for changes:
const history = useQueries(createBrowserHistory)();

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

    // Don't fetch data for initial route, server has already done the work:
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
render((
  <Provider store={store}>
          <Router history={history} routes={routes} />
      </Provider>
), document.getElementById('root'));
