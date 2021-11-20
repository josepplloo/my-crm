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

  #Order
  enum OrderStatus {
    PENDING
    PROCESSING
    DELIVERED
  }

  type productOrdered {
    id: ID
    quantity: Int
  }

  type Order {
    id: ID
    client: ID
    salesPerson: ID
    productsOrdered: [productOrdered]
    total: Float
    created: String
    status: OrderStatus
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
    getAllOrders: [Order]
    getOrdersByUser: [Order]
    getOrder(id: ID!): Order
  }

  #Clients
  input InputClient {
    name: String!
    surname: String!
    email: String!
    company: String!
    telephone: String
  }

  #Orders
  input InputProductOrder {
    product: ID!
    quantity: Int!
  }

  input InputOrder {
    client: ID!
    total: Float!
    products: [InputProductOrder]
    status: OrderStatus
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

    #Orders
    newOrder(input: InputOrder) : Order
    updateOrder(id: ID!, input: InputOrder): Order

  }
`;

module.exports = typeDefs;
