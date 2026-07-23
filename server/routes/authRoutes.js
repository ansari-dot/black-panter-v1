import { Router } from 'express';
import { register, login, resendOtp, me, logout } from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';

const router = Router();

router.post('/register',   validate(registerSchema), register);
router.post('/login',      validate(loginSchema),    login);
router.post('/resend-otp', resendOtp);
router.get('/me',          me);
router.post('/logout',     logout);

export default router;
