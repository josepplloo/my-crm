const User = require('../models/User');
const Product = require('../models/Product');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const newToken = (user, secret, expiresIn) => {
  const {id, email, name, surname} = user;
  return jwt.sign({id, email, name, surname}, secret, {expiresIn});
}

const resolvers = {
  Query: {
    getUserByToken: async(_, {token}) => {
      const userID = await jwt.verify(token, process.env.SECRET);
      return userID;
    }
  },
  Mutation: {
    newUser: async(_, {input}) => {
      const { email, password } = input;

      const userExist = await User.findOne({email});
      if(userExist) {
        throw new Error('the user exist');
      }

      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
         const user = new User(input);
         user.save();
         return user;
      } catch (error) {
        console.error('erro creating new user', error);
      }
    },
    authUser: async(_, {input}) => {
      const { email, password } = input;

      const userExist = await User.findOne({email});
      if(!userExist) {
        throw new Error('the user not exist');
      }

      // check if pass is correct
      const passCorrect = await bcryptjs.compare(password, userExist.password);
      if(!passCorrect) {
        throw new Error('the password is incorrect');
      }

      return {
        token: newToken(userExist, process.env.SECRET, '24h')
      }
    },
    newProduct: async (_,{input}) => {
      try {
        const product = new Product(input);
        const result = await product.save();
        return result;
      } catch (error) {
        console.log('the product creation fails', error);
      }
    }
  }
};

module.exports = resolvers; 
