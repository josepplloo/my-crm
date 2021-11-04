const User = require('../models/User');
const Client = require('../models/Client');
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
    },
    getAllClients: async() => {
      try {
        return await Client.find({});
      } catch (error) {
        console.error('error fetchin the Clients', error);
      }
    },
    getClientsByUser: async(_, {}, ctx) => {
      try {
        const clients = await Client.find({salesPerson: ctx.id.toString()})
        return clients;
      } catch (error) {
        console.error('error fetchin the Clients', error);
      }
    },
    getClient: async(_, {id}, ctx) => {
      const client = await Client.findById(id);
      if(!client) {
        throw new Error('Client not found');
      }
      if (client.salesPerson.toString() !== ctx.id ) {
        throw new Error('Client not belong to the user');
      }
      return client;
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
    },
    newClient: async(_, { input }, ctx) => {
      const { email } = input;

      input.salesPerson = ctx.id;

      const clientExist = await User.findOne({email});
      if(clientExist) {
        throw new Error('the client exist');
      }
      try {
        const client = new Client(input);
        const result = await client.save();
        return result;
      } catch (error) {
        console.log('the client creation fails', error);
      }
    },
    updateClient: async (_,{id, input}, ctx) => {
      const client = await Client.findById(id);
      if(!client) {
        throw new Error('Client not found');
      }
      if (client.salesPerson.toString() !== ctx.id ) {
        throw new Error('Client not belong to the user');
      }
      return await Client.findOneAndUpdate({_id: id}, input, {new: true});
    },
    deleteClient: async(_,{id}, ctx) => {
      const client = await Client.findById(id);
      if(!client) {
        throw new Error('Client not found');
      }
      if (client.salesPerson.toString() !== ctx.id ) {
        throw new Error('Client not belong to the user');
      }
      await Client.findOneAndDelete({_id: id});
      return 'Client deleted';
    },
    newOrder: async(_, {input}, ctx) => {
      const { client, products, products } = input;
      const clientExist = await Client.findById(client);
      if(!clientExist) {
        throw new Error('the client not exist');
      }
      if (clientExist.salesPerson.toString() !== ctx.id ) {
        throw new Error('Client not belong to the user');
      }
      const productsExist = await Product.find({_id: {$in: products}});
      if(productsExist.length !== products.length) {
        throw new Error('the products not exist');
      }
      products.forEach(product => {
        const {id} = product;
        const productFinded = Product.findById(id);
        if(productFinded.stock < product.quantity) {
          throw new Error(`No stok for the product: ${id}`);
        }else{
          productFinded.stock -= product.quantity;
          productFinded.save();
        }
      });
      try {
        const order = new Order(input);
        order.salesPerson = ctx.id;
        const result = await order.save();
        return result;
      } catch (error) {
        console.log('the order creation fails', error);
      }
    },
  }
};

module.exports = resolvers; 
