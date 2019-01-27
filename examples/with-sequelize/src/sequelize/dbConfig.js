/* eslint-disable */
const Sequelize = require('sequelize');
// We use require here to allow sequelize-cli to parse this file without babel transformation.

const defaultConfig = {
  host: process.env.RAZZLE_RUNTIME_DB_HOST || 'localhost',
  // use 3307 as default to avoid existing mysql installations
  port: process.env.RAZZLE_RUNTIME_DB_PORT || 3307,
  username: process.env.RAZZLE_RUNTIME_DB_USER || 'root',
  password: process.env.RAZZLE_RUNTIME_DB_PW || '',
  database: process.env.RAZZLE_RUNTIME_DB_SCHEMA || 'razzle',
  timezone: process.env.RAZZLE_RUNTIME_DB_TZ || 'Etc/UTC',
  logging: console.log,
  dialect: process.env.RAZZLE_RUNTIME_DB_DIALECT || 'mysql',
  // This ensures that decimals are not converted to strings, but precision may be lost
  dialectOptions: { decimalNumbers: true, charset: 'utf8_general_ci' },
  define: {
    charset: 'utf8',
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  operatorsAliases: Sequelize.Op,
};

const db = {
  development: defaultConfig,
  test: Object.assign({}, defaultConfig, {
    database: `${defaultConfig.database}_test`,
  }),
  production: defaultConfig,
};

module.exports = db;
