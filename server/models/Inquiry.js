import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  company:    { type: String, default: '', trim: true },
  email:      { type: String, required: true, trim: true },
  phone:      { type: String, default: '', trim: true },
  service:    { type: String, default: '', trim: true },
  subject:    { type: String, default: '', trim: true },
  message:    { type: String, required: true, trim: true },
  status:     { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  replyText:  { type: String, default: '' },
  replyDate:  { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);
