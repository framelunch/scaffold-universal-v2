const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { verify } = require('../auth/auth.service');
const schema = require('./schema');

const User = require('../models/User');


const router = express.Router();
const isGUI = process.env.NODE_ENV === 'development';

const rootSchema = `
type Query {
  me: User
  users: [User]
}
type Mutation {
  signIn(input: SignInInput): String
}
`;

const root = {
  me(opt, req) {
    return User
      .findById(req.user._id, '-salt -hashedPassword -emailActivate')
      .then(data => data);
  },
  users({ query = {}, limit = 100, page = 0, sort = '_id' }) {
    return User
      .find(query)
      .sort(sort)
      .limit(limit)
      .skip(page * limit)
      .exec()
      .then(data => data);
  },
};

router.all('/', verify(), graphqlHTTP({
  schema: buildSchema(schema + rootSchema),
  rootValue: root,
  graphiql: isGUI,
}));

module.exports = router;
