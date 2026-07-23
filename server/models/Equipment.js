import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

equipmentSchema.index({ displayOrder: 1, createdAt: -1 });

export default mongoose.model('Equipment', equipmentSchema);

