import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  company:    { type: String, default: '', trim: true },
  email:      { type: String, default: '', trim: true },
  phone:      { type: String, default: '', trim: true },
  service:    { type: String, default: '', trim: true },
  subject:    { type: String, default: '', trim: true },
  message:    { type: String, required: true, trim: true },
  type:       { type: String, enum: ['inquiry', 'quote'], default: 'inquiry' },
  quoteDetails: {
    batteryType:  { type: String, default: '', trim: true },
    quantity:     { type: String, default: '', trim: true },
    location:     { type: String, default: '', trim: true },
    address:      { type: String, default: '', trim: true },
    billingAddress: { type: String, default: '', trim: true },
    abn:          { type: String, default: '', trim: true },
    urgency:      { type: String, default: '', trim: true },
    sourcePage:   { type: String, default: '', trim: true },
    sourceButton: { type: String, default: '', trim: true },
    submittedAt:  { type: String, default: '', trim: true },
  },
  status:     { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  replyText:  { type: String, default: '' },
  replyDate:  { type: String, default: '' },
}, { timestamps: true });

inquirySchema.index({ createdAt: -1 });

export default mongoose.model('Inquiry', inquirySchema);

