const resolve = require('resolve');
const path = require('path');

function resolveRequest(req, issuer) {
  const basedir =
    issuer.endsWith(path.posix.sep) || issuer.endsWith(path.win32.sep)
      ? issuer
      : path.dirname(issuer);
  return resolve.sync(req, { basedir });
}

module.exports = resolveRequest;
