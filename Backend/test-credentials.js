import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

console.log('🔍 Testing Google Credentials Loading\n');

// Test 1: Check if env vars are loaded
console.log('1. Environment Variables:');
console.log(`   GOOGLE_SHEETS_ID: ${process.env.GOOGLE_SHEETS_ID ? '✅ Set' : '❌ Not set'}`);
console.log(`   GOOGLE_DRIVE_FOLDER_ID: ${process.env.GOOGLE_DRIVE_FOLDER_ID ? '✅ Set' : '❌ Not set'}`);
console.log(`   GOOGLE_SERVICE_ACCOUNT_KEY_BASE64: ${process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 ? '✅ Set (' + process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64.length + ' chars)' : '❌ Not set'}`);

// Test 2: Try to decode base64
console.log('\n2. Base64 Decoding:');
try {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64) {
        const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8');
        console.log('   ✅ Successfully decoded base64');
        console.log(`   Decoded length: ${decoded.length} chars`);

        // Test 3: Try to parse JSON
        console.log('\n3. JSON Parsing:');
        try {
            const credentials = JSON.parse(decoded);
            console.log('   ✅ Successfully parsed JSON');
            console.log(`   Project ID: ${credentials.project_id}`);
            console.log(`   Client Email: ${credentials.client_email}`);
            console.log(`   Has private key: ${credentials.private_key ? '✅ Yes' : '❌ No'}`);
        } catch (jsonError) {
            console.error('   ❌ JSON parsing failed:', jsonError.message);
        }
    } else {
        console.error('   ❌ GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 not set');
    }
} catch (decodeError) {
    console.error('   ❌ Base64 decoding failed:', decodeError.message);
}

console.log('\n✅ Test complete\n');
