'use strict';

module.exports = {
  modifyWebpackOptions(opts) {
    const options = opts.options.webpackOptions;
    options.postCssOptions.plugins.unshift(require("tailwindcss"));
    return options;
  }
}
