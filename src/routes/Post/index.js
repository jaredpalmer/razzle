import { injectAsyncReducer } from '../../store';
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes(store) {
  return {
    path: 'post/:slug',
    getComponents(location, cb) {
      require.ensure([
          './containers/PostPage',
          './reducer',
        ], (require) => {
          let PostPage = require('./containers/PostPage').default;
          let postReducer = require('./reducer').default;
          injectAsyncReducer(store, 'currentPost', postReducer);
          cb(null, PostPage);
        });
    },
  };
}
