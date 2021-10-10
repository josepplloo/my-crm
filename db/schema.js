const { gql } = require('apollo-server');

const typeDefs = gql`
  type Course {
    title: String
  }

  type Tech {
    tech: String
  }

  input InputCourse {
    tech: String
  }

  type Query {
    getCourses(input: InputCourse!): [Course]
    getTechs: [Tech]
  }

  type User {
    id: ID
    name: String
    surname: String
    email: String
    created: String

  }

  input InputUser {
    name: String!
    surname: String!
    email: String!
    password: String!
  }
  
  type Mutation {
    newUser(input: InputUser): User
  }
`;

module.exports = typeDefs;
