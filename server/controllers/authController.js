import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendOtpEmail } from '../utils/emailService.js';

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Helper to validate strong password
export const isStrongPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  // Must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 digit, and 1 special character
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.'
    });
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password,
    role: role || 'user'
  });

  const token = signToken(user._id);
  res.cookie('token', token, cookieOptions());
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
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

export const me = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) return res.status(401).json({ message: 'Not authorized' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logged out' });
});
