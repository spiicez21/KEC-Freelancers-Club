import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Backend Configuration Checker\n');

// Check .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.log('   Run: cp .env.example .env');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

// Parse environment variables
const env = {};
envLines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
            env[key.trim()] = valueParts.join('=').trim();
        }
    }
});

console.log('📋 Configuration Status:\n');

// Check required variables
const checks = [
    { key: 'PORT', required: false, default: '5000' },
    { key: 'JWT_SECRET', required: true },
    { key: 'GOOGLE_SHEETS_ID', required: true },
    { key: 'GOOGLE_DRIVE_FOLDER_ID', required: true },
    { key: 'GOOGLE_SERVICE_ACCOUNT_KEY_BASE64', required: true },
];

let allGood = true;

checks.forEach(check => {
    const value = env[check.key];
    const hasValue = value && value.length > 0;

    if (check.required && !hasValue) {
        console.log(`❌ ${check.key}: Missing (REQUIRED)`);
        allGood = false;
    } else if (hasValue) {
        const displayValue = value.length > 50 ? value.substring(0, 50) + '...' : value;
        console.log(`✅ ${check.key}: ${displayValue}`);
    } else {
        console.log(`⚠️  ${check.key}: Not set (using default: ${check.default})`);
    }
});

console.log('\n');

if (!allGood) {
    console.log('❌ Configuration incomplete!\n');
    console.log('📝 To fix:\n');

    if (!env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64) {
        console.log('1. Copy the line from base64-credentials.txt');
        console.log('   and paste it into your .env file\n');
    }

    if (!env.GOOGLE_SHEETS_ID) {
        console.log('2. Create a Google Sheet and add the ID to .env:');
        console.log('   GOOGLE_SHEETS_ID=your-sheet-id-here\n');
    }

    if (!env.GOOGLE_DRIVE_FOLDER_ID) {
        console.log('3. Create a Google Drive folder and add the ID to .env:');
        console.log('   GOOGLE_DRIVE_FOLDER_ID=your-folder-id-here\n');
    }

    if (!env.JWT_SECRET) {
        console.log('4. Set a JWT secret in .env:');
        console.log('   JWT_SECRET=your-super-secret-key-here\n');
    }

    process.exit(1);
} else {
    console.log('✅ All required configuration is present!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure your Google Sheet is shared with:');
    console.log('      kfc-131@qualified-world-484010-a1.iam.gserviceaccount.com');
    console.log('   2. Make sure your Google Drive folder is shared with the same email');
    console.log('   3. Restart the server: npm run dev\n');
}
