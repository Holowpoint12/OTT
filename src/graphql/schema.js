// src/graphql/schema.js
// This schema file will be used later when you're ready to connect to MongoDB

// GraphQL schema for locations
const typeDefs = `
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
    locationsByProximity(latitude: Float!, longitude: Float!, distance: Float!): [Location!]!
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
    
    updateLocation(
      id: ID!
      name: String
      address: String
      city: String
      state: String
      zip: String
      latitude: Float
      longitude: Float
      isPublic: Boolean
      description: String
    ): Location
    
    deleteLocation(id: ID!): Boolean
  }
`;

export default typeDefs; 