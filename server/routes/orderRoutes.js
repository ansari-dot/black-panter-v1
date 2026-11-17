import express from 'express';
import { 
  createOrder, 
  processPayment, 
  getMyOrders, 
  trackOrder, 
  getAllOrdersAdmin, 
  updateOrderStatusAdmin, 
  deleteOrderAdmin,
  markReadyToShip,
  createAusPostShipment,
  markHandedOver,
  getCustomerOrderTracking,
  generateShippingLabel
} from '../controllers/orderController.js';
import { createCheckoutSession, verifyStripeSession, handleStripeWebhook } from '../controllers/stripeController.js';
import { protect, adminOnly, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(optionalProtect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

// Admin Orders & Australia Post Shipping Routes
router.get('/admin/all', protect, adminOnly, getAllOrdersAdmin);
router.put('/admin/:id/status', protect, adminOnly, updateOrderStatusAdmin);
router.delete('/admin/:id', protect, adminOnly, deleteOrderAdmin);

router.post('/admin/:id/ready-to-ship', protect, adminOnly, markReadyToShip);
router.post('/admin/:id/create-shipment', protect, adminOnly, createAusPostShipment);
router.post('/admin/:id/mark-handed-over', protect, adminOnly, markHandedOver);
router.get('/admin/:id/shipping-label', protect, adminOnly, generateShippingLabel);

// Stripe Payment Gateway Routes
router.post('/stripe-webhook', handleStripeWebhook);
router.get('/verify-session/:sessionId', optionalProtect, verifyStripeSession);

// Customer Tracking Routes
router.get('/:id/tracking', protect, getCustomerOrderTracking);
router.route('/track/:id').get(protect, trackOrder);
router.route('/:id/pay').post(protect, processPayment);
router.post('/:id/create-checkout-session', optionalProtect, createCheckoutSession);

export default router;
