module.exports = {
  Query: {
    activities: (_, __, { dataSources }) =>
      dataSources.activityAPI.getActivities(),
  },
  Mutation: {
    createActivity: async (_, { activity }, { dataSources }) => {
      const activities = await dataSources.activityAPI.getActivities();
      activities.push(activity);
      const results = await dataSources.activityAPI.putActivities(activities);

      return {
        success: results.success,
        message: 'created activity',
        activities: results.data
      }
    },
    deleteActivity: async (_, { activityId }, { dataSources }) => {
      const activities = await dataSources.activityAPI.getActivities();
      filtered = activities.filter(activity => activity.id !== activityId);
      const results = await dataSources.activityAPI.putActivities(filtered);

      return {
        success: results.success,
        message: 'deleted activity',
        activities: results.data
      }
    }
  }
};
