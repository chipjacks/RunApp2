module.exports = {
  Query: {
    activities: (_, __, { dataSources }) =>
      dataSources.activityAPI.activities(),
  }
};
