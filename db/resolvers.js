const User = require('../models/User');
const bcryptjs = require('bcryptjs');

const data = [
  {
    id: 1,
    title: 'course 1',
    tech: 'ES6'
  },
  {
    id: 2,
    title: 'course 3',
    tech: 'Python'
  },
  {
    id: 3,
    title: 'course 2',
    tech: 'Ruby'
  }
];

const resolvers = {
  Query: {
    getCourses: (_, {input}, ctx, info) => data.filter((course) => input.tech === course.tech),
    getTechs: () => data
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
    }
  }
};

module.exports = resolvers; 
