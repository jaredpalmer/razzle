export default {
  path: 'edit',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Editor.js').default);
    });
  },
};
