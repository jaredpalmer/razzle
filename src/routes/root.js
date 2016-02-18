// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import PostList from './PostList';
import App from './App';

export default function genRoutes(store) {
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
      component: PostList,
    },
  };

  return root;
}
