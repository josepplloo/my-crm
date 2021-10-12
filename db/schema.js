const { gql } = require('apollo-server');

const typeDefs = gql`
  # Users
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
  
  # Product
  type Product {
    id: ID
    name: String
    stock: Int
    price: Float
    created: String
  }

  #User
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

  #Products
  input InputProduct {
    name: String!
    stock: Int!
    price: Float!
  }

  type Query {
    getUserByToken(token: String): User
  }
  
  type Mutation {
    #Users
    newUser(input: InputUser): User
    authUser(input: InputAuth): Token

    #Products
    newProduct(input: InputProduct): Product
  }
`;

module.exports = typeDefs;
