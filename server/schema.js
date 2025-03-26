const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Location {
    id: ID!
    name: String!
    address: String!
    city: String!
    state: String!
    zip: String!
    latitude: Float!
    longitude: Float!
    isPublic: Boolean!
    description: String
  }

  type Query {
    locations: [Location!]!
    location(id: ID!): Location
  }

  type Mutation {
    addLocation(
      name: String!
      address: String!
      city: String!
      state: String!
      zip: String!
      latitude: Float!
      longitude: Float!
      isPublic: Boolean!
      description: String
    ): Location!
  }
`;

module.exports = typeDefs; 