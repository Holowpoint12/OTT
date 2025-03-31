const fs = require('fs');
const path = require('path');

// Define the environment files to copy
const envFiles = [
  { example: '.env.example', target: '.env' },
  { example: '.env.development.example', target: '.env.development' },
  { example: path.join('server', '.env.example'), target: path.join('server', '.env') }
];

// Create the environment files if they don't exist
for (const file of envFiles) {
  try {
    if (!fs.existsSync(file.target)) {
      const exampleContent = fs.readFileSync(file.example, 'utf8');
      fs.writeFileSync(file.target, exampleContent);
      console.log(`Created ${file.target} from ${file.example}`);
    } else {
      console.log(`${file.target} already exists, skipping...`);
    }
  } catch (error) {
    console.error(`Error creating ${file.target}: ${error.message}`);
  }
}

console.log('\nEnvironment files setup complete.');
console.log('\nIMPORTANT: Please update your .env files with your actual MongoDB connection string and other sensitive information before running the application.');
console.log('\nThe .env files are listed in .gitignore and will not be pushed to the repository.'); 