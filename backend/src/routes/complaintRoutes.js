import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  createComplaint, 
  getComplaints, 
  getComplaintById, 
  updateComplaintStatus 
} from '../controllers/complaintController.js';

const router = express.Router();

router.route('/')
  .post(protect, createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .get(protect, getComplaintById)
  .put(protect, authorize('admin'), updateComplaintStatus);

export default router;
