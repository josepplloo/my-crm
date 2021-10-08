# My CRM
## Advance React course: Next.js, Apollo, GraphQL & MongoDB

https://www.udemy.com/course/fullstack-react-graphql-y-apollo-de-principiante-a-experto/learn/lecture/19070614#overview

## Definitions

- **Next.js** 
- **Apollo** Is a platform that provides a comunication layer between the data and the apps.
    - **ApolloServer** Is a package create a instace of Apollo graphQL server, this is backend side, this instance need two things: the schemas and the resolvers.
    - **Schemas** there are type/query definitions, has assing the `typeDefs` param, there are needed to describe the types that the `DAO` have, there are like a `DAO` but with a graphQL.
    - **Resolvers** there are functions for get data from de database, the resolver function have 4 elements:
      - _parent Data_: is used to anidate query results.
      - _obj input_: is the argument of your resolver.
      - _security ctx_: is for sharing variables among resolvers.
      - _query info_: meta data about the query.
- **GraphQL** Is a tech created by FB to create customs APIs base on a new query language based on graphs.
- **MongoDB** Is a document based database.
