/**
 * MongoDB Connection Test Script
 * 
 * Run this script with: node test-db-connection.js
 * It will attempt to connect to your MongoDB Atlas database and verify connectivity
 */

const { testConnection } = require('./server/db/connection');

console.log('Starting MongoDB connection test...');
console.log('Attempting to connect to MongoDB Atlas at the URL in your .env file');
console.log('Server will use port:', process.env.PORT || 4001);

testConnection()
  .then(success => {
    if (success) {
      console.log('\n=================================');
      console.log('✅ CONNECTION TEST SUCCESSFUL!');
      console.log('=================================\n');
      console.log('Your application should work correctly with MongoDB Atlas.');
      console.log('If you are still having issues, please check:');
      console.log('1. Your network connection and firewall settings');
      console.log('2. The MongoDB Atlas Access List (whitelist) settings');
      console.log('3. That your database name and credentials are correct');
      console.log(`4. That port ${process.env.PORT || 4001} is not in use by another process`);
    } else {
      console.log('\n=================================');
      console.log('❌ CONNECTION TEST FAILED');
      console.log('=================================\n');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Test error:', err);
    process.exit(1);
  }); 