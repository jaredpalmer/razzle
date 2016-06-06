// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

import App from '../components/App'
import PostList from './PostList'

export default (store) => ({
  path: '/',
  component: App,
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./About').default, // no need to modify store, no reducer
        require('./Post').default(store), // add async reducer

        require('./NotFound').default
      ])
    }, 'App')
  },

  indexRoute: {
    component: PostList
  }
})
