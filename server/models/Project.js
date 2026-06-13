import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  subtitle: { type: String, default: '' },
  description: { type: String, required: true },
  category: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  imageUrl: { type: String, default: '' },
  heroTag: { type: String, default: 'Project Detail' },
  heroTitleLine1White: { type: String, default: '' },
  heroTitleLine1Orange: { type: String, default: '' },
  heroTitleLine2White: { type: String, default: '' },
  heroTitleLine2Orange: { type: String, default: '' },
  gallery: { type: [String], default: [] },
  highlights: { type: [String], default: [] },
  metrics: [{
    label: { type: String },
    value: { type: String }
  }],
  process: { type: [String], default: [] },
  clientName: { type: String, default: '' },
  location: { type: String, default: '' },
  sector: { type: String, default: '' },
  completedDate: { type: String, default: '' },
  timeline: { type: String, default: '' },
  unitsInstalled: { type: String, default: '' },
  uptime: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
