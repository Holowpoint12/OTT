import { parseCsv } from '../utils/csvParser';

// Fetch locations from the CSV file or eventually from GraphQL
export async function fetchLocations() {
  try {
    // For development, we'll fetch the CSV directly
    const response = await fetch('/data/locations.csv');
    const csvText = await response.text();
    return parseCsv(csvText);
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations');
  }
}

// This function will be used later when connecting to GraphQL
export async function fetchLocationsFromGraphQL() {
  // This will be implemented when you're ready to connect to MongoDB
  throw new Error('GraphQL connection not implemented yet');
} 