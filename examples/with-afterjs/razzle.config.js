'use strict';

const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');

const paths = {
  temp: path.resolve('./build'),
  tempSrc: path.resolve('./build/src'),
  tempPublic: path.resolve('./build/public'),
  appSrc: path.resolve('./src'),
  appPublic: path.resolve('./public'),
  lib: path.join(__dirname, './lib'),
};

module.exports = {
  preCompile() {
    fs.copySync(paths.lib, paths.tempSrc, {
      overwrite: true,
    });
    fs.copySync(paths.appSrc, paths.tempSrc, {
      overwrite: true,
    });
    fs.copySync(paths.appPublic, paths.tempPublic, {
      overwrite: true,
    });
  },
  modifyPaths(env, oldpaths) {
    return Object.assign({}, oldpaths, {
      appBuild: path.resolve('./build/build'),
      appBuildPublic: path.resolve('./build/build/public'),
      appManifest: path.resolve('./build/build/assets.json'),
      appClientIndexJs: path.resolve('./build/src/client'),
      appServerIndexJs: path.resolve('./build/src/index'),
      appSrc: env === 'test' ? oldpaths.appSrc : path.resolve('./build/src'),
    });
  },
  postCompile(env) {
    if (env === 'dev') {
      chokidar
        .watch('src', { ignored: /(^|[\/\\])\../ })
        .on('change', changedPath => {
          fs.copyFile(
            changedPath,
            paths.tempSrc.replace('src', changedPath),
            err => {
              if (err) {
                console.log(err);
              }
            }
          );
        });
    }
  },
};
