'use strict';

const createRazzle = require('./lib');
const messages = require('./lib/messages');

module.exports = {
  messages: messages,
  createRazzleApp: createRazzle,
};
