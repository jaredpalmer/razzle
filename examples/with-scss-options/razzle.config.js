'use strict';

const path = require('path');

module.exports = {
  plugins: [
    {
      name: 'scss',
      options: {
        sass: {
          dev: {
            prependData: `@import "${path.resolve(__dirname, './src/prepend.scss').replace(/\\/g, '/')}";`,
          },
          prod: {
            prependData: `@import "${path.resolve(__dirname, './src/prepend.scss').replace(/\\/g, '/')}";`,
          },
        },
      },
    },
  ],
};
