import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log('[protect] cookie token:', token ? 'present' : 'MISSING');
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[protect] decoded id:', decoded.id);
    req.user = await User.findById(decoded.id).select('-password');
    console.log('[protect] user found:', req.user ? `${req.user.email} role=${req.user.role}` : 'NULL');
    next();
  } catch (err) {
    console.log('[protect] error:', err.message);
    res.status(401).json({ message: 'Not authorized' });
  }
};

export const adminOnly = (req, res, next) => {
  console.log('[adminOnly] req.user:', req.user ? `role=${req.user.role}` : 'NULL');
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};
