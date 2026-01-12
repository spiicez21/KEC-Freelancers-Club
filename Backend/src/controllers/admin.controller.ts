import { Request, Response } from 'express';
import { SheetsService } from '../services/sheets.service.js';
import { SHEETS } from '../config/google.js';

export class AdminController {
    /**
     * Get all pending users
     */
    static async getPendingUsers(req: Request, res: Response) {
        try {
            const pendingUsers = await SheetsService.findRows(
                SHEETS.USERS,
                (row) => row.status === 'pending'
            );

            const usersWithProjects = await Promise.all(
                pendingUsers.map(async (user) => {
                    const projects = await SheetsService.findRows(
                        SHEETS.PROJECTS,
                        (row) => row.user_id === user.id
                    );

                    const techStack = user.tech_stack ? user.tech_stack.split(',') : [];

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        status: user.status,
                        tagline: user.tagline,
                        bio: user.bio,
                        techStack,
                        profileImage: user.profile_image_url,
                        bannerImage: user.banner_image_url,
                        availability: user.availability,
                        rate: user.rate,
                        experience: user.experience,
                        socials: {
                            github: user.github,
                            linkedin: user.linkedin,
                            portfolio: user.portfolio,
                        },
                        projects: projects.map(p => ({
                            title: p.title,
                            link: p.link,
                            description: p.description,
                            image: p.image_url,
                        })),
                    };
                })
            );

            res.json(usersWithProjects);
        } catch (error: any) {
            console.error('Get pending users error:', error);
            res.status(500).json({ error: 'Failed to get pending users' });
        }
    }

    /**
     * Approve a user
     */
    static async approveUser(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const success = await SheetsService.updateRow(
                SHEETS.USERS,
                (row) => row.id === id,
                {
                    status: 'approved',
                    updated_at: new Date().toISOString(),
                }
            );

            if (!success) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User approved successfully' });
        } catch (error: any) {
            console.error('Approve user error:', error);
            res.status(500).json({ error: 'Failed to approve user' });
        }
    }

    /**
     * Reject a user
     */
    static async rejectUser(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Option 1: Delete the user
            const success = await SheetsService.deleteRow(
                SHEETS.USERS,
                (row) => row.id === id
            );

            // Option 2: Mark as rejected (uncomment if you prefer this)
            // const success = await SheetsService.updateRow(
            //   SHEETS.USERS,
            //   (row) => row.id === id,
            //   {
            //     status: 'rejected',
            //     updated_at: new Date().toISOString(),
            //   }
            // );

            if (!success) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Also delete user's projects
            const projects = await SheetsService.findRows(
                SHEETS.PROJECTS,
                (row) => row.user_id === id
            );

            for (const project of projects) {
                await SheetsService.deleteRow(
                    SHEETS.PROJECTS,
                    (row) => row.id === project.id
                );
            }

            res.json({ message: 'User rejected successfully' });
        } catch (error: any) {
            console.error('Reject user error:', error);
            res.status(500).json({ error: 'Failed to reject user' });
        }
    }
}
