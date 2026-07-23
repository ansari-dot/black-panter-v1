import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  adminTitle: {
    type: String,
    default: 'Black Panther Batteries',
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  socialTwitter: {
    type: String,
    default: 'https://twitter.com/blackpanthercells',
  },
  socialLinkedin: {
    type: String,
    default: 'https://linkedin.com/company/black-panther-batteries',
  },
  socialFacebook: {
    type: String,
    default: 'https://facebook.com/blackpanthertraction',
  },
  socialInstagram: {
    type: String,
    default: 'https://instagram.com/blackpantherheavy',
  },
  systemStatus: {
    apiServer: { type: String, enum: ['Operational', 'Degraded', 'Offline'], default: 'Operational' },
    database: { type: String, enum: ['Operational', 'Degraded', 'Offline'], default: 'Operational' },
    cdn: { type: String, enum: ['Operational', 'Degraded', 'Offline'], default: 'Operational' },
  },
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
