import Setting from '../models/Setting.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// Get or initialize global settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  res.json(settings);
});

// Update global settings
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = new Setting(req.body);
  } else {
    Object.assign(settings, req.body);
  }
  await settings.save();
  res.json(settings);
});

// Change admin user password in database
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  // Find logged in user or admin user
  let user = null;
  if (req.user) {
    user = await User.findById(req.user._id);
  }
  if (!user) {
    user = await User.findOne({ role: 'admin' });
  }
  if (!user) {
    user = await User.findOne();
  }

  if (!user) {
    return res.status(404).json({ message: 'User account not found' });
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});
