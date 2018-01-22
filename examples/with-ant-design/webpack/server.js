module.exports = (config, webpack) => ({
  ...config,
  module: {
    ...config.module,
    rules: [...config.module.rules],
  },
  plugins: [
    ...config.plugins,
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
})
