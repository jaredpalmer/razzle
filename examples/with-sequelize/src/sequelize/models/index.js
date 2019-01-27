import Sequelize from 'sequelize';
import User from './User';

export default sequelize => {
  User(sequelize, Sequelize);

  return sequelize.models;
};
