'use strict';

const lessOption = {
  javascriptEnabled: true,
  modifyVars: { '@info-color': '#1DA57A' },
};

module.exports = {
  plugins: [
    {
      name: 'less',
      options: {
        less: {
          dev: Object.assign(lessOption, {
            sourceMap: true,
          }),
          prod: Object.assign(lessOption, {
            sourceMap: false,
          }),
        },
      },
    },
  ],
};
