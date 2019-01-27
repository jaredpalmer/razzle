const User = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        lowercase: true,
      },
      username: {
        type: DataTypes.STRING(255),
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        required: true,
      },
    },
    {
      tableName: 'Users',
    }
  );

  return User;
};

export default User;
