// This is a super hacky plugin that manually writes the files for the server chunk to the build directory.
// When just running webpack without dev server, webpack will do this itself already;
// But, because we're also using the devserver to compile our server, assets get 'stored' in the virtual filesystem of webpack-dev-server.
// Alas, never use this plugin whilst not combining it with dev server, as it'll result in files getting written twice and other unexpected behavior.

const fs = require('fs');
const path = require('path');

class WriteServerPlugin {
  constructor(options) {
    this.assetName = options.assetName;
    this.buildDir = options.buildDir; // todo get this from config instead? (but how?)
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      if (this.assetName in compilation.assets) {
        fs.writeFile(
          path.join(this.buildDir, this.assetName),
          compilation.assets[this.assetName].source(),
          err => callback(err)
        );
        // todo: map file???
      } else {
        callback();
      }
    });
  }
}

module.exports = WriteServerPlugin;
