import { injectAsyncReducer } from '../../store';

export default function createRoutes(store) {
  return {
    path: 'post/:slug',
    getComponents(location, cb) {
      require.ensure([
          '../../containers/PostPage',
          '../../reducers/currentPost',
        ], (require) => {
          let PostPage = require('../../containers/PostPage').default;
          let postReducer = require('../../reducers/currentPost').default;
          injectAsyncReducer(store, 'currentPost', postReducer);
          cb(null, PostPage);
        });
    },
  };
}
