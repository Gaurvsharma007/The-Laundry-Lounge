import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getUsers } from '../controllers/userController.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getUsers);

export default router;
