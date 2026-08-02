import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getWishlist)
  .delete(clearWishlist);

router.post('/add', addToWishlist);
router.post('/remove', removeFromWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
