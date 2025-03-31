const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ObjectId } = require('mongodb');

class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class DatabaseError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
  }
}

class FarminfoAPI extends MongoDataSource {
  constructor(collection) {
    // Make sure we have a valid collection
    if (!collection) {
      console.error('FarminfoAPI constructor called without a valid collection');
      throw new Error('FarminfoAPI requires a valid MongoDB collection');
    }
    
    console.log('Initializing FarminfoAPI with collection:', collection.collectionName);
    super(collection);
    this.collection = collection;
  }

  validateFarminfo(farminfoData) {
    const errors = [];
    
    if (!farminfoData.name?.trim()) {
      errors.push(new ValidationError('name', 'Name is required'));
    }
    if (!farminfoData.address?.trim()) {
      errors.push(new ValidationError('address', 'Address is required'));
    }
    
    // Additional validation can be added as needed

    return errors;
  }

  async getFarminfos() {
    try {
      console.log('Fetching all farminfo entries from MongoDB collection:', this.collection.collectionName);
      const farminfos = await this.collection.find({}).toArray();
      console.log(`Found ${farminfos.length} farminfo entries`);
      
      // Transform _id to id for GraphQL
      return farminfos.map(farminfo => {
        if (farminfo._id) {
          return {
            ...farminfo,
            id: farminfo._id.toString()
          };
        }
        return farminfo;
      });
    } catch (error) {
      console.error('Error fetching farminfo entries from MongoDB:', error);
      throw new DatabaseError('Failed to fetch farminfo entries', 'FETCH_ERROR');
    }
  }

  async getFarminfoById(id) {
    try {
      console.log(`Fetching farminfo with ID ${id} from collection:`, this.collection.collectionName);
      if (!ObjectId.isValid(id)) {
        throw new ValidationError('id', 'Invalid farminfo ID format');
      }
      const objectId = new ObjectId(id);
      const farminfo = await this.collection.findOne({ _id: objectId });
      
      if (!farminfo) {
        console.log(`Farminfo with ID ${id} not found`);
        throw new ValidationError('id', 'Farminfo not found');
      }
      
      console.log('Farminfo found:', farminfo);
      return {
        ...farminfo,
        id: farminfo._id.toString()
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error(`Error fetching farminfo with ID ${id}:`, error);
      throw new DatabaseError('Failed to fetch farminfo', 'FETCH_ERROR');
    }
  }

  async addFarminfo(farminfoData) {
    try {
      const validationErrors = this.validateFarminfo(farminfoData);
      if (validationErrors.length > 0) {
        throw validationErrors;
      }

      const farminfoWithTimestamps = {
        ...farminfoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await this.collection.insertOne(farminfoWithTimestamps);
      return {
        id: result.insertedId.toString(),
        ...farminfoWithTimestamps
      };
    } catch (error) {
      if (Array.isArray(error)) {
        throw error;
      }
      console.error('Error adding farminfo to MongoDB:', error);
      throw new DatabaseError('Failed to add farminfo', 'INSERT_ERROR');
    }
  }

  async updateFarminfo(id, farminfoData) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new ValidationError('id', 'Invalid farminfo ID format');
      }

      const objectId = new ObjectId(id);
      const existingFarminfo = await this.collection.findOne({ _id: objectId });
      
      if (!existingFarminfo) {
        throw new ValidationError('id', 'Farminfo not found');
      }

      // Validate only the fields that are being updated
      const validationErrors = this.validateFarminfo({
        ...existingFarminfo,
        ...farminfoData
      });
      
      if (validationErrors.length > 0) {
        throw validationErrors;
      }

      const updateData = {
        ...farminfoData,
        updatedAt: new Date().toISOString()
      };

      const result = await this.collection.findOneAndUpdate(
        { _id: objectId },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result.value;
    } catch (error) {
      if (Array.isArray(error) || error instanceof ValidationError) {
        throw error;
      }
      console.error(`Error updating farminfo with ID ${id}:`, error);
      throw new DatabaseError('Failed to update farminfo', 'UPDATE_ERROR');
    }
  }

  async deleteFarminfo(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new ValidationError('id', 'Invalid farminfo ID format');
      }

      const objectId = new ObjectId(id);
      const existingFarminfo = await this.collection.findOne({ _id: objectId });
      
      if (!existingFarminfo) {
        throw new ValidationError('id', 'Farminfo not found');
      }

      const result = await this.collection.deleteOne({ _id: objectId });
      return result.deletedCount > 0;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error(`Error deleting farminfo with ID ${id}:`, error);
      throw new DatabaseError('Failed to delete farminfo', 'DELETE_ERROR');
    }
  }
}

module.exports = FarminfoAPI; 