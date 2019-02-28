'use strict';

const fs = require('fs');

const resolveRazzle = filePath => {
  if (fs.existsSync(filePath)) {
    return require(filePath);
  }
  return {};
};

module.exports = resolveRazzle;
