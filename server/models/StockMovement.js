import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },

  type: {
    type: String,
    enum: ['in', 'out'],
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  // Optional note: e.g. "Job #WO-2026-0156" or "Received from ABC Supplier"
  note: {
    type: String,
    default: '',
  },

  // Who performed this action (admin name from JWT)
  by: {
    type: String,
    default: 'Admin',
  },

  // Stock snapshot before and after this movement
  stockBefore: {
    type: Number,
    required: true,
  },
  stockAfter: {
    type: Number,
    required: true,
  },
  // Warehouse this movement belongs to
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    default: null,
    index: true,
  },
}, { timestamps: true });

// Index for fast recent-movements queries
stockMovementSchema.index({ createdAt: -1 });
stockMovementSchema.index({ product: 1, createdAt: -1 });
stockMovementSchema.index({ warehouse: 1, createdAt: -1 });

export default mongoose.model('StockMovement', stockMovementSchema);
