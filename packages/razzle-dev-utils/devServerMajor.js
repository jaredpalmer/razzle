'use strict';

const devserverPkg = require('webpack-dev-server/package.json');

module.exports = devserverPkg.version ? parseInt(devserverPkg.version[0]) : 3;
