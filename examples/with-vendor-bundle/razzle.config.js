'use strict';

module.exports = {
  modify(defaultConfig, { target, dev }, webpack) {
    const config = defaultConfig; // stay immutable here

    // Change the name of the server output file in production
    if (target === 'web') {
      // modify filenaming to account for multiple entry files
      config.output.filename = dev
        ? 'static/js/[name].js'
        : 'static/js/[name].[hash:8].js';

      // add another entry point called vendor
      config.entry.vendor = [
        // now that React has moved, we need to Razzle's polyfills because
        // vendor.js will be loaded before our other entry. Razzle looks for
        // process.env.REACT_BUNDLE_PATH and will exclude the polyfill from our normal entry,
        // so we don't need to worry about including it twice.
        require.resolve('razzle/polyfills'),
        require.resolve('react'),
        require.resolve('react-dom'),
        // ... add any other vendor packages with require.resolve('xxx')
      ];

      // Use Twitter Lite's vendor & manifest bundle approach
      // See https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3
      config.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          names: ['vendor', 'manifest'],
          minChunks: Infinity,
        })
      );

      // Extract common modules from all the chunks (requires no 'name' property)
      config.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          async: true,
          children: true,
          minChunks: 4,
        })
      );
    }

    return config;
  },
};
