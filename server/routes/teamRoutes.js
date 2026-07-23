import { Router } from 'express';
import { getAll, getOne, create, update, updateStatus, remove } from '../controllers/teamController.js';
import validate from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { teamSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', protect, adminOnly, validate(teamSchema), create);
router.put('/:id', protect, adminOnly, validate(teamSchema), update);
router.patch('/:id/status', protect, adminOnly, updateStatus);
router.delete('/:id', protect, adminOnly, remove);

export default router;
