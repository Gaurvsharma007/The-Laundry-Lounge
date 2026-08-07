import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getAnalytics,
  getNotifications,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrder,
  getAllComplaints,
  updateComplaint,
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/notifications', getNotifications);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrder);

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id', updateComplaint);

export default router;

