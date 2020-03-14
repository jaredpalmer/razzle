module.exports = {
  modify: (config, { target, dev }, webpack) => {
    // do something to config

    return { ...config, externals: 'node_modules' };
  },
  plugins: ['typescript'],
};
