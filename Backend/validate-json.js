// Helper script to validate your service account JSON
// Run this with: node validate-json.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Service Account JSON Validator\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.log('   Please create a .env file by copying .env.example');
    process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

// Find GOOGLE_SERVICE_ACCOUNT_KEY line
let jsonLine = null;
let lineNumber = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('GOOGLE_SERVICE_ACCOUNT_KEY=')) {
        jsonLine = line.substring('GOOGLE_SERVICE_ACCOUNT_KEY='.length);
        lineNumber = i + 1;
        break;
    }
}

if (!jsonLine) {
    console.error('❌ GOOGLE_SERVICE_ACCOUNT_KEY not found in .env file!');
    console.log('   Please add this line to your .env file:');
    console.log('   GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}');
    process.exit(1);
}

if (jsonLine.length === 0) {
    console.error('❌ GOOGLE_SERVICE_ACCOUNT_KEY is empty!');
    console.log('   Please paste your service account JSON after the = sign');
    process.exit(1);
}

console.log(`📍 Found GOOGLE_SERVICE_ACCOUNT_KEY on line ${lineNumber}`);
console.log(`📏 Length: ${jsonLine.length} characters\n`);

// Try to parse the JSON
try {
    const parsed = JSON.parse(jsonLine);

    console.log('✅ JSON is valid!\n');
    console.log('📋 Service Account Details:');
    console.log(`   Type: ${parsed.type}`);
    console.log(`   Project ID: ${parsed.project_id}`);
    console.log(`   Client Email: ${parsed.client_email}`);
    console.log(`   Private Key: ${parsed.private_key ? '✓ Present' : '✗ Missing'}`);

    console.log('\n✅ Your service account credentials are configured correctly!');
    console.log('   You can now start the server with: npm run dev');

} catch (error) {
    console.error('❌ JSON parsing failed!\n');
    console.error(`Error: ${error.message}\n`);

    console.log('🔧 Common issues and fixes:\n');
    console.log('1. **Line breaks in JSON**');
    console.log('   ❌ Wrong: GOOGLE_SERVICE_ACCOUNT_KEY={');
    console.log('              "type": "service_account",');
    console.log('              ...');
    console.log('            }');
    console.log('   ✅ Correct: GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}');
    console.log('');
    console.log('2. **Extra quotes or characters**');
    console.log('   ❌ Wrong: GOOGLE_SERVICE_ACCOUNT_KEY="{...}"');
    console.log('   ✅ Correct: GOOGLE_SERVICE_ACCOUNT_KEY={...}');
    console.log('');
    console.log('3. **Spaces around the = sign**');
    console.log('   ❌ Wrong: GOOGLE_SERVICE_ACCOUNT_KEY = {...}');
    console.log('   ✅ Correct: GOOGLE_SERVICE_ACCOUNT_KEY={...}');
    console.log('');
    console.log('📝 How to fix:');
    console.log('   1. Open your service-account-key.json file');
    console.log('   2. Select ALL content (Ctrl+A)');
    console.log('   3. Copy it (Ctrl+C)');
    console.log('   4. Open your .env file');
    console.log('   5. Find the line: GOOGLE_SERVICE_ACCOUNT_KEY=');
    console.log('   6. Paste the JSON RIGHT AFTER the = sign (no spaces, no quotes)');
    console.log('   7. Make sure it\'s all on ONE LINE');
    console.log('   8. Save the file');
    console.log('');
    console.log('💡 Tip: Use a text editor like VS Code, not Notepad');

    process.exit(1);
}
