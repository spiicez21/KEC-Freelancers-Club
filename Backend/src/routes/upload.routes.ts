import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    },
});

// All upload routes require authentication
router.use(authenticate);

router.post('/profile-image', upload.single('image'), UploadController.uploadProfileImage);
router.post('/banner-image', upload.single('image'), UploadController.uploadBannerImage);
router.post('/project-image', upload.single('image'), UploadController.uploadProjectImage);

export default router;
