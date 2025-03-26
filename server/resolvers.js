// This will be connected to MongoDB later
const resolvers = {
  Query: {
    locations: async (_, __, { dataSources }) => {
      return dataSources.locationAPI.getLocations();
    },
    location: async (_, { id }, { dataSources }) => {
      return dataSources.locationAPI.getLocationById(id);
    }
  },
  Mutation: {
    addLocation: async (_, locationData, { dataSources }) => {
      return dataSources.locationAPI.addLocation(locationData);
    }
  }
};

module.exports = resolvers; 