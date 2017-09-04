// This is a super hacky plugin that manually writes the files for the server chunk to the build directory.
// When just running webpack without dev server, webpack will do this itself already;
// But, because we're also using the devserver to compile our server, assets get 'stored' in the virtual filesystem of webpack-dev-server.
// Alas, never use this plugin whilst not combining it with dev server, as it'll result in files getting written twice and other unexpected behavior.

const fs = require('fs');
const path = require('path');

class WriteServerPlugin {
  constructor(options) {
    this.buildDir = options.buildDir;
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const promises = Object.keys(compilation.assets).map(
        asset =>
          new Promise((resolve, reject) =>
            fs.writeFile(
              path.join(this.buildDir, asset),
              compilation.assets[asset].source(),
              err => (err ? reject(err) : resolve())
            )
          )
      );

      Promise.all(promises)
        .then(() => callback(null))
        .catch(err => callback(err));
    });
  }
}

module.exports = WriteServerPlugin;
