import stripe, { isStripeConfigured } from '../config/stripe.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { findOrderByIdOrShortId } from '../utils/findOrder.js';

// @desc    Create Stripe Checkout Session
// @route   POST /api/orders/:id/create-checkout-session
// @access  Private
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const order = await findOrderByIdOrShortId(req.params.id);


  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Ensure the user owns the order
  if (order.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized for this order' });
  }

  if (order.paymentStatus === 'Paid') {
    return res.status(400).json({ message: 'Order is already paid' });
  }

  const clientUrl = req.headers.origin || process.env.CLIENT_URL || 'http://localhost:5173';

  // Check if live/sandbox Stripe API key is configured
  if (!isStripeConfigured()) {
    console.log(`[Stripe Sandbox Simulation] Creating test checkout for order: ${order._id}`);
    
    return res.json({
      url: `${clientUrl}/order-success?session_id=cs_test_sandbox_${order._id}&order_id=${order._id}&sandbox=true`,
      sessionId: `cs_test_sandbox_${order._id}`,
      isSandboxMock: true,
      message: 'Stripe Sandbox Simulation active (No live credentials in .env yet)'
    });
  }

  try {
    const appUrl = process.env.APP_URL || clientUrl;

    const lineItems = order.items.map(item => {
      // Stripe requires publicly accessible HTTPS URLs for product images
      let images = [];
      if (item.imageUrl) {
        if (item.imageUrl.startsWith('https://')) {
          images = [item.imageUrl];
        } else if (appUrl.startsWith('https://') && (item.imageUrl.startsWith('/uploads/') || item.imageUrl.startsWith('uploads/'))) {
          images = [`${appUrl}/${item.imageUrl.replace(/^\//, '')}`];
        }
      }

      return {
        price_data: {
          currency: 'aud',
          product_data: {
            name: item.name,
            ...(images.length > 0 ? { images } : {}),
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency: 'aud',
      locale: 'en',
      line_items: lineItems,
      customer_email: order.shippingDetails?.email || req.user.email,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id
      },
      // Shipping address is already collected on our website checkout page
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      success_url: `${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${clientUrl}/checkout/pay/${order._id}?canceled=true`,
    });



    // Save session ID on order for reference
    order.stripeSessionId = session.id;
    await order.save();

    res.json({
      url: session.url,
      sessionId: session.id,
      isSandboxMock: false
    });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create Stripe Checkout session' 
    });
  }
});

import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Verify Stripe Session & Finalize Order (Client redirect handler)
// @route   GET /api/orders/verify-session/:sessionId
// @access  Private
export const verifyStripeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { order_id, sandbox } = req.query;

  const targetOrderId = order_id || (sessionId.startsWith('cs_test_sandbox_') ? sessionId.replace('cs_test_sandbox_', '') : null);

  let order;
  if (targetOrderId) {
    order = await findOrderByIdOrShortId(targetOrderId);
  }

  if (!order) {
    return res.status(404).json({ message: 'Order not found for payment verification' });
  }

  // Ensure user owns order
  if (order.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  // Handle Sandbox mock simulation mode
  if (sandbox === 'true' || sessionId.startsWith('cs_test_sandbox_') || !isStripeConfigured()) {
    const isFirstTimePaid = order.paymentStatus !== 'Paid';
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Processing';
    order.paymentResult = {
      id: `txn_sandbox_${Date.now()}`,
      status: 'succeeded',
      update_time: new Date().toISOString(),
      email_address: order.shippingDetails?.email
    };

    await order.save();
    await Cart.deleteMany({ user: req.user.id });

    // Send Email 1: Order Payment Confirmation (No tracking ID yet)
    if (isFirstTimePaid) {
      const recipientEmail = order.shippingDetails?.email || req.user.email;
      if (recipientEmail) {
        sendOrderConfirmationEmail({ to: recipientEmail, order }).catch(err => console.error('[Order Confirmation Email Error]:', err.message));
      }
    }

    return res.json({
      success: true,
      message: 'Order paid successfully in Sandbox environment',
      order
    });
  }


  // Real Stripe Session Verification
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      order.paymentStatus = 'Paid';
      order.orderStatus = 'Processing';
      order.paymentResult = {
        id: session.payment_intent || session.id,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: session.customer_details?.email || order.shippingDetails?.email
      };

      await order.save();
      await Cart.deleteMany({ user: req.user.id });

      await Notification.create({
        type: 'NEW_ORDER',
        title: 'Order Paid via Stripe',
        message: `Order #${order._id.toString().slice(-8).toUpperCase()} paid ($${order.totalAmount} AUD)`,
        link: `/admin/orders`
      }).catch(err => console.error('Notification error:', err));

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        order
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment has not been completed',
        paymentStatus: session.payment_status
      });
    }
  } catch (error) {
    console.error('Stripe Verification Error:', error);
    res.status(500).json({ message: 'Failed to verify payment with Stripe' });
  }
});

// @desc    Stripe Webhook Handler
// @route   POST /api/orders/stripe-webhook
// @access  Public (Stripe Signatures)
export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  if (webhookSecret && !webhookSecret.includes('MockStripe') && sig) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // If webhook secret is not configured or in sandbox fallback, parse event body
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId || session.client_reference_id;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && order.paymentStatus !== 'Paid') {
        order.paymentStatus = 'Paid';
        order.orderStatus = 'Processing';
        order.paymentResult = {
          id: session.payment_intent || session.id,
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: session.customer_details?.email
        };
        await order.save();
        await Cart.deleteMany({ user: order.user });

        const recipientEmail = session.customer_details?.email || order.shippingDetails?.email;
        if (recipientEmail) {
          sendOrderConfirmationEmail({ to: recipientEmail, order }).catch(err => console.error('[Webhook Confirmation Email Error]:', err.message));
        }

        console.log(`✅ Order ${orderId} marked as Paid via Stripe Webhook`);
      }
    }
  }


  res.json({ received: true });
});
