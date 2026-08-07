import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  verifyEmail,
  seedAdmin,
  resetAdminPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);

// Dev-only admin management (disabled in production)
router.post('/seed-admin', seedAdmin);
router.post('/reset-admin', resetAdminPassword);  // resets admin password from .env

export default router;
