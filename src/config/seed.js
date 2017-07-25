const User = require('../models/User');

const createUser = () => {
  User.find({}).remove(() => {
    User.create(
      {
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'testtest',
        emailActivate: true,
      }, {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'adminadmin',
        emailActivate: true,
      }, {
        provider: 'local',
        name: 'general',
        email: 'ga@framelunch.jp',
        password: 'password',
        emailActivate: true,
      },
      () => console.log('finished populating users'),
    );
  });
};

module.exports = () => {
  createUser();
};
