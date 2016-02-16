module.exports = {
  path: 'post/:slug',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../containers/PostPage.js'));
    });
  },
};
