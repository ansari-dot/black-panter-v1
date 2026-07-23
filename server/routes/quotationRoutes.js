import express from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/quotationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

export default router;
