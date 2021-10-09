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
  }
};

module.exports = resolvers; 
