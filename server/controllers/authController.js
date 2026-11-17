import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Wishlist from '../models/Wishlist.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendOtpEmail, sendSetupEmail, sendResetPasswordOtpEmail } from '../utils/emailService.js';
import Notification from '../models/Notification.js';
const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = () => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  domain: isProd ? '.blackpanther-batteries.com' : undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2h' });

// Helper to validate strong password
export const isStrongPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  // Must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 digit, and 1 special character
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const exists = await User.findOne({ email: cleanEmail });
  
  if (exists) {
    // If the user exists but hasn't set up yet, we can resend the token
    if (!exists.password && exists.setupToken) {
      const setupToken = crypto.randomBytes(32).toString('hex');
      exists.setupToken = crypto.createHash('sha256').update(setupToken).digest('hex');
      exists.setupTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await exists.save();
      await sendSetupEmail({ to: exists.email, token: setupToken, name: exists.name });
      return res.status(200).json({ message: 'Setup email resent successfully.' });
    }
    return res.status(400).json({ message: 'Email already in use' });
  }

  const setupToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(setupToken).digest('hex');

  const user = await User.create({
    name,
    email: cleanEmail,
    role: role || 'user',
    setupToken: hashedToken,
    setupTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });

  try {
    await sendSetupEmail({ to: user.email, token: setupToken, name: user.name });
    
    // Dispatch Admin Notification
    await Notification.create({
      type: 'NEW_USER',
      title: 'New User Registration',
      message: `${user.name} (${user.email}) has registered.`,
      link: '/admin/settings', // Assuming users might be managed here in the future
    });

    res.status(201).json({ message: 'Registration successful! Please check your email to set your password.' });
  } catch (err) {
    console.error('Failed to send setup email:', err);
    res.status(500).json({ message: 'Account created, but failed to send setup email. Please contact support.' });
  }
});

export const setupAccount = asyncHandler(async (req, res) => {
  const { email, token, password } = req.body;
  
  if (!email || !token || !password) {
    return res.status(400).json({ message: 'Email, token, and password are required' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.'
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ 
    email: cleanEmail,
    setupToken: hashedToken,
    setupTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired setup token. Please request a new registration.' });
  }

  // Set password and clear tokens
  user.password = password;
  user.setupToken = null;
  user.setupTokenExpires = null;
  await user.save();

  // Log them in immediately
  const jwtToken = signToken(user._id);
  res.cookie('token', jwtToken, cookieOptions());
  res.status(200).json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, otp } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const now = new Date();
  const cleanReceivedOtp = String(otp || '').trim();
  const cleanStoredOtp = String(user.loginOtp || '').trim();
  const isOtpActive = user.failedLoginAttempts >= 2 || (user.loginOtp && user.loginOtpExpires && new Date(user.loginOtpExpires) > now);

  // 1. DIRECT OTP VERIFICATION (When 6-digit OTP is provided by user)
  if (cleanReceivedOtp && isOtpActive) {
    if (new Date(user.loginOtpExpires) <= now) {
      return res.status(401).json({
        requiresOtp: true,
        email: user.email,
        message: 'OTP code has expired. Click "Resend OTP Email" to receive a new code.'
      });
    }

    console.log(`[OTP DIRECT VERIFY] User: ${user.email} | Stored: "${cleanStoredOtp}" | Received: "${cleanReceivedOtp}"`);

    if (cleanStoredOtp !== cleanReceivedOtp) {
      return res.status(401).json({
        requiresOtp: true,
        email: user.email,
        message: `Incorrect OTP code (${cleanReceivedOtp}). Please check your email.`
      });
    }

    // OTP MATCH SUCCESS! Direct Access Granted to Admin Dashboard!
    user.failedLoginAttempts = 0;
    user.loginOtp = null;
    user.loginOtpExpires = null;
    await user.save();

    const token = signToken(user._id);
    res.cookie('token', token, cookieOptions());
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }

  // 2. STANDARD PASSWORD VERIFICATION
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const isPasswordMatch = await user.matchPassword(password);

  // Correct Password -> Direct Automatic Access to Dashboard!
  if (isPasswordMatch) {
    user.failedLoginAttempts = 0;
    user.loginOtp = null;
    user.loginOtpExpires = null;
    await user.save();

    const token = signToken(user._id);
    res.cookie('token', token, cookieOptions());
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }

  // Incorrect Password -> Increment Failed Attempt Counter
  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

  // Trigger 2-Step OTP on 2nd Failed Attempt
  if (user.failedLoginAttempts >= 2) {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.loginOtp = generatedOtp;
    user.loginOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    console.log(`[2 FAILED ATTEMPTS: OTP SENT] Email: ${user.email} | OTP: ${generatedOtp}`);

    try {
      await sendOtpEmail({ to: user.email, otp: generatedOtp });
    } catch (emailErr) {
      console.error('[OTP EMAIL ERROR]:', emailErr);
    }

    return res.status(401).json({
      requiresOtp: true,
      email: user.email,
      message: 'Security Alert: 2 failed login attempts detected. An OTP code has been sent to your registered admin email.'
    });
  }

  await user.save();
  return res.status(401).json({
    message: `Invalid password. Warning: 1 attempt remaining before 2-step OTP verification is triggered.`
  });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const cleanEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  user.loginOtp = generatedOtp;
  user.loginOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  console.log(`[RESEND OTP SENT] Email: ${user.email} | OTP: ${generatedOtp}`);

  try {
    await sendOtpEmail({ to: user.email, otp: generatedOtp });
    res.json({ message: 'A new 6-digit OTP code has been sent to your admin email.' });
  } catch (err) {
    console.error('Resend OTP Email error:', err);
    res.status(500).json({ message: 'Failed to send OTP email. Please check server email credentials.' });
  }
});

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || '',
  address: user.address || '',
  city: user.city || '',
  state: user.state || '',
  zipCode: user.zipCode || '',
  country: user.country || 'Australia'
});

export const me = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) return res.status(401).json({ message: 'Not authorized' });
  res.json({ user: formatUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logged out' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const cleanEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    return res.status(404).json({ message: 'No account found with this email address.' });
  }

  // Generate 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordOtp = generatedOtp;
  user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  try {
    await sendResetPasswordOtpEmail({ to: user.email, otp: generatedOtp });
    res.json({ message: 'A 6-digit OTP code has been sent to your email.' });
  } catch (err) {
    console.error('Forgot Password Email error:', err);
    res.status(500).json({ message: 'Failed to send OTP email.' });
  }
});

export const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const cleanEmail = email.toLowerCase().trim();
  const cleanOtp = String(otp).trim();
  
  const user = await User.findOne({ 
    email: cleanEmail,
    resetPasswordOtp: cleanOtp,
    resetPasswordOtpExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired OTP code.' });
  }

  res.json({ message: 'OTP verified successfully.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) return res.status(400).json({ message: 'Email, OTP, and new password are required' });

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.'
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanOtp = String(otp).trim();

  const user = await User.findOne({ 
    email: cleanEmail,
    resetPasswordOtp: cleanOtp,
    resetPasswordOtpExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired OTP code. Please request a new one.' });
  }

  // Set new password and clear reset OTP
  user.password = password;
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpires = null;
  
  // Also clear login OTPs and failed attempts to give them a clean slate
  user.failedLoginAttempts = 0;
  user.loginOtp = null;
  user.loginOtpExpires = null;
  
  await user.save();

  res.json({ message: 'Password reset successful. You can now log in.' });
});

// Profile Management
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.address !== undefined) user.address = req.body.address;
  if (req.body.city !== undefined) user.city = req.body.city;
  if (req.body.state !== undefined) user.state = req.body.state;
  if (req.body.zipCode !== undefined) user.zipCode = req.body.zipCode;
  if (req.body.country !== undefined) user.country = req.body.country;

  if (req.body.password) {
    if (!isStrongPassword(req.body.password)) {
      return res.status(400).json({ message: 'Password is not strong enough.' });
    }
    user.password = req.body.password;
  }
  
  await user.save();
  res.json({ message: 'Profile updated successfully', user: formatUser(user) });
});

// Wishlist Management
export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
    path: 'products',
    select: 'name title price regularPrice salePrice imageUrl image category slug stockStatus mainImage description',
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  res.json(wishlist.products || []);
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID is required' });
  
  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user.id, products: [] });
  }

  const exists = wishlist.products.some(p => p && p.toString() === productId);
  if (!exists) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  wishlist = await wishlist.populate({
    path: 'products',
    select: 'name title price regularPrice salePrice imageUrl image category slug stockStatus mainImage description',
  });

  res.json(wishlist.products || []);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID is required' });
  
  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user.id, products: [] });
  }

  wishlist.products = wishlist.products.filter(id => id && id.toString() !== productId);
  await wishlist.save();

  wishlist = await wishlist.populate({
    path: 'products',
    select: 'name title price regularPrice salePrice imageUrl image category slug stockStatus mainImage description',
  });

  res.json(wishlist.products || []);
});
