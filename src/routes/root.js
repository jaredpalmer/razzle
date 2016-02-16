// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import App from '../containers/App';
import PostListPage from '../containers/PostListPage';

export default {
  path: '/',
  component: App,
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./Editor'),
        require('./Post'),
      ]);
    });
  },

  indexRoute: {
    component: PostListPage,
  },
};
