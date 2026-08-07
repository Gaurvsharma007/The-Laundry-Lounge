import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  trackOrderByTrackingId
} from '../controllers/orderController.js';

const router = express.Router();

// Public: Track by trackingId (must come before /:id to avoid conflict)
router.get('/track/:trackingId', trackOrderByTrackingId);

router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, authorize('admin'), updateOrderStatus);

export default router;
