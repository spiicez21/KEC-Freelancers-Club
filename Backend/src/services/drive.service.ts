import { drive, DRIVE_FOLDER_ID } from '../config/google.js';
import { Readable } from 'stream';

export class DriveService {
    /**
     * Upload a file to Google Drive
     */
    static async uploadFile(
        fileBuffer: Buffer,
        fileName: string,
        mimeType: string,
        parentFolderId?: string
    ): Promise<string> {
        if (!drive || !DRIVE_FOLDER_ID) {
            throw new Error('Google Drive not configured');
        }

        try {
            // Use provided parentFolderId or default to DRIVE_FOLDER_ID
            const targetFolderId = parentFolderId || DRIVE_FOLDER_ID;

            // Convert buffer to stream
            const fileStream = Readable.from(fileBuffer);

            // Upload file
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    parents: [targetFolderId],
                },
                media: {
                    mimeType,
                    body: fileStream,
                },
                fields: 'id, webViewLink, webContentLink',
            });

            const fileId = response.data.id;
            if (!fileId) {
                throw new Error('Failed to upload file');
            }

            // Make file publicly accessible
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            // Return public URL
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        } catch (error: any) {
            console.error('Error uploading file to Drive:', error.message);
            throw error;
        }
    }

    /**
     * Ensure a member-specific folder exists in Drive
     */
    static async ensureMemberFolderExists(userId: string, userName: string): Promise<string> {
        if (!drive || !DRIVE_FOLDER_ID) {
            throw new Error('Google Drive not configured');
        }

        const folderName = `${userName}_${userId}`;

        try {
            // Search for existing member folder
            const response = await drive.files.list({
                q: `name='${folderName}' and '${DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id, name)',
            });

            if (response.data.files && response.data.files.length > 0) {
                return response.data.files[0].id!;
            }

            // Create member folder if it doesn't exist
            const createResponse = await drive.files.create({
                requestBody: {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [DRIVE_FOLDER_ID],
                },
                fields: 'id',
            });

            return createResponse.data.id!;
        } catch (error: any) {
            console.error('Error ensuring member folder exists:', error.message);
            throw error;
        }
    }

    /**
     * Ensure a folder exists in Drive, create if it doesn't
     */
    private static async ensureFolderExists(folderName: string, parentId: string = DRIVE_FOLDER_ID): Promise<string> {
        if (!drive || !parentId) {
            throw new Error('Google Drive or parent folder not configured');
        }

        try {
            // Search for existing folder
            const response = await drive.files.list({
                q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id, name)',
            });

            if (response.data.files && response.data.files.length > 0) {
                return response.data.files[0].id!;
            }

            // Create folder if it doesn't exist
            const createResponse = await drive.files.create({
                requestBody: {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [parentId],
                },
                fields: 'id',
            });

            return createResponse.data.id!;
        } catch (error: any) {
            console.error('Error ensuring folder exists:', error.message);
            throw error;
        }
    }

    /**
     * Delete a file from Google Drive
     */
    static async deleteFile(fileUrl: string): Promise<void> {
        if (!drive) {
            throw new Error('Google Drive not configured');
        }

        try {
            // Extract file ID from URL
            const fileIdMatch = fileUrl.match(/id=([^&]+)/);
            if (!fileIdMatch) {
                throw new Error('Invalid Drive URL');
            }

            const fileId = fileIdMatch[1];

            await drive.files.delete({
                fileId,
            });
        } catch (error: any) {
            console.error('Error deleting file from Drive:', error.message);
            throw error;
        }
    }
}
