import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
    category: { type: String, default: '' }
  }],
  totalAmount: { type: Number, required: true },
  shippingDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'Australia' }
  },
  orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  paymentMethod: { type: String, default: 'Credit Card' },
  stripeSessionId: { type: String },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  shipping: {
    courier: { type: String, default: 'AUSTRALIA_POST' },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'READY_TO_SHIP', 'SHIPMENT_CREATED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'RETURNED', 'CANCELLED'], 
      default: 'PENDING' 
    },
    shipmentId: { type: String, default: null },
    itemId: { type: String, default: null },
    trackingNumber: { type: String, default: null },
    trackingUrl: { type: String, default: null },
    labelUrl: { type: String, default: null },
    labelReference: { type: String, default: null },
    parcelWeightKg: { type: Number, default: 1.5 },
    parcelDimensions: {
      lengthCm: { type: Number, default: 25 },
      widthCm: { type: Number, default: 20 },
      heightCm: { type: Number, default: 15 }
    },
    shipmentCreatedAt: { type: Date, default: null },
    handedOverAt: { type: Date, default: null },
    shippedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    lastTrackingSyncAt: { type: Date, default: null },
    trackingEvents: [{
      status: { type: String },
      description: { type: String },
      location: { type: String },
      timestamp: { type: Date }
    }]
  }
}, { timestamps: true });


orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
