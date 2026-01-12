import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

router.get('/pending-users', AdminController.getPendingUsers);
router.post('/approve/:id', AdminController.approveUser);
router.post('/reject/:id', AdminController.rejectUser);

export default router;
