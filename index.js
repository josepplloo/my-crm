const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDB = require('./config/db');

const server = new ApolloServer({
  typeDefs,
  resolvers
});

connectDB();
server.listen().then(({url}) =>  console.log(`🚀  Server ready at ${url}`));
