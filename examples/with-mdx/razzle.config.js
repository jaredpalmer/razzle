'use strict';

const emoji = require('remark-emoji');

module.exports = {
  plugins: [
    {
      name: 'mdx',
      options: {
        mdPlugins: [emoji],
      },
    },
  ],
};
