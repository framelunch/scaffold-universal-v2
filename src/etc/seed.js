const User = require('../models/User');

const createUser = () => (
  User
    .find({})
    .remove()
    .then(() => (
      User.create(
        {
          id: 'admin',
          password: 'adminadmin',
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: 'admin@admin.com',
          emailActivate: true,
          ranches: [],
        }, {
          id: 'test',
          password: 'testtest',
          provider: 'local',
          name: 'Test User',
          email: 'test@test.com',
          emailActivate: true,
          ranches: [],
        }, {
          id: 'local',
          password: 'password',
          provider: 'local',
          name: 'general',
          email: 'ga@framelunch.jp',
          emailActivate: true,
          ranches: [],
        },
      )
    ))
    .then(data => {
      console.log('finished populating users');
      return data;
    })
);

module.exports = () => {
  createUser().then(data => {
    console.log('finished seed');
  });
};
