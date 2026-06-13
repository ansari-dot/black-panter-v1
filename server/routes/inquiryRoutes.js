import { Router } from 'express';
import { getAll, getOne, create, updateStatus, remove } from '../controllers/inquiryController.js';
import validate from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { inquirySchema } from '../validators/schemas.js';

const router = Router();

router.get('/',       protect, adminOnly, getAll);
router.get('/:id',    protect, adminOnly, getOne);
router.post('/',      validate(inquirySchema), create);
router.patch('/:id',  protect, adminOnly, updateStatus);
router.delete('/:id', protect, adminOnly, remove);

export default router;
