const LoadablePlugin = require('@loadable/webpack-plugin')

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    if (target === 'web') {
      config.plugins.push(
        new LoadablePlugin({ filename: 'loadable-stats.json', writeToDisk: true })
      )
    }
    return config
  },
}
