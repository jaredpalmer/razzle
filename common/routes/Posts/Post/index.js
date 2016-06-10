if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)
import { injectAsyncReducer } from '../../../store'

export default function createRoutes (store) {
  return {
    path: 'posts/:slug',
    getComponents (location, cb) {
      require.ensure([
        './containers/PostPage',
        '../reducer'
      ], (require) => {
        const PostPage = require('./containers/PostPage').default
        const normalizedPostReducer = require('../reducer').default
        injectAsyncReducer(store, 'posts', normalizedPostReducer)
        cb(null, PostPage)
      })
    }
  }
}
