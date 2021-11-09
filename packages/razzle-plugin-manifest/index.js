'use strict';

const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');

module.exports = {
  modifyWebpackConfig({
    env: { target },
    webpackConfig,
    webpackObject,
    paths,
    options: {
      pluginOptions = { fileName: path.join(paths.appBuild, 'chunks.json') },
    },
  }) {
    if (target === 'web') {
      webpackConfig.plugins.push(
        // Output our JS and CSS files in a manifest file called chunks.json
        // in the build directory.
        // based on https://github.com/danethurber/webpack-manifest-plugin/issues/181#issuecomment-467907737
        new WebpackManifestPlugin({
          fileName: pluginOptions.fileName,
          writeToFileEmit: true,
          filter: item => item.isChunk,
          generate: (seed, files) => {
            const entrypoints = new Set();
            files.forEach(file =>
              ((file.chunk || {})._groups || []).forEach(group =>
                entrypoints.add(group)
              )
            );
            const entries = [...entrypoints];
            const entryArrayManifest = entries.reduce((acc, entry) => {
              const name =
                (entry.options || {}).name ||
                (entry.runtimeChunk || {}).name ||
                entry.id;
              const files = []
                .concat(
                  ...(entry.chunks || []).map(chunk =>
                    chunk.files.map(
                      path => webpackConfig.output.publicPath + path
                    )
                  )
                )
                .filter(Boolean);

              const chunkIds = [].concat(
                ...(entry.chunks || []).map(chunk => chunk.ids)
              );

              const cssFiles = files
                .map(item => (item.indexOf('.css') !== -1 ? item : null))
                .filter(Boolean);

              const jsFiles = files
                .map(item => (item.indexOf('.js') !== -1 ? item : null))
                .filter(Boolean);

              return name
                ? {
                    ...acc,
                    [name]: {
                      css: cssFiles,
                      js: jsFiles,
                      chunks: chunkIds,
                    },
                  }
                : acc;
            }, seed);
            return entryArrayManifest;
          },
        })
      );
    }

    webpackConfig.plugins.push(
      new webpackObject.DefinePlugin({
        'process.env.RAZZLE_CHUNKS_MANIFEST': JSON.stringify(pluginOptions.fileName),
      })
    );

    return webpackConfig;
  },
};
