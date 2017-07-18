const devServerPort = parseInt(process.env.PORT || 3000, 10) + 1;
const host = process.env.HOST || 'localhost';
const proxy = require('http-proxy-middleware');

module.exports = proxy('/sockjs-node', {
  target: `http://${host}:${devServerPort}`,
  ws: true,
});
