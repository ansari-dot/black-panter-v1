import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  code:          { type: String, required: true, unique: true, index: true }, // short code e.g. SYD-01
  address:       { type: String, default: '' },
  city:          { type: String, required: true },
  state:         { type: String, default: '' },
  country:       { type: String, default: 'Australia' },
  contactPerson: { type: String, default: '' },
  phone:         { type: String, default: '' },
  email:         { type: String, default: '' },
  status:        { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  notes:         { type: String, default: '' },
}, { timestamps: true });

warehouseSchema.index({ createdAt: -1 });
warehouseSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Warehouse', warehouseSchema);

