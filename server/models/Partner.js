import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true, trim: true },
  websiteUrl: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Partner', partnerSchema);
