const { RESTDataSource } = require('apollo-datasource-rest');

class ActivityAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.jsonbin.io/b/5ce402ac0e7bd93ffac14a4c/latest';
  }

  async activities() {
    const response = await this.get('');
    return Array.isArray(response)
      ? response.map(activity => this.activityReducer(activity))
      : [];
  }

  activityReducer(activity) {
    return {
      id : activity.id,
      completed: activity.completed,
      date: activity.date,
      description: activity.description,
      duration: activity.run ? activity.run.duration : activity.other.duration,
      pace: activity.run ? activity.run.pace : null
     }
  }
}

module.exports = ActivityAPI;
