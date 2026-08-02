import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create new order (Pending Payment)
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount, shippingDetails } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items found' });
  }

  const order = new Order({
    user: req.user.id,
    items,
    totalAmount,
    shippingDetails
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Process Payment (Mock) and Finalize Order
// @route   POST /api/orders/:id/pay
// @access  Private
export const processPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Ensure the user owns the order
  if (order.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized to pay for this order' });
  }

  if (order.paymentStatus === 'Paid') {
    return res.status(400).json({ message: 'Order is already paid' });
  }

  // Simulate Payment Processing Delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mark as Paid
  order.paymentStatus = 'Paid';
  order.orderStatus = 'Processing';
  
  // Here we could save a Stripe transaction ID
  // order.paymentResult = { id: 'txn_mock123', status: 'success', update_time: new Date().toISOString() };
  
  const updatedOrder = await order.save();

  // CLEAR THE USER'S CART AFTER SUCCESSFUL PAYMENT
  await Cart.deleteMany({ user: req.user.id });

  res.json(updatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by ID for tracking
// @route   GET /api/orders/track/:id
// @access  Private
export const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Ensure the user owns the order
  if (order.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized to view this order' });
  }

  res.json(order);
});
