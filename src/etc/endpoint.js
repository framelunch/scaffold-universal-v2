const { DOMAIN } = process.env;

module.exports = {
  // API_AUTH_LOCAL: `${DOMAIN}/auth/local`,

  API_USERS: `${DOMAIN}/api/users`,
  API_USERS_ME: `${DOMAIN}/api/users/me`,
  API_USERS_ME_RANCH: `${DOMAIN}/api/users/me/ranch`,
  API_USERS_ME_EMAIL: `${DOMAIN}/api/users/me/email`,
  API_USERS_ME_PASSWORD: `${DOMAIN}/api/users/me/password`,

};
