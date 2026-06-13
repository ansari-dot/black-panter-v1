import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const user = await User.create(req.body);
  const token = signToken(user._id);
  res.cookie('token', token, cookieOptions());
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.matchPassword(req.body.password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user._id);
  res.cookie('token', token, cookieOptions());
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const me = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) return res.status(401).json({ message: 'Not authorized' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const logout = (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logged out' });
};
