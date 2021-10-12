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
    },
    getAllProducts: async() => {
      try {
        return await Product.find({});
      } catch (error) {
        console.error('error fetchin the products', error);
      }
    },
    getProduct:  async(_, {id}) => {
      const product = await Product.findById(id);
      if(!product) {
        throw new Error('Product not found');
      }
      return product;
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
        console.error('error creating new user', error);
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
    },
    updateProduct: async (_,{id, input}) => {
      const product = await Product.findById(id);
      if(!product) {
        throw new Error('Product not found');
      }
      return await Product.findOneAndUpdate({_id: id}, input, {new: true});
    },
    deleteProduct: async (_,{id}) => {
      const product = await Product.findById(id);
      if(!product) {
        throw new Error('Product not found');
      }
      await Product.findOneAndDelete({_id: id});
      return 'Product deleted';
    }
  }
};

module.exports = resolvers; 
