const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Parse CSV function (simplified version of your frontend parser)
function parseCsv(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map(value => value.trim());
    const obj = {};
    
    headers.forEach((header, i) => {
      if (['latitude', 'longitude'].includes(header)) {
        obj[header] = parseFloat(values[i] || '0');
      } else if (header === 'isPublic') {
        obj[header] = values[i]?.toLowerCase() === 'true';
      } else {
        obj[header] = values[i] || '';
      }
    });
    
    return obj;
  });
}

// Seed the database
async function seedDatabase() {
  // MongoDB connection
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/onthetable';
  console.log('Connecting to MongoDB for seeding...');
  
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const locationsCollection = db.collection('locations');
    
    // Check if collection is empty
    const count = await locationsCollection.countDocuments();
    if (count > 0) {
      console.log(`Collection already has ${count} documents. Skipping seed.`);
      return;
    }
    
    // Read CSV file from public directory
    const csvPath = path.join(__dirname, '..', 'public', 'data', 'locations.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV
    const locations = parseCsv(csvData);
    if (locations.length === 0) {
      console.log('No locations found in CSV. Nothing to seed.');
      return;
    }
    
    // Insert into database
    const result = await locationsCollection.insertMany(locations);
    console.log(`Successfully seeded ${result.insertedCount} locations`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Closed MongoDB connection');
  }
}

// Run the seed function
seedDatabase().catch(console.error); 