if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)
import { injectAsyncReducer } from '../../store'

export default function createRoutes (store) {
  return {
    path: 'posts',
    getComponents (location, cb) {
      require.ensure([
        './containers/PostList',
        './reducer'
      ], (require) => {
        let PostPage = require('./containers/PostList').default
        let postReducer = require('./reducer').default
        injectAsyncReducer(store, 'posts', postReducer)
        cb(null, PostPage)
      })
    }
  }
}
