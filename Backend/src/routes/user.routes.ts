import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', authenticate, UserController.updateProfile);
router.post('/:id/complete-onboarding', authenticate, UserController.completeOnboarding);

// Project routes
router.get('/projects/all', UserController.getAllProjects);
router.get('/projects/:id', UserController.getProjectById);

export default router;
