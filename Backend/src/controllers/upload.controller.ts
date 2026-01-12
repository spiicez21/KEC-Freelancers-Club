import { Request, Response } from 'express';
import { DriveService } from '../services/drive.service.js';
import { SheetsService } from '../services/sheets.service.js';
import { SHEETS } from '../config/google.js';

export class UploadController {
    /**
     * Upload profile image
     */
    static async uploadProfileImage(req: Request, res: Response) {
        try {
            if (!req.file || !req.user) {
                return res.status(400).json({ error: 'No file uploaded or user not authenticated' });
            }

            const user = await SheetsService.findOne(SHEETS.USERS, r => r.id === req.user?.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const memberFolderId = await DriveService.ensureMemberFolderExists(user.id, user.name);

            const url = await DriveService.uploadFile(
                req.file.buffer,
                `profile-${Date.now()}-${req.file.originalname}`,
                req.file.mimetype,
                memberFolderId
            );

            res.json({ url });
        } catch (error: any) {
            console.error('Upload profile image error:', error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
    }

    static async uploadBannerImage(req: Request, res: Response) {
        try {
            if (!req.file || !req.user) {
                return res.status(400).json({ error: 'No file uploaded or user not authenticated' });
            }

            const user = await SheetsService.findOne(SHEETS.USERS, (r: any) => r.id === req.user?.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const memberFolderId = await DriveService.ensureMemberFolderExists(user.id, user.name);

            const url = await DriveService.uploadFile(
                req.file.buffer,
                `banner-${Date.now()}-${req.file.originalname}`,
                req.file.mimetype,
                memberFolderId
            );

            res.json({ url });
        } catch (error: any) {
            console.error('Upload banner image error:', error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
    }

    static async uploadProjectImage(req: Request, res: Response) {
        try {
            if (!req.file || !req.user) {
                return res.status(400).json({ error: 'No file uploaded or user not authenticated' });
            }

            const user = await SheetsService.findOne(SHEETS.USERS, (r: any) => r.id === req.user?.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const memberFolderId = await DriveService.ensureMemberFolderExists(user.id, user.name);

            const url = await DriveService.uploadFile(
                req.file.buffer,
                `project-${Date.now()}-${req.file.originalname}`,
                req.file.mimetype,
                memberFolderId
            );

            res.json({ url });
        } catch (error: any) {
            console.error('Upload project image error:', error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
    }
}
