if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default {
  path: 'edit',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Edit.js').default);
    });
  },
};
