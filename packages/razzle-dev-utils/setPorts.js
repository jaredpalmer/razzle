const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

// Checks if PORT and PORT_DEV are available and suggests alternatives if not
module.exports = async () => {
  const port = await choosePort(process.env.HOST, process.env.PORT || 3000);
  const portDev = await choosePort(
    process.env.HOST,
    process.env.PORT_DEV || 3001
  );
  process.env.PORT = port;
  process.env.PORT_DEV = portDev;
};
