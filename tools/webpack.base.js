const path = require('path')

module.exports = {
  CLIENT_ENTRY:  path.join(process.cwd(), 'client'),
  CLIENT_OUTPUT: path.join(process.cwd(), 'public/assets'),
  SERVER_ENTRY:  path.join(process.cwd(), 'server/server.js'),
  SERVER_OUTPUT: path.join(process.cwd(), 'build'),
  PUBLIC_PATH: '/'
}
