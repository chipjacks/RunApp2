const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    activities: [Activity]!
  }

  type Activity {
    id: ID!
    completed: Boolean
    date: String!
    description: String!
    duration: Int!
    pace: Pace
  }

  enum Pace {
    Easy
    Moderate
    SteadyState
    Brisk
    AerobicThreshold
    LactateThreshold
    Groove
    VO2Max
    Fast
  }

  input ActivityInput {
    id: ID!
    completed: Boolean
    date: String!
    description: String!
    duration: Int!
    pace: Pace
  }

  type Mutation {
    createActivity(activity: ActivityInput!): ActivityUpdateResponse!
    deleteActivity(activityId: ID!): ActivityUpdateResponse!
  }

  type ActivityUpdateResponse {
    success: Boolean!
    message: String
    activities: [Activity]!
  }
`;

module.exports = typeDefs;
