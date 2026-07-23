import { Router } from 'express';
import { getAll, getBySlug, getOne, getPublic, create, update, remove, updateFeatured } from '../controllers/serviceController.js';
import validate from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { serviceSchema } from '../validators/schemas.js';

const router = Router();

router.get('/public',          getPublic);
router.get('/slug/:slug',      getBySlug);
router.get('/',                getAll);
router.get('/:id',             getOne);
router.post('/',               protect, adminOnly, validate(serviceSchema), create);
router.put('/:id',             protect, adminOnly, validate(serviceSchema), update);
router.patch('/:id/featured',  protect, adminOnly, updateFeatured);
router.delete('/:id',          protect, adminOnly, remove);

export default router;
