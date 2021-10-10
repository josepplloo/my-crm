const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID
    name: String
    surname: String
    email: String
    created: String

  }

  type Token {
    token: String
  }

  input InputUser {
    name: String!
    surname: String!
    email: String!
    password: String!
  }

  input InputAuth {
    email: String!
    password: String!
  }

  type Query {
    getUserByToken(token: String): User
  }
  
  type Mutation {
    newUser(input: InputUser): User
    authUser(input: InputAuth): Token
  }
`;

module.exports = typeDefs;
