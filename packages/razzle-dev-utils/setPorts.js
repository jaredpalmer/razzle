const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

// Checks if PORT and PORT_DEV are available and suggests alternatives if not
module.exports = async () => {
  const port = (process.env.PORT && parseInt(process.env.PORT)) || 3000;
  const portDev =
    (process.env.PORT_DEV && parseInt(process.env.PORT_DEV)) || port + 1;

  const actualPort = await choosePort(process.env.HOST, port);
  const actualPortDev = await choosePort(process.env.HOST, portDev);

  process.env.PORT = actualPort;
  process.env.PORT_DEV = actualPortDev;
};
