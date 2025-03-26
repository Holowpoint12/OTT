const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const LocationAPI = require('./dataSources/locationAPI');

async function startServer() {
  // Create Express app
  const app = express();
  
  // Set up MongoDB connection (you'll configure this later)
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/onthetable';
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const database = client.db();
    const locationsCollection = database.collection('locations');
    
    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        locationAPI: new LocationAPI(locationsCollection)
      })
    });
    
    await server.start();
    server.applyMiddleware({ app });
    
    // Start Express server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer(); 