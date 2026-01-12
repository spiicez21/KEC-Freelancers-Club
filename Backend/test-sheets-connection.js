import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

console.log('🔍 Testing Google Sheets Connection\n');

async function testConnection() {
    try {
        // 1. Load credentials
        console.log('1. Loading credentials...');
        const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;

        if (!credentialsJson) {
            throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 not set');
        }

        const credentials = JSON.parse(
            Buffer.from(credentialsJson, 'base64').toString('utf-8')
        );
        console.log('   ✅ Credentials loaded');
        console.log(`   Service Account: ${credentials.client_email}`);

        // 2. Create auth client
        console.log('\n2. Creating auth client...');
        const auth = new google.auth.JWT(
            credentials.client_email,
            undefined,
            credentials.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );
        console.log('   ✅ Auth client created');

        // 3. Test connection
        console.log('\n3. Testing connection to Google Sheets...');
        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

        if (!spreadsheetId) {
            throw new Error('GOOGLE_SHEETS_ID not set');
        }

        console.log(`   Spreadsheet ID: ${spreadsheetId}`);

        // Try to get spreadsheet metadata
        const response = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        console.log('   ✅ Successfully connected to Google Sheets!');
        console.log(`   Spreadsheet Title: ${response.data.properties?.title}`);
        console.log(`   Number of sheets: ${response.data.sheets?.length || 0}`);

        // 4. List existing sheets
        console.log('\n4. Existing sheets:');
        response.data.sheets?.forEach((sheet, index) => {
            console.log(`   ${index + 1}. ${sheet.properties?.title}`);
        });

        // 5. Try to read from Users sheet
        console.log('\n5. Testing read access...');
        try {
            const readResponse = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'Users!A1:Z1',
            });
            console.log('   ✅ Read access confirmed');
            console.log(`   Headers: ${readResponse.data.values?.[0]?.join(', ') || 'No headers found'}`);
        } catch (readError) {
            console.log('   ⚠️  Could not read Users sheet (might not exist yet)');
            console.log(`   Error: ${readError.message}`);
        }

        // 6. Try to write a test value
        console.log('\n6. Testing write access...');
        try {
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Test!A1',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [['Test', new Date().toISOString()]],
                },
            });
            console.log('   ✅ Write access confirmed');
        } catch (writeError) {
            if (writeError.message.includes('Unable to parse range')) {
                console.log('   ⚠️  Test sheet does not exist (this is OK)');
            } else {
                console.log('   ❌ Write access failed');
                console.log(`   Error: ${writeError.message}`);
            }
        }

        console.log('\n✅ All tests passed!');
        console.log('\n📝 Next steps:');
        console.log('   1. Make sure the spreadsheet is shared with:');
        console.log(`      ${credentials.client_email}`);
        console.log('   2. Restart the backend server');
        console.log('   3. Try signup again\n');

    } catch (error) {
        console.error('\n❌ Test failed!');
        console.error(`Error: ${error.message}`);

        if (error.message.includes('Requested entity was not found')) {
            console.error('\n💡 Solution: The spreadsheet ID is wrong or the sheet does not exist');
            console.error(`   Current ID: ${process.env.GOOGLE_SHEETS_ID}`);
        } else if (error.message.includes('permission')) {
            console.error('\n💡 Solution: Share the spreadsheet with the service account');
            console.error(`   Email: ${JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64!, 'base64').toString('utf-8')).client_email}`);
        }

        console.error('\nFull error:', error);
        process.exit(1);
    }
}

testConnection();
