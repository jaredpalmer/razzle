import seedUsers from './seedUsers';

const seed = async (models, sequelize) => {
  try {
    await seedUsers(models, sequelize);
    if (process.env.NODE_ENV !== 'test') console.log('Seeding complete');
  } catch (err) {
    throw err;
  }
};

export default seed;
