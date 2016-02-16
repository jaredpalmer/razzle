// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import PostListPage from '../containers/PostListPage';
import App from '../containers/App';
import { injectAsyncReducer } from '../store';

function createPostRoute(store) {
  return {
    path: 'post/:slug',
    getComponents(location, cb) {
      require.ensure([
          '../containers/PostPage',
          '../reducers/currentPost',
        ], (require) => {
          let PostPage = require('../containers/PostPage').default;
          let postReducer = require('../reducers/currentPost').default;
          injectAsyncReducer(store, 'currentPost', postReducer);
          callback(null, PostPage);
        });
    },
  };
}

export default function createRoutes(store) {
  const root = {
    path: '/',
    component: App,
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('./Editor').default,
          require('./Post').default(store),
        ]);
      });
    },

    indexRoute: {
      component: PostListPage,
    },
  };

  return root;
}
