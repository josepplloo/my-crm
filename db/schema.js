const { gql } = require('apollo-server');

const typeDefs = gql`
  type Course {
    title: String
  }

  type Tech {
    tech: String
  }

  type Query {
    getCourses: [Course]
    getTechs: [Tech]
  }
`;

module.exports = typeDefs;
