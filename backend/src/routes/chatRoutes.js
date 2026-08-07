import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.route('/')
  .get(protect, getChatHistory)
  .post(protect, sendMessage);

export default router;
