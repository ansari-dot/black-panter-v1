import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/partnerController.js';
import validate from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { z } from 'zod';

const partnerSchema = z.object({
  name: z.string().min(2),
  logoUrl: z.string().min(1),
  websiteUrl: z.string().optional(),
  displayOrder: z.number().optional(),
});

const router = Router();

router.get('/', getAll);
router.post('/', protect, adminOnly, validate(partnerSchema), create);
router.put('/:id', protect, adminOnly, validate(partnerSchema), update);
router.delete('/:id', protect, adminOnly, remove);

export default router;
