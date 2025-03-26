const { MongoDataSource } = require('apollo-datasource-mongodb');

class LocationAPI extends MongoDataSource {
  constructor(collection) {
    super(collection);
  }

  async getLocations() {
    return this.collection.find({}).toArray();
  }

  async getLocationById(id) {
    return this.collection.findOne({ _id: id });
  }

  async addLocation(locationData) {
    const result = await this.collection.insertOne(locationData);
    return {
      id: result.insertedId,
      ...locationData
    };
  }
}

module.exports = LocationAPI; 