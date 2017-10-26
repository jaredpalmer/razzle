const { ReactLoadablePlugin } = require('react-loadable/webpack');

module.exports = {
  modify: (config, { target }) =>
    target === 'web'
      ? {
          ...config,
          plugins: [
            ...config.plugins,
            new ReactLoadablePlugin({
              filename: './build/react-loadable.json',
            }),
          ],
        }
      : config,
};
