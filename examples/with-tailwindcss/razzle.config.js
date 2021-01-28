'use strict';

module.exports = {
  options: {
    verbose: true,
  },
  modifyWebpackOptions(opts) {
    const options = opts.options.webpackOptions;
    options.postCssOptions.plugins.unshift(require("tailwindcss"));
    return options;
  }
}
