const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const ActivityAPI = require('./datasources/activity');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    activityAPI: new ActivityAPI()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
