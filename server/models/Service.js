import mongoose from 'mongoose';

const technicalProcedureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  iconName: { type: String, default: 'battery' },
  serviceTagline: { type: String, default: '' },
  heroDescription: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  detailImageUrl: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  secondaryText: { type: String, default: '' },
  keyHighlights: { type: [String], default: [] },
  technicalProcedures: { type: [technicalProcedureSchema], default: [] },
  gallery: { type: [String], default: [] },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
