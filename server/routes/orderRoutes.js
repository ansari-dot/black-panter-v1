import express from 'express';
import { createOrder, processPayment, getMyOrders, trackOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/track/:id')
  .get(protect, trackOrder);

router.route('/:id/pay')
  .post(protect, processPayment);

export default router;
