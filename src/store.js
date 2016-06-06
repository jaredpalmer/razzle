import { createStore, applyMiddleware, compose } from 'redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import thunk from 'redux-thunk'
import { callAPIMiddleware } from './middleware/callAPIMiddleware'
import createReducer from './createReducer'

const devtools = canUseDOM
  ? window.devToolsExtension
  : () => noop => noop

export function configureStore (initialState = {}) {
  const reducer = createReducer()
  const middleware = [ callAPIMiddleware, thunk ]
  const enhancers = [
    applyMiddleware(...middleware),
    devtools()
  ]
  const store = createStore(reducer, initialState, compose(...enhancers))

  store.asyncReducers = {}

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('./createReducer', () =>
        store.replaceReducer(require('./createReducer').default)
      )
    }
  }

  return store
}

export function injectAsyncReducer (store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer
  store.replaceReducer(createReducer(store.asyncReducers))
}
