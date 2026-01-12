import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SheetsService } from '../services/sheets.service.js';
import { SHEETS } from '../config/google.js';

export class UserController {
    /**
     * Get user by ID
     */
    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = await SheetsService.findOne(
                SHEETS.USERS,
                (row) => row.id === id
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Get user's projects
            const projects = await SheetsService.findRows(
                SHEETS.PROJECTS,
                (row) => row.user_id === id
            );

            // Parse tech_stack back to array
            const techStack = user.tech_stack ? user.tech_stack.split(',') : [];

            res.json({
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
                    id: p.id,
                    title: p.title,
                    link: p.link,
                    description: p.description,
                    image: p.image_url,
                })),
            });
        } catch (error: any) {
            console.error('Get user error:', error);
            res.status(500).json({ error: 'Failed to get user' });
        }
    }

    /**
     * Get all approved users
     */
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await SheetsService.findRows(
                SHEETS.USERS,
                (row) => row.status === 'approved'
            );

            const usersWithProjects = await Promise.all(
                users.map(async (user) => {
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
                            id: p.id,
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
            console.error('Get all users error:', error);
            res.status(500).json({ error: 'Failed to get users' });
        }
    }

    /**
     * Update user profile
     */
    static async updateProfile(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Ensure user can only update their own profile (unless admin)
            if (req.user?.userId !== id && req.user?.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const updates = req.body;
            const now = new Date().toISOString();

            // Convert techStack array to comma-separated string
            if (updates.techStack && Array.isArray(updates.techStack)) {
                updates.tech_stack = updates.techStack.join(',');
                delete updates.techStack;
            }

            // Handle socials object
            if (updates.socials) {
                updates.github = updates.socials.github || '';
                updates.linkedin = updates.socials.linkedin || '';
                updates.portfolio = updates.socials.portfolio || '';
                delete updates.socials;
            }

            // Map frontend field names to backend
            if (updates.profileImage !== undefined) {
                updates.profile_image_url = updates.profileImage;
                delete updates.profileImage;
            }
            if (updates.bannerImage !== undefined) {
                updates.banner_image_url = updates.bannerImage;
                delete updates.bannerImage;
            }

            updates.updated_at = now;

            const success = await SheetsService.updateRow(
                SHEETS.USERS,
                (row) => row.id === id,
                updates
            );

            if (!success) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'Profile updated successfully' });
        } catch (error: any) {
            console.error('Update profile error:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    /**
     * Complete onboarding
     */
    static async completeOnboarding(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Ensure user can only complete their own onboarding
            if (req.user?.userId !== id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const {
                tagline,
                bio,
                techStack,
                bannerImage,
                profileImage,
                availability,
                rate,
                experience,
                socials,
                projects,
            } = req.body;

            const now = new Date().toISOString();

            // Update user profile
            await SheetsService.updateRow(
                SHEETS.USERS,
                (row) => row.id === id,
                {
                    tagline: tagline || '',
                    bio: bio || '',
                    tech_stack: Array.isArray(techStack) ? techStack.join(',') : '',
                    banner_image_url: bannerImage || '',
                    profile_image_url: profileImage || '',
                    availability: availability || '',
                    rate: rate || '',
                    experience: experience || '',
                    github: socials?.github || '',
                    linkedin: socials?.linkedin || '',
                    portfolio: socials?.portfolio || '',
                    status: 'pending', // Change status to pending for admin approval
                    updated_at: now,
                }
            );

            // Add projects
            if (projects && Array.isArray(projects)) {
                for (const project of projects) {
                    if (project.title && project.description) {
                        await SheetsService.appendRow(SHEETS.PROJECTS, {
                            id: uuidv4(),
                            user_id: id,
                            title: project.title,
                            link: project.link || '',
                            description: project.description,
                            image_url: project.image || '',
                            created_at: now,
                        });
                    }
                }
            }

            res.json({ message: 'Onboarding completed successfully' });
        } catch (error: any) {
            console.error('Complete onboarding error:', error);
            res.status(500).json({ error: 'Failed to complete onboarding' });
        }
    }

    /**
     * Get all projects from approved users
     */
    static async getAllProjects(req: Request, res: Response) {
        try {
            const approvedUsers = await SheetsService.findRows(
                SHEETS.USERS,
                (row) => row.status === 'approved'
            );
            const approvedUserIds = new Set(approvedUsers.map(u => u.id));

            const allProjects = await SheetsService.getAll(SHEETS.PROJECTS);

            // Only show projects from approved users
            const filteredProjects = allProjects.filter(p => approvedUserIds.has(p.user_id));

            // Enrich projects with user info
            const enrichedProjects = filteredProjects.map(p => {
                const user = approvedUsers.find(u => u.id === p.user_id);
                return {
                    id: p.id,
                    user_id: p.user_id,
                    title: p.title,
                    link: p.link,
                    description: p.description,
                    image: p.image_url,
                    member: user?.name || 'Unknown',
                    category: p.description.split(' ')[0] || 'Project'
                };
            });

            res.json(enrichedProjects);
        } catch (error: any) {
            console.error('Get all projects error:', error);
            res.status(500).json({ error: 'Failed to get projects' });
        }
    }

    /**
     * Get project by ID
     */
    static async getProjectById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const project = await SheetsService.findOne(
                SHEETS.PROJECTS,
                (row) => row.id === id
            );

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const user = await SheetsService.findOne(
                SHEETS.USERS,
                (row) => row.id === project.user_id
            );

            res.json({
                id: project.id,
                user_id: project.user_id,
                title: project.title,
                link: project.link,
                description: project.description,
                image: project.image_url,
                member: user?.name || 'Unknown',
                memberId: user?.id,
                category: project.description.split(' ')[0] || 'Project',
                user: user ? {
                    name: user.name,
                    tagline: user.tagline,
                    profileImage: user.profile_image_url
                } : null
            });
        } catch (error: any) {
            console.error('Get project error:', error);
            res.status(500).json({ error: 'Failed to get project' });
        }
    }
}
