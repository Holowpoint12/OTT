// src/utils/csvParser.js

// Simple CSV parser for location data
export function parseCsv(csvText) {
  // Split by lines and remove any empty lines
  const lines = csvText.split('\n').filter(line => line.trim());
  
  // First line is the header
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parse each data line
  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map(value => value.trim());
    const obj = { id: index + 1 }; // Add an ID for each row
    
    // Map CSV column values to object properties
    headers.forEach((header, i) => {
      // Convert numeric values
      if (['latitude', 'longitude'].includes(header)) {
        obj[header] = parseFloat(values[i]);
      } 
      // Convert boolean values
      else if (header === 'isPublic') {
        obj[header] = values[i].toLowerCase() === 'true';
      } 
      // Keep strings as they are
      else {
        obj[header] = values[i];
      }
    });
    
    return obj;
  });
} 