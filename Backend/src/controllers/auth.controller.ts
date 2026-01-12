import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SheetsService } from '../services/sheets.service.js';
import { SHEETS } from '../config/google.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export class AuthController {
    /**
     * User signup
     */
    static async signup(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            // Validation
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email, and password are required' });
            }

            // Check if user already exists
            const existingUser = await SheetsService.findOne(
                SHEETS.USERS,
                (row) => row.email === email
            );

            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            // Hash password
            const passwordHash = await hashPassword(password);

            // Create user
            const userId = uuidv4();
            const now = new Date().toISOString();

            await SheetsService.appendRow(SHEETS.USERS, {
                id: userId,
                name,
                email,
                password_hash: passwordHash,
                role: 'user',
                status: 'incomplete', // Will change to 'pending' after onboarding
                tagline: '',
                bio: '',
                tech_stack: '',
                profile_image_url: '',
                banner_image_url: '',
                availability: '',
                rate: '',
                experience: '',
                github: '',
                linkedin: '',
                portfolio: '',
                created_at: now,
                updated_at: now,
            });

            // Generate token
            const token = generateToken({
                userId,
                email,
                role: 'user',
            });

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: userId,
                    name,
                    email,
                    role: 'user',
                    status: 'incomplete',
                },
            });
        } catch (error: any) {
            console.error('❌ Signup error:', error);
            console.error('Error stack:', error.stack);
            console.error('Error message:', error.message);

            // Send more detailed error in development
            if (process.env.NODE_ENV === 'development') {
                res.status(500).json({
                    error: 'Failed to create user',
                    details: error.message,
                    stack: error.stack
                });
            } else {
                res.status(500).json({ error: 'Failed to create user' });
            }
        }
    }

    /**
     * User login
     */
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Find user
            const user = await SheetsService.findOne(
                SHEETS.USERS,
                (row) => row.email === email
            );

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = await comparePassword(password, user.password_hash);

            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate token
            const token = generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            // Parse tech_stack back to array
            const techStack = user.tech_stack ? user.tech_stack.split(',') : [];

            res.json({
                message: 'Login successful',
                token,
                user: {
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
                },
            });
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Failed to login' });
        }
    }

    /**
     * Get current user
     */
    static async getCurrentUser(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const user = await SheetsService.findOne(
                SHEETS.USERS,
                (row) => row.id === req.user!.userId
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

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
            });
        } catch (error: any) {
            console.error('Get current user error:', error);
            res.status(500).json({ error: 'Failed to get user' });
        }
    }

    /**
     * Logout (client-side token removal)
     */
    static async logout(req: Request, res: Response) {
        res.json({ message: 'Logout successful' });
    }
}
