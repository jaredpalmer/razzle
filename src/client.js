import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {callAPIMiddleware} from './middleware/callAPIMiddleware';
import { StyleSheet } from 'aphrodite';

// Your app's reducer and routes:
import createReducer from './reducers';
import createRoutes from './routes/root';
import { configureStore } from './store';

const store = configureStore();
const routes = createRoutes(store);

// Render app with Redux and router context to container element:
render((
  <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
  </Provider>
), document.getElementById('root'));
