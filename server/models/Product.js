import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  slug:          { type: String, required: true, unique: true, index: true },
  category:      { type: String, required: true },
  description:   { type: String, required: true },
  capacity:      { type: String, required: true },
  voltage:       { type: String, required: true },
  warrantyMonths:{ type: Number, required: true, default: 12 },
  stockStatus:   { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
  image:         { type: String },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
