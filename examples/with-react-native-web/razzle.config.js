'use strict';

module.exports = {
  modify(config, { target, dev }, webpack) {
    // Since RN web takes care of CSS, we should remove it for a #perf boost
    config.module.rules = config.module.rules
      .filter(
        rule =>
          !(rule.test && rule.test.exec && rule.test.exec('./something.css'))
      )
      .filter(
        rule =>
          !(
            rule.test &&
            rule.test.exec &&
            rule.test.exec('./something.module.css')
          )
      );

    const extPlugin = require(require.resolve('extract-text-webpack-plugin'));
    config.plugins = config.plugins.filter(w => !(w instanceof extPlugin));

    return config;
  },
};
