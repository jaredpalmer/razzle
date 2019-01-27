const seedUsers = async models => {
  try {
    const { User } = models;

    const user = await User.findOne();

    if (!user) {
      if (process.env.NODE_ENV !== 'test')
        console.log('No user found. Creating default users.');

      await User.create({
        username: 'John',
        email: 'john@razzle.com',
      });

      if (process.env.NODE_ENV !== 'test')
        console.log('Inserted default User record');
    } else if (process.env.NODE_ENV !== 'test') console.log('User found');
  } catch (err) {
    throw err;
  }
};

export default seedUsers;
