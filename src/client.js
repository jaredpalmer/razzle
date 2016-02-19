import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router, match, browserHistory  } from 'react-router';
import { Provider } from 'react-redux';
import { StyleSheet } from 'aphrodite';

// Your app's reducer and routes:
import createRoutes from './routes/root';
import { configureStore } from './store';

const initialState = window.INITIAL_STATE || {};

// Set up Redux (note: this API requires redux@>=3.1.0):
const store = configureStore(initialState);
const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;
const routes = createRoutes(store);

StyleSheet.rehydrate(window.renderedClassNames);

// Render app with Redux and router context to container element:
match({ routes, location }, () => {
  render((
    <Provider store={store}>
      <Router routes={routes} history={browserHistory}/>
    </Provider>
  ), document.getElementById('root'));
});
