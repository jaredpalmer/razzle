'use strict';

const webpack = require('webpack');

module.exports = webpack.version ? parseInt(webpack.version[0]) : 3;
