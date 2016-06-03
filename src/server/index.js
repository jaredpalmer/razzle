require('babel-register');
if (process.env.NODE_ENV != 'production') {
  require.extensions['.png'] = function () {};
  require.extensions['.jpg'] = function () {};
  require.extensions['.jpeg'] = function () {};
  require.extensions['.woff'] = function () {};
  require.extensions['.woff2'] = function () {};
  require.extensions['.ico'] = function () {};
  require.extensions['.svg'] = function () {};
}
require('./server');
