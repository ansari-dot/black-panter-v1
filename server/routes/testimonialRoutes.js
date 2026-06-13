import { Router } from 'express';
import { getAll, getOne, create, update, updateStatus, remove } from '../controllers/testimonialController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { testimonialStatusSchema } from '../validators/schemas.js';

const router = Router();

router.get('/',       getAll);
router.get('/:id',    getOne);
router.post('/',      protect, adminOnly, create);
router.put('/:id',    protect, adminOnly, update);
router.patch('/:id/status', protect, adminOnly, validate(testimonialStatusSchema), updateStatus);
router.delete('/:id', protect, adminOnly, remove);

export default router;
