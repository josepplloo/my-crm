const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config({
  path: '.env'
});
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDB = require('./config/db');

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    const authToken = req.headers['authorization'] || '';
    if(authToken) {
      try {
        const user = jwt.verify(authToken.replace('Bearer', '').trim(), process.env.SECRET);
        return user;
      } catch (error) {
        console.error('Error creating the user context', error);
      }
    }
  }
});
server.listen().then(({url}) =>  console.log(`🚀  Server ready at ${url}`));
