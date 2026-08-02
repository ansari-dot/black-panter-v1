import { Router } from 'express';
import { register, login, resendOtp, me, logout, setupAccount, forgotPassword, verifyResetOtp, resetPassword, updateProfile, getWishlist, addToWishlist, removeFromWishlist } from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';

const router = Router();

router.post('/register',     validate(registerSchema), register);
router.post('/setup-account', setupAccount);
router.post('/login',        validate(loginSchema),    login);
router.post('/resend-otp',   resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
router.get('/me',            me);
router.post('/logout',       logout);

// Profile Management
router.put('/profile', protect, updateProfile);

// Wishlist Management
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/add', protect, addToWishlist);
router.post('/wishlist/remove', protect, removeFromWishlist);

export default router;
