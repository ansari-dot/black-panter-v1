import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/equipmentController.js';
import validate from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { z } from 'zod';

const equipmentSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  imageUrl: z.string().optional(),
  displayOrder: z.number().optional(),
});

const router = Router();

router.get('/', getAll);
router.post('/', protect, adminOnly, validate(equipmentSchema), create);
router.put('/:id', protect, adminOnly, validate(equipmentSchema), update);
router.delete('/:id', protect, adminOnly, remove);

export default router;
