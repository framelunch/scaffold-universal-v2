const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  // FIXME: .env.productionは本番環境ごとにリモートサーバー上で用意する。git管理しない
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}

const { DOMAIN, MONGODB_URI } = process.env;

module.exports = {
  userRoles: ['guest', 'user', 'admin'], // 配列の順番で権限の序列がある

  // Mongo
  mongo: {
    uri: MONGODB_URI,
    options: {
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
