import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  role:       { type: String, required: true },
  email:      { type: String, required: true },
  status:     { type: String, enum: ['Active', 'On Leave'], default: 'Active' },
  image:      { type: String },
  linkedin:   { type: String },
  joinedDate: { type: String },
}, { timestamps: true });

teamSchema.index({ createdAt: -1 });

export default mongoose.model('Team', teamSchema);

