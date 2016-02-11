import { trigger } from 'redial';

import React from 'react';
import { render } from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useQueries from 'history/lib/useQueries';
import { Router, match } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

// Your app's reducer and routes:
import reducer from './reducers';
import routes from './routes';

// Render the app client-side to a given container element:
// Your server rendered response needs to expose the state of the store, e.g.
// <script>
//   window.INITIAL_STATE = <%- JSON.stringify(store.getState())%>
// </script>
const initialState = window.INITIAL_STATE;

// Set up Redux (note: this API requires redux@>=3.1.0):
const store = createStore(reducer, initialState,
  compose(
    applyMiddleware(
      thunk,
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);
const { dispatch } = store;

// Set up history for router and listen for changes:
const history = useQueries(createBrowserHistory)();
history.listen(location => {
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
    if (window.INITIAL_STATE) {
      // Delete global data so that subsequent data fetches can occur:
      delete window.INITIAL_STATE;
    } else {
      // Fetch mandatory data dependencies for 2nd route change onwards:
      trigger('fetch', components, locals);
    }

    // Fetch deferred, client-only data dependencies
    trigger('defer', components, locals)

      // Finally, trigger 'done' lifecycle hooks:
      .then(() => trigger('done', components, locals));
  });
});

// Render app with Redux and router context to container element:
render((
  <Provider store={store}>
          <Router history={history} routes={routes} />
      </Provider>
), document.getElementById('root'));
