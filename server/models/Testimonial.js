import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  company: { type: String, required: true },
  message: { type: String, required: true },
  rating:  { type: Number, min: 1, max: 5, required: true },
  image:   { type: String },
  status:  { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
