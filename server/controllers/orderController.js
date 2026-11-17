import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { findOrderByIdOrShortId } from '../utils/findOrder.js';


// @desc    Create new order (Pending Payment)
// @route   POST /api/orders
// @access  Public / Optional Auth (Supports logged-in and guest checkout)
export const createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount, shippingDetails } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items found' });
  }

  // Determine user ID: from session or link/create user by shipping email
  let userId = req.user?._id || req.user?.id;
  if (!userId && shippingDetails?.email) {
    const cleanEmail = shippingDetails.email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        name: shippingDetails.fullName || 'Customer',
        email: cleanEmail,
        phone: shippingDetails.phone || '',
        address: shippingDetails.address || '',
        city: shippingDetails.city || '',
        state: shippingDetails.state || '',
        zipCode: shippingDetails.zipCode || '',
        country: shippingDetails.country || 'Australia',
        role: 'user'
      });
    }
    userId = user._id;
  }

  if (!userId) {
    return res.status(400).json({ message: 'A valid email address is required for checkout' });
  }

  const order = new Order({
    user: userId,
    items,
    totalAmount,
    shippingDetails
  });

  const createdOrder = await order.save();
  
  Notification.create({
    type: 'NEW_ORDER',
    title: 'New Product Order',
    message: `A new order has been placed for $${totalAmount} AUD`,
    link: `/admin/orders`,
  }).catch(err => console.error('Notification error:', err.message));

  res.status(201).json(createdOrder);
});

// @desc    Process Payment (Mock) and Finalize Order
// @route   POST /api/orders/:id/pay
// @access  Private
export const processPayment = asyncHandler(async (req, res) => {
  const order = await findOrderByIdOrShortId(req.params.id);

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
  const order = await findOrderByIdOrShortId(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Ensure the user owns the order
  if (order.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized to view this order' });
  }

  res.json(order);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/admin/:id/status
// @access  Private/Admin
export const updateOrderStatusAdmin = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await findOrderByIdOrShortId(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
  }
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  const updatedOrder = await order.save();
  await updatedOrder.populate('user', 'name email phone');

  // Notify admin/user of status change
  await Notification.create({
    type: 'ORDER_STATUS_UPDATED',
    title: 'Order Status Updated',
    message: `Order #${order._id.toString().slice(-8).toUpperCase()} updated to ${order.orderStatus} (${order.paymentStatus})`,
    link: `/admin/orders`
  }).catch(err => console.error('Notification error:', err));

  res.json(updatedOrder);
});

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/admin/:id
// @access  Private/Admin
export const deleteOrderAdmin = asyncHandler(async (req, res) => {
  const order = await findOrderByIdOrShortId(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  await order.deleteOne();
  res.json({ message: 'Order deleted successfully' });
});

// ==========================================
// AUSTRALIA POST SHIPPING CONTROLLERS
// ==========================================

import { createShipment, getTrackingInfo } from '../services/australiaPostService.js';
import { sendShipmentNotificationEmail } from '../utils/emailService.js';

// @desc    Mark order Ready to Ship (Admin)
// @route   POST /api/orders/admin/:id/ready-to-ship
// @access  Private/Admin
export const markReadyToShip = asyncHandler(async (req, res) => {
  const { parcelWeightKg, lengthCm, widthCm, heightCm } = req.body;
  const order = await findOrderByIdOrShortId(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.paymentStatus !== 'Paid') {
    return res.status(400).json({ message: 'Cannot mark unpaid order as Ready to Ship' });
  }

  order.shipping = order.shipping || {};
  order.shipping.status = 'READY_TO_SHIP';
  order.orderStatus = 'Processing';
  if (parcelWeightKg) order.shipping.parcelWeightKg = Number(parcelWeightKg);
  if (lengthCm || widthCm || heightCm) {
    order.shipping.parcelDimensions = {
      lengthCm: Number(lengthCm || 25),
      widthCm: Number(widthCm || 20),
      heightCm: Number(heightCm || 15)
    };
  }

  await order.save();
  await order.populate('user', 'name email phone');
  res.json({ success: true, message: 'Order marked as Ready to Ship', order });
});

// @desc    Create Australia Post Shipment (Admin)
// @route   POST /api/orders/admin/:id/create-shipment
// @access  Private/Admin
export const createAusPostShipment = asyncHandler(async (req, res) => {
  const order = await findOrderByIdOrShortId(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.paymentStatus !== 'Paid') {
    return res.status(400).json({ message: 'Order must be PAID before creating an Australia Post shipment' });
  }

  // Duplicate Shipment Protection
  if (order.shipping?.shipmentId && order.shipping?.trackingNumber) {
    return res.status(400).json({
      message: `Shipment already created for this order. Australia Post Tracking #: ${order.shipping.trackingNumber}`,
      trackingNumber: order.shipping.trackingNumber,
      order
    });
  }

  const { parcelWeightKg, lengthCm, widthCm, heightCm } = req.body;
  const weight = parcelWeightKg || order.shipping?.parcelWeightKg || 1.5;
  const dims = {
    lengthCm: lengthCm || order.shipping?.parcelDimensions?.lengthCm || 25,
    widthCm: widthCm || order.shipping?.parcelDimensions?.widthCm || 20,
    heightCm: heightCm || order.shipping?.parcelDimensions?.heightCm || 15,
  };

  const shipmentResult = await createShipment({ order, parcelWeightKg: weight, dimensions: dims });

  order.shipping = order.shipping || {};
  order.shipping.courier = 'AUSTRALIA_POST';
  order.shipping.status = 'SHIPMENT_CREATED';
  order.orderStatus = 'Processing';
  order.shipping.shipmentId = shipmentResult.shipmentId;
  order.shipping.itemId = shipmentResult.itemId;
  order.shipping.trackingNumber = shipmentResult.trackingNumber;
  order.shipping.trackingUrl = shipmentResult.trackingUrl;
  order.shipping.labelUrl = shipmentResult.labelUrl;
  order.shipping.labelReference = shipmentResult.labelReference;
  order.shipping.shipmentCreatedAt = new Date();
  order.shipping.parcelWeightKg = weight;
  order.shipping.parcelDimensions = dims;

  await order.save();
  await order.populate('user', 'name email phone');

  res.json({
    success: true,
    message: `Australia Post shipment created successfully! Tracking #: ${shipmentResult.trackingNumber}`,
    shipment: shipmentResult,
    order
  });
});

// @desc    Mark Parcel Handed Over to Australia Post & Notify Customer (Admin)
// @route   POST /api/orders/admin/:id/mark-handed-over
// @access  Private/Admin
export const markHandedOver = asyncHandler(async (req, res) => {
  const order = await findOrderByIdOrShortId(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (!order.shipping?.trackingNumber) {
    return res.status(400).json({ message: 'Create Australia Post shipment first before marking as Handed Over' });
  }

  const now = new Date();
  order.shipping.status = 'SHIPPED';
  order.orderStatus = 'Shipped';
  order.shipping.handedOverAt = order.shipping.handedOverAt || now;
  order.shipping.shippedAt = order.shipping.shippedAt || now;

  await order.save();
  await order.populate('user', 'name email phone');

  // Trigger customer email notification with tracking details
  const customerEmail = order.shippingDetails?.email || (typeof order.user === 'object' ? order.user?.email : null);
  if (customerEmail) {
    try {
      await sendShipmentNotificationEmail({
        to: customerEmail,
        order,
        trackingNumber: order.shipping.trackingNumber,
        trackingUrl: order.shipping.trackingUrl
      });
      console.log(`[AusPost Email Sent] Tracking #${order.shipping.trackingNumber} sent to ${customerEmail}`);
    } catch (emailErr) {
      console.error('[AusPost Email Failed]:', emailErr.message);
    }
  }

  res.json({
    success: true,
    message: 'Order marked as Handed Over to Australia Post and customer notified via email!',
    order
  });
});

// @desc    Get Australia Post Tracking Timeline (Customer / Public)
// @route   GET /api/orders/:id/tracking
// @access  Private
export const getCustomerOrderTracking = asyncHandler(async (req, res) => {
  const order = await findOrderByIdOrShortId(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Ownership verification: user owns order or user is admin
  if (req.user?.role !== 'admin' && order.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized to view tracking for this order' });
  }

  const trackingNumber = order.shipping?.trackingNumber;

  // Check 15-minute tracking cache
  const lastSync = order.shipping?.lastTrackingSyncAt ? new Date(order.shipping.lastTrackingSyncAt).getTime() : 0;
  const now = Date.now();
  const cacheAgeMinutes = (now - lastSync) / (1000 * 60);

  let trackingData;
  if (cacheAgeMinutes < 15 && order.shipping?.trackingEvents?.length > 0) {
    trackingData = {
      success: true,
      trackingNumber: trackingNumber || 'AP392817462AU',
      currentStatus: order.shipping.status || 'PROCESSING',
      events: order.shipping.trackingEvents
    };
  } else {
    trackingData = await getTrackingInfo(trackingNumber, order);
    
    // Sync status & events into order document
    order.shipping = order.shipping || {};
    order.shipping.lastTrackingSyncAt = new Date();
    order.shipping.trackingEvents = trackingData.events || [];

    if (trackingData.currentStatus === 'DELIVERED' && order.shipping.status !== 'DELIVERED') {
      order.shipping.status = 'DELIVERED';
      order.orderStatus = 'Delivered';
      order.shipping.deliveredAt = new Date();
    }

    await order.save();
  }

  res.json({
    success: true,
    orderId: order._id,
    orderDate: order.createdAt,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    shippingDetails: order.shippingDetails,
    items: order.items,
    shipping: {
      courier: 'AUSTRALIA_POST',
      status: order.shipping?.status || 'PROCESSING',
      shipmentId: order.shipping?.shipmentId,
      trackingNumber: order.shipping?.trackingNumber,
      trackingUrl: order.shipping?.trackingUrl || `https://auspost.com.au/mypost/track/#/details/${order.shipping?.trackingNumber}`,
      labelUrl: order.shipping?.labelUrl,
      parcelWeightKg: order.shipping?.parcelWeightKg || 1.5,
      parcelDimensions: order.shipping?.parcelDimensions,
      shipmentCreatedAt: order.shipping?.shipmentCreatedAt,
      handedOverAt: order.shipping?.handedOverAt,
      shippedAt: order.shipping?.shippedAt,
      deliveredAt: order.shipping?.deliveredAt,
      events: trackingData.events
    }
  });
});

// @desc    Generate / View Australia Post Shipping Label PDF (Admin)
// @route   GET /api/orders/admin/:id/shipping-label
// @access  Private/Admin
export const generateShippingLabel = asyncHandler(async (req, res) => {
  const order = await findOrderByIdOrShortId(req.params.id);

  if (!order) {
    return res.status(404).send('Order not found');
  }

  const trackingNumber = order.shipping?.trackingNumber || `AP${Math.floor(100000000 + Math.random() * 900000000)}AU`;
  const orderIdStr = order._id.toString().slice(-8).toUpperCase();

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Australia Post Shipping Label - #${orderIdStr}</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; display: flex; justify-content: center; }
        .label-card { width: 400px; background: #ffffff; border: 3px solid #dc2626; padding: 20px; box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .auspost-logo { color: #dc2626; font-size: 24px; font-weight: 900; letter-spacing: -1px; }
        .service-badge { background: #dc2626; color: #fff; font-weight: bold; font-size: 12px; padding: 4px 8px; border-radius: 4px; }
        .section { margin-top: 15px; border-bottom: 1px border #ccc; padding-bottom: 10px; }
        .title { font-size: 10px; font-weight: bold; color: #666; text-transform: uppercase; }
        .address { font-size: 14px; font-weight: bold; margin-top: 4px; line-height: 1.4; }
        .barcode-box { text-align: center; margin-top: 20px; border-top: 2px solid #000; padding-top: 15px; }
        .barcode-lines { font-family: monospace; font-size: 32px; letter-spacing: 4px; font-weight: bold; }
        .tracking-no { font-mono; font-size: 16px; font-weight: bold; margin-top: 5px; }
        @media print { body { background: #fff; padding: 0; } }
      </style>
    </head>
    <body>
      <div class="label-card">
        <div class="header">
          <div class="auspost-logo">AUSTRALIA POST</div>
          <div class="service-badge">PARCEL POST</div>
        </div>
        
        <div class="section">
          <div class="title">DELIVER TO (RECIPIENT):</div>
          <div class="address">
            ${order.shippingDetails?.fullName}<br/>
            ${order.shippingDetails?.address}<br/>
            ${order.shippingDetails?.city}, ${order.shippingDetails?.state} ${order.shippingDetails?.zipCode}<br/>
            AUSTRALIA
          </div>
        </div>

        <div class="section">
          <div class="title">SENDER (FROM):</div>
          <div class="address" style="font-size: 12px; font-weight: normal;">
            Black Panther Batteries Warehouse<br/>
            123 Power Street, Sydney NSW 2000
          </div>
        </div>

        <div class="section" style="display: flex; justify-content: space-between; font-size: 11px;">
          <div><strong>Order Ref:</strong> #${orderIdStr}</div>
          <div><strong>Weight:</strong> ${order.shipping?.parcelWeightKg || 1.5} kg</div>
        </div>

        <div class="barcode-box">
          <div class="barcode-lines">||| | |||| ||| ||||| ||||</div>
          <div class="tracking-no">${trackingNumber}</div>
        </div>

        <div style="text-align: center; margin-top: 15px;">
          <button onclick="window.print()" style="background: #dc2626; color: #fff; border: none; padding: 8px 16px; font-weight: bold; cursor: pointer; border-radius: 4px;">Print Label</button>
        </div>
      </div>
    </body>
    </html>
  `);
});


