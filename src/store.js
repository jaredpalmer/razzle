import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { callAPIMiddleware } from './middleware/callAPIMiddleware';
import createReducer from './createReducer';

export function configureStore(initialState = {}) {
  let store = createStore(createReducer(), initialState, compose(
    applyMiddleware(
      thunk,
      callAPIMiddleware
    ),

     (process.env.NODE_ENV === 'development') &&
      typeof window === 'object' &&
       typeof window.devToolsExtension !== 'undefined' ?
        window.devToolsExtension() : f => f
  ));

  store.asyncReducers = {};

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('./createReducer', () =>
        store.replaceReducer(require('./createReducer').default)
      );
    }
  }

  return store;
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
