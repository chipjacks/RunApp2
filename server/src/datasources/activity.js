const { RESTDataSource } = require('apollo-datasource-rest');
const { ApolloError } = require('apollo-server');

class ActivityAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.jsonbin.io/b/5ce402ac0e7bd93ffac14a4c/';
  }

  async getActivities() {
    const response = await this.get('latest');
    return Array.isArray(response)
      ? response.map(activity => this.activityReducer(activity))
      : [];
  }

  async putActivities(activities) {
    return this.put('', activities);
  }

  activityReducer(activity) {
    return {
      id : activity.id,
      completed: activity.completed,
      date: activity.date,
      description: activity.description,
      duration: activity.duration,
      pace: activity.pace
     }
  }
}

module.exports = ActivityAPI;
