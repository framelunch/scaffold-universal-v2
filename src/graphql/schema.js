module.exports = `
input SignInInput {
  email: String
  password: String
}
type User {
  _id: ID!
  name: String!
  email: String!
  role: String!
  provider: String!
}
`;
