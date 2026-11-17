import mongoose from 'mongoose';
import Order from '../models/Order.js';

export const findOrderByIdOrShortId = async (idStr) => {
  if (!idStr) return null;
  const cleanId = String(idStr).trim();

  // 1. If valid 24-hex ObjectId, query directly
  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    const order = await Order.findById(cleanId);
    if (order) return order;
  }

  // 2. Fallback: Search orders matching the short 8-character display ID (slice(-8))
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(200);
  return recentOrders.find(o => 
    o._id.toString().slice(-8).toUpperCase() === cleanId.toUpperCase() ||
    o._id.toString() === cleanId
  ) || null;
};

export default findOrderByIdOrShortId;
