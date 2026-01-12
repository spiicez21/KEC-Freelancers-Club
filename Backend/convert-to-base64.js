import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the service account JSON file
const jsonPath = path.join(__dirname, 'service-account-key.json');

if (!fs.existsSync(jsonPath)) {
    console.error('❌ service-account-key.json not found!');
    console.log('   Please place your service account JSON file in the Backend directory');
    process.exit(1);
}

const jsonContent = fs.readFileSync(jsonPath, 'utf-8');

// Validate it's valid JSON
try {
    JSON.parse(jsonContent);
    console.log('✅ JSON file is valid');
} catch (error) {
    console.error('❌ Invalid JSON file:', error.message);
    process.exit(1);
}

// Convert to base64
const base64 = Buffer.from(jsonContent).toString('base64');

// Write to file
const outputPath = path.join(__dirname, 'base64-credentials.txt');
const envLine = `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=${base64}`;

fs.writeFileSync(outputPath, envLine, 'utf-8');

console.log('\n✅ Base64 credentials saved to: base64-credentials.txt');
console.log('\n📋 Next steps:');
console.log('   1. Open base64-credentials.txt');
console.log('   2. Copy the entire line');
console.log('   3. Open your .env file');
console.log('   4. Remove or comment out the GOOGLE_SERVICE_ACCOUNT_KEY= line');
console.log('   5. Paste the line from base64-credentials.txt');
console.log('   6. Save .env and restart the server\n');
