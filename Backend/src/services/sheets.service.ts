import { sheets, SPREADSHEET_ID } from '../config/google.js';

export interface SheetRow {
    [key: string]: any;
}

const DEFAULT_HEADERS: { [key: string]: string[] } = {
    'Users': [
        'id', 'name', 'email', 'password_hash', 'role', 'status', 'tagline', 'bio',
        'tech_stack', 'profile_image_url', 'banner_image_url', 'availability', 'rate',
        'experience', 'github', 'linkedin', 'portfolio', 'created_at', 'updated_at'
    ],
    'Projects': [
        'id', 'user_id', 'title', 'link', 'description', 'image_url', 'created_at'
    ],
    'Applications': [
        'id', 'user_id', 'status', 'submitted_at', 'reviewed_at'
    ]
};

export class SheetsService {
    /**
     * Get all rows from a sheet
     */
    static async getAll(sheetName: string): Promise<SheetRow[]> {
        if (!sheets || !SPREADSHEET_ID) {
            throw new Error('Google Sheets not configured');
        }

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `${sheetName}!A:ZZ`,
            });

            const rows = response.data.values || [];
            if (rows.length === 0) return [];

            const headers = rows[0];
            const data = rows.slice(1);

            return data.map(row => {
                const obj: SheetRow = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                });
                return obj;
            });
        } catch (error: any) {
            console.error(`Error getting all rows from ${sheetName}:`, error.message);
            throw error;
        }
    }

    /**
     * Find rows matching a condition
     */
    static async findRows(
        sheetName: string,
        condition: (row: SheetRow) => boolean
    ): Promise<SheetRow[]> {
        const allRows = await this.getAll(sheetName);
        return allRows.filter(condition);
    }

    /**
     * Find a single row matching a condition
     */
    static async findOne(
        sheetName: string,
        condition: (row: SheetRow) => boolean
    ): Promise<SheetRow | null> {
        const rows = await this.findRows(sheetName, condition);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Append a new row to a sheet
     */
    static async appendRow(sheetName: string, data: SheetRow): Promise<void> {
        if (!sheets || !SPREADSHEET_ID) {
            throw new Error('Google Sheets not configured');
        }

        try {
            // Get headers to ensure correct column order
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `${sheetName}!A1:ZZ1`,
            });

            let headers = response.data.values?.[0] || [];

            // If no headers found in sheet, use defaults
            if (headers.length === 0) {
                console.log(`⚠️  No headers found in ${sheetName}, using defaults`);
                headers = DEFAULT_HEADERS[sheetName] || [];

                // If we have defaults but they are not in the sheet, let's try to add them
                if (headers.length > 0) {
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: SPREADSHEET_ID,
                        range: `${sheetName}!A1`,
                        valueInputOption: 'RAW',
                        requestBody: {
                            values: [headers],
                        },
                    });
                }
            }

            if (headers.length === 0) {
                throw new Error(`Could not determine headers for sheet ${sheetName}`);
            }

            const values = headers.map(header => data[header] || '');
            console.log(`📝 Appending row to ${sheetName}:`, JSON.stringify(data));

            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: `${sheetName}!A:A`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [values],
                },
            });
        } catch (error: any) {
            console.error(`Error appending row to ${sheetName}:`, error.message);
            throw error;
        }
    }

    /**
     * Update a row in a sheet
     */
    static async updateRow(
        sheetName: string,
        condition: (row: SheetRow) => boolean,
        updates: Partial<SheetRow>
    ): Promise<boolean> {
        if (!sheets || !SPREADSHEET_ID) {
            throw new Error('Google Sheets not configured');
        }

        try {
            const allRows = await this.getAll(sheetName);
            const rowIndex = allRows.findIndex(condition);

            if (rowIndex === -1) return false;

            // Get headers
            const headersResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `${sheetName}!A1:ZZ1`,
            });

            const headers = headersResponse.data.values?.[0] || [];
            const updatedRow = { ...allRows[rowIndex], ...updates };
            const values = headers.map(header => updatedRow[header] || '');

            // Update the row (rowIndex + 2 because: +1 for header, +1 for 1-based indexing)
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${sheetName}!A${rowIndex + 2}:ZZ${rowIndex + 2}`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [values],
                },
            });

            return true;
        } catch (error: any) {
            console.error(`Error updating row in ${sheetName}:`, error.message);
            throw error;
        }
    }

    /**
     * Delete a row from a sheet
     */
    static async deleteRow(
        sheetName: string,
        condition: (row: SheetRow) => boolean
    ): Promise<boolean> {
        if (!sheets || !SPREADSHEET_ID) {
            throw new Error('Google Sheets not configured');
        }

        try {
            const allRows = await this.getAll(sheetName);
            const rowIndex = allRows.findIndex(condition);

            if (rowIndex === -1) return false;

            // Get sheet ID
            const spreadsheet = await sheets.spreadsheets.get({
                spreadsheetId: SPREADSHEET_ID,
            });

            const sheet = spreadsheet.data.sheets?.find(
                s => s.properties?.title === sheetName
            );

            if (!sheet?.properties?.sheetId) {
                throw new Error(`Sheet ${sheetName} not found`);
            }

            // Delete the row (rowIndex + 1 because of header row)
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: sheet.properties.sheetId,
                                dimension: 'ROWS',
                                startIndex: rowIndex + 1,
                                endIndex: rowIndex + 2,
                            },
                        },
                    }],
                },
            });

            return true;
        } catch (error: any) {
            console.error(`Error deleting row from ${sheetName}:`, error.message);
            throw error;
        }
    }
}
