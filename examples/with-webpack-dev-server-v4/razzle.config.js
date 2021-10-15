module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // Use the same detection code from `createConfigAsync` to ensure that this example is using version 4
    const devserverPkg = require('webpack-dev-server/package.json');
    const devServerMajorVersion = parseInt(devserverPkg.version[0]);
    if (devServerMajorVersion < 4) {
      throw new Error(`This should be webpack-dev-server version 4, got ${devServerMajorVersion} instead`);
    }

    return config;
  },
}
