import express from 'express';
import { getCart, syncCart, updateCartItem, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCart)
  .post(updateCartItem)
  .delete(clearCart);

router.post('/sync', syncCart);

export default router;
