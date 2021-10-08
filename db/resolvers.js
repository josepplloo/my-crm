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
    getCourses: () => data,
    getTechs: () => data
  }
};

module.exports = resolvers; 
