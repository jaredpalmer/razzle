const withNextra = require('./.nextra/nextra')();
const isProd = process.env.TARGET === 'production';

module.exports = withNextra({
  assetPrefix: isProd ? 'https://jaredpalmer.com/razzle' : '',
});
