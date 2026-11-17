import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role:     { type: String, enum: ['admin', 'user'], default: 'user' },
  failedLoginAttempts: { type: Number, default: 0 },
  loginOtp: { type: String, default: null },
  loginOtpExpires: { type: Date, default: null },
  setupToken: { type: String, default: null },
  setupTokenExpires: { type: Date, default: null },
  resetPasswordOtp: { type: String, default: null },
  resetPasswordOtpExpires: { type: Date, default: null },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  phone:    { type: String, default: '' },
  address:  { type: String, default: '' },
  city:     { type: String, default: '' },
  state:    { type: String, default: '' },
  zipCode:  { type: String, default: '' },
  country:  { type: String, default: 'Australia' },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (password) {
  if (!this.password || !password) return false;
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
