import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing .env file formatting...\n');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    process.exit(1);
}

// Read the file
let content = fs.readFileSync(envPath, 'utf-8');

// Fix spaces around = signs
const lines = content.split('\n');
const fixedLines = lines.map(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') {
        return line;
    }

    // Remove spaces around =
    const match = line.match(/^([^=]+)\s*=\s*(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        return `${key}=${value}`;
    }

    return line;
});

// Write back
const fixedContent = fixedLines.join('\n');
fs.writeFileSync(envPath, fixedContent, 'utf-8');

console.log('✅ Fixed .env file!');
console.log('\n📋 Changes made:');
console.log('   - Removed spaces around = signs');
console.log('   - Trimmed whitespace from values');
console.log('\n🔄 Next step: Restart the backend server');
console.log('   Stop the current server (Ctrl+C) and run: npm run dev\n');
