import 'babel-polyfill'
import {trigger} from 'redial'

import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router/lib/Router'
import match from 'react-router/lib/match'
import browserHistory from 'react-router/lib/browserHistory'
import {Provider} from 'react-redux'
import {StyleSheet} from 'aphrodite'

import {configureStore} from '../common/store'
const initialState = window.INITIAL_STATE || {}
const store = configureStore(initialState)
const {dispatch} = store

const container = document.getElementById('root')

StyleSheet.rehydrate(window.renderedClassNames)

function getLocals (renderProps) {
  return {
    path: renderProps.location.pathname,
    query: renderProps.location.query,
    params: renderProps.params,
    initialState: store.getState(),
    dispatch
  }
}

function RouterOnUpdate () {
  let components = this.state ? this.state.components : this.props.components
  let renderProps = this.state ? this.state : this.props

  setTimeout(function () {
    // Don't fetch data for initial route, server has already done the work:
    if (window.INITIAL_STATE) {
      // Delete initial data so that subsequent data fetches can occur:
      delete window.INITIAL_STATE
    } else {
      // Fetch mandatory data dependencies for 2nd route change onwards:
      trigger('fetch', components, getLocals(renderProps)).then(() => {})
    }
    trigger('defer', components, getLocals(renderProps))
      .then(() => {})
  }, 10)
}

const render = () => {
  const {pathname, search, hash} = window.location
  const location = `${pathname}${search}${hash}`

  const createRoutes = require('../common/routes/root').default
  const routes = createRoutes(store)

  match({routes, location}, () => {
    ReactDOM.render(
      <Provider store={store}>
        <Router onUpdate={RouterOnUpdate} routes={routes} history={browserHistory} key={Math.random()}/>
      </Provider>,
      container
    )
  })
}

if (module.hot) {
  module.hot.accept('../common/routes/root', () => {
    setTimeout(render)
  })
}

render()
