'use strict';

module.exports = {
  modify(baseConfig, { target, dev }, webpack) {
    const appConfig = Object.assign({}, baseConfig);
    // Since RN web takes care of CSS, we should remove it for a #perf boost
    appConfig.module.rules = appConfig.module.rules
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

    //don't load gql/graphql with file-loader
    appConfig.module.rules
      .find(conf => conf.loader && conf.loader.includes('file-loader'))
      .exclude.push(/\.(graphql|gql)/);

    // use graphql-tag
    const { include } = appConfig.module.rules[0];
    appConfig.module.rules.splice(1, 0, {
      test: /\.(graphql|gql)$/,
      include,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });

    // Change the name of the server output file in production
    if (target === 'node' && !dev) {
      appConfig.output.filename = 'custom.js';
    }

    return appConfig;
  },
};
