const { DOMAIN, MONGODB_URI } = process.env;

module.exports = {
  userRoles: ['guest', 'user', 'admin'], // 配列の順番で権限の序列がある

  session: {
    secrets: 'race-management-tool-2017',
    expire: 60 * 60 * 24 * 7,
  },
  cookie: {
    LOGIN_TOKEN: 'race-management-tool',
  },

  // Mongo
  mongo: {
    uri: MONGODB_URI,
    options: {
      //useMongoClient: true,
      db: { safe: true },
    },
  },

  // SNS
  facebook: {
    clientID: '',
    clientSecret: '',
    callbackURL: `${DOMAIN}/auth/facebook/callback`,
  },

  twitter: {
    clientID: '',
    clientSecret: '',
    callbackURL: `${DOMAIN}/auth/twitter/callback`,
  },

  google: {
    clientID: '',
    clientSecret: '',
    callbackURL: `${DOMAIN}/auth/google/callback`,
  },
};
