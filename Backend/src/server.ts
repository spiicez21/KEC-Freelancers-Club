import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSheets } from './config/google.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: err.message || 'Internal server error',
    });
});

// Initialize Google Sheets and start server
async function startServer() {
    try {
        console.log('🚀 Starting server...');

        // Initialize Google Sheets
        await initializeSheets();

        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log(`📊 Frontend URL: ${FRONTEND_URL}`);
            console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
            console.log('\n📝 Available endpoints:');
            console.log('   POST   /api/auth/signup');
            console.log('   POST   /api/auth/login');
            console.log('   POST   /api/auth/logout');
            console.log('   GET    /api/auth/me');
            console.log('   GET    /api/users');
            console.log('   GET    /api/users/:id');
            console.log('   PUT    /api/users/:id');
            console.log('   POST   /api/users/:id/complete-onboarding');
            console.log('   GET    /api/admin/pending-users');
            console.log('   POST   /api/admin/approve/:id');
            console.log('   POST   /api/admin/reject/:id');
            console.log('   POST   /api/upload/profile-image');
            console.log('   POST   /api/upload/banner-image');
            console.log('   POST   /api/upload/project-image');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
