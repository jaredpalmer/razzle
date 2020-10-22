'use strict';

const path = require('path');

module.exports = {
  plugins: [
    {
      name: 'scss',
      options: {
        sass: {
          dev: {
            additionalData: `@import "${path.resolve(__dirname, './src/prepend.scss').replace(/\\/g, '/')}";`,
          },
          prod: {
            additionalData: `@import "${path.resolve(__dirname, './src/prepend.scss').replace(/\\/g, '/')}";`,
          },
        },
      },
    },
  ],
};
