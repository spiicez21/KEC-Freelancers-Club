import { google } from 'googleapis';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account credentials from environment variable
let credentials: any;
try {
    let credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    // If not found, try base64 encoded version
    if (!credentialsJson && process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64) {
        console.log('📦 Decoding base64 credentials...');
        credentialsJson = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8');
    }

    if (!credentialsJson) {
        throw new Error('Neither GOOGLE_SERVICE_ACCOUNT_KEY nor GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 environment variable is set');
    }

    credentials = JSON.parse(credentialsJson);
    console.log('✅ Service account credentials loaded successfully');
} catch (error: any) {
    console.warn('⚠️  Service account credentials not configured.');
    console.warn('   Please set GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 in your .env file.');
    console.warn('   The server will continue but Google API calls will fail.');
    console.warn('   Error:', error.message);
}

// Create JWT client for authentication
const auth = credentials ? new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
    ],
}) : null;

// Initialize Google Sheets API
export const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;

// Initialize Google Drive API
export const drive = auth ? google.drive({ version: 'v3', auth }) : null;

// Sheet configuration
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '';
export const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

// Sheet names
export const SHEETS = {
    USERS: 'Users',
    PROJECTS: 'Projects',
    APPLICATIONS: 'Applications',
};

// Initialize sheets if they don't exist
export async function initializeSheets() {
    if (!sheets || !SPREADSHEET_ID) {
        console.warn('⚠️  Google Sheets not configured. Skipping initialization.');
        return;
    }

    try {
        // Check if spreadsheet exists and get sheet names
        const response = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        const existingSheets = response.data.sheets?.map(s => s.properties?.title) || [];

        // Create Users sheet if it doesn't exist
        if (!existingSheets.includes(SHEETS.USERS)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: { title: SHEETS.USERS },
                        },
                    }],
                },
            });

            // Add headers
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEETS.USERS}!A1:S1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[
                        'id', 'name', 'email', 'password_hash', 'role', 'status', 'tagline', 'bio',
                        'tech_stack', 'profile_image_url', 'banner_image_url', 'availability', 'rate',
                        'experience', 'github', 'linkedin', 'portfolio', 'created_at', 'updated_at'
                    ]],
                },
            });
        }

        // Create Projects sheet if it doesn't exist
        if (!existingSheets.includes(SHEETS.PROJECTS)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: { title: SHEETS.PROJECTS },
                        },
                    }],
                },
            });

            // Add headers
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEETS.PROJECTS}!A1:G1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[
                        'id', 'user_id', 'title', 'link', 'description', 'image_url', 'created_at'
                    ]],
                },
            });
        }

        // Create Applications sheet if it doesn't exist
        if (!existingSheets.includes(SHEETS.APPLICATIONS)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: { title: SHEETS.APPLICATIONS },
                        },
                    }],
                },
            });

            // Add headers
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEETS.APPLICATIONS}!A1:E1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[
                        'id', 'user_id', 'status', 'submitted_at', 'reviewed_at'
                    ]],
                },
            });
        }

        console.log('✅ Google Sheets initialized successfully');
    } catch (error: any) {
        console.error('❌ Error initializing Google Sheets:', error.message);
    }
}

export default auth;
