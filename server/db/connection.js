const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Log the connection string partially redacted for security
    const connectionString = process.env.MONGODB_URI;
    const redactedUri = connectionString.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      'mongodb+srv://$1:****@'
    );
    console.log('Attempting to connect to MongoDB Atlas at:', redactedUri);

    // Set up connection options
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Connect to MongoDB with options
    await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    console.log('MongoDB Atlas connected successfully');

    // Check if we need to seed data
    const Farminfo = require('../models/Farminfo');
    const count = await Farminfo.countDocuments();
    console.log(`Found ${count} documents in 'farminfo' collection`);
    
    if (count === 0) {
      console.log('No farminfo found, seeding initial data...');
      
      // Sample data to seed
      const sampleData = [
        {
          name: "Green Acres Farm",
          address: "123 Rural Route",
          city: "Springfield",
          state: "IL",
          zip: "62701",
          coordinates: {
            lat: 39.781721,
            lng: -89.650148
          },
          category: "Farm",
          isPublic: true,
          description: "Family-owned organic farm offering seasonal produce and farm tours."
        },
        {
          name: "City Farmers Market",
          address: "456 Main Street",
          city: "Chicago",
          state: "IL",
          zip: "60601",
          coordinates: {
            lat: 41.878113,
            lng: -87.629799
          },
          category: "Market",
          isPublic: true,
          description: "Weekly farmers market featuring local producers and artisanal goods."
        },
        {
          name: "Community Garden Collective",
          address: "789 Park Avenue",
          city: "Evanston",
          state: "IL",
          zip: "60201",
          coordinates: {
            lat: 42.045072,
            lng: -87.687697
          },
          category: "Garden",
          isPublic: true,
          description: "Community-run garden space with educational programs and volunteering opportunities."
        }
      ];

      try {
        await Farminfo.insertMany(sampleData);
        console.log('Database seeded successfully with sample farminfo data');
      } catch (seedError) {
        console.error('Error seeding database:', seedError);
      }
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // More helpful error messages based on error code
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB Atlas. Please check:');
      console.error('1. Your network connection');
      console.error('2. If your MongoDB Atlas whitelist includes your IP address');
      console.error('3. If the username and password are correct');
    }
    
    process.exit(1); // Exit with failure
  }
};

// Handle connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

/**
 * Test MongoDB connectivity
 * Run this function to test if the connection to MongoDB Atlas is working
 */
const testConnection = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connection test successful');
    
    // Test ability to query the farminfo collection
    const Farminfo = require('../models/Farminfo');
    const count = await Farminfo.countDocuments();
    console.log(`✅ Successfully queried farminfo collection - found ${count} documents`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    return false;
  }
};

module.exports = connectDB;
// Export the test function as well
module.exports.testConnection = testConnection; 