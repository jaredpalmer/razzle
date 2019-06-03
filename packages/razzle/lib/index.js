'use strict';

require('../config/env');

const paths = require('../config/paths');
const createConfig = require('../config/createConfig');
const { getRazzleConfig, compile } = require('./utils');

module.exports = {
  paths,
  createConfig,
  getRazzleConfig,
  compile,
};
