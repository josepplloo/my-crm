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
`;

module.exports = typeDefs;
