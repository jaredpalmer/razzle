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
        require.resolve('react'),
        require.resolve('react-dom'),
        // ... add any other vendor packages with require.resolve('xxx')
      ];

      config.optimization = {
        splitChunks: {
          // Chunk splitting optimiztion
          chunks: 'all',
          // Switch off name generation, otherwise files would be invalidated
          // when more chunks with the same vendors are added
          name: false,
        },
      };
    }

    return config;
  },
};
