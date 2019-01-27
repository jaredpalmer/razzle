import Sequelize from 'sequelize';
import loadModels from './models';
import dbConfig from './dbConfig';
import seed from './seed';

const sequelize = new Sequelize(dbConfig[process.env.NODE_ENV]);

const models = loadModels(sequelize);

Object.keys(models).forEach(key => {
  const model = models[key];
  if (model.associate) {
    model.associate(models);
  }
});

sequelize.addHook('afterBulkSync', async () => {
  if (process.env.NODE_ENV !== 'test') await seed(models, sequelize);
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to sequelize database');
  } catch (err) {
    console.log('Unable to connect to the sequelize database: ', err);
    throw err;
  }
};

const close = () => sequelize.close().catch(console.log);

export { models as default, testConnection, sequelize, seed, close };
