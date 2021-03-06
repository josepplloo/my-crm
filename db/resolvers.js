const User = require('../models/User');
const Client = require('../models/Client');
const Product = require('../models/Product');
const Order = require('../models/Order');
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
    },
    getAllOrders: async() => {
      try {
        return await Order.find({});
      } catch (error) {
        console.error('error fetchin the Orders', error);
      }
    },
    getOrdersByUser: async(_, {}, ctx) => {
      try {
        const orders = await Order.find({salesPerson: ctx.id.toString()})
        return orders;
      } catch (error) {
        console.error('error fetchin the Orders', error);
      }
    },
    getOrder: async(_, {id}, ctx) => {
      const order = await Order.findById(id);
      if(!order) {
        throw new Error('order not found');
      }
      if (Order.salesPerson.toString() !== ctx.id ) {
        throw new Error('order not belong to the user');
      }
      return order;
    },
    getOrdersByState: async(_, {state}, ctx) => {
      try {
        const orders = await Order.find({salesPerson: ctx.id.toString(), state})
        return orders;
      } catch (error) {
        console.error('error fetchin the Orders', error);
      }
    },
    getTopClients: async() => {
      try {
        const clients = await Client.aggregate([
          { $match : { state : "COMPLETED" } },
            { $group : {
                _id : "$client", 
                total: { $sum: '$total' }
            }}, 
            {
                $lookup: {
                    from: 'client', 
                    localField: '_id',
                    foreignField: "_id",
                    as: "client"
                }
            }, 
            {
                $limit: 10
            }, 
            {
                $sort : { total : -1 }
            
            }
          ])
        return clients;
      } catch (error) {
        console.error('error fetchin the Orders', error);
      }
    },
    bestSalesPerson: async () => {
      const salesPerson = await Order.aggregate([
          { $match : { state : "COMPLETED"} },
          { $group : {
              _id : "$salesPerson", 
              total: {$sum: '$total'}
          }},
          {
              $lookup: {
                  from: 'user', 
                  localField: '_id',
                  foreignField: '_id',
                  as: 'salesPerson'
              }
          }, 
          {
              $limit: 3
          }, 
          {
              $sort: { total : -1 }
          }
      ]);

      return salesPerson;
    },
    findProduct: async(_, { text }) => {
        const products = await Producto.find({ $text: { $search: text } }).limit(10)

        return products;
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
        throw new Error('Client does not belong to the user');
      }
      return await Client.findOneAndUpdate({_id: id}, input, {new: true});
    },
    deleteClient: async(_,{id}, ctx) => {
      const client = await Client.findById(id);
      if(!client) {
        throw new Error('Client not found');
      }
      if (client.salesPerson.toString() !== ctx.id ) {
        throw new Error('Client does not belong to the user');
      }
      await Client.findOneAndDelete({_id: id});
      return 'Client deleted';
    },
    newOrder: async(_, {input}, ctx) => {
      const { client, products } = input;
      const clientExist = await Client.findById(client);
      if(!clientExist) {
        throw new Error('client does not exist');
      }
      if (clientExist.salesPerson.toString() !== ctx.id ) {
        throw new Error('Client does not belong to the user');
      }

      const productsExist = await Product.find({_id: {$in: products}});
      if(productsExist.length !== products.length) {
        throw new Error('the products do not exist');
      }
      
      products.forEach(product => {
        const {id} = product;

        const productFinded = Product.findById(id);
        
        if(productFinded.stock < product.quantity) {
          throw new Error(`No stock for the product: ${id}`);
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
    updateOrder: async (_,{id, input}, ctx) => {
      const order = await Order.findById(id);
      const { client, products } = input;
      const clientExist = await Client.findById(client);
      if(!clientExist) {
        throw new Error('client does not exist');
      }
      if(!order) {
        throw new Error('Order not found');
      }

      if (clientExist.salesPerson.toString() !== ctx.id ) {
        throw new Error('Order does not belong to the user');
      }

      products.forEach(product => {
        const {id} = product;

        const productFinded = Product.findById(id);
        
        if(productFinded.stock < product.quantity) {
          throw new Error(`No stock for the product: ${id}`);
        }else{
          productFinded.stock -= product.quantity;
          productFinded.save();
        }
      });

      return await Order.findOneAndUpdate({_id: id}, input, {new: true});
    },
    deleteOrder: async(_,{id}, ctx) => {
      const order = await Order.findById(id);
      if(!order) {
        throw new Error('Order not found');
      }
      if (order.salesPerson.toString() !== ctx.id ) {
        throw new Error('Order does not belong to the user');
      }
      await Order.findOneAndDelete({_id: id});
      return 'Order deleted';
    }
  }
};

module.exports = resolvers; 
