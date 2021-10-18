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

  #CLient
  type Client {
    id: ID
    name: String
    surname: String
    email: String
    company: String
    telephone: String
    salesPerson: ID
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
    getAllProducts: [Product]
    getProduct(id: ID!): Product
    getAllClients: [Client]
    getClientsByUser: [Client]
    getClient(id: ID!): Client
  }

  #Clients
  input InputClient {
    name: String!
    surname: String!
    email: String!
    company: String!
    telephone: String
  }
  
  type Mutation {
    #Users
    newUser(input: InputUser): User
    authUser(input: InputAuth): Token

    #Products
    newProduct(input: InputProduct): Product
    updateProduct(id: ID!, input: InputProduct): Product
    deleteProduct(id: ID!): String

    #Clients
    newClient(input: InputClient) : Client
    updateClient(id: ID!, input: InputClient): Client
    deleteClient(id: ID!): String
  }
`;

module.exports = typeDefs;
