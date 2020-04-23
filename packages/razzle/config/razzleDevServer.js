#! /usr/bin/env node
'use strict';

const devServer = require('webpack-dev-server');

class razzleDevServer extends devServer {

  showStatus() {}

}

module.exports = razzleDevServer;
