import { Router } from 'express';
import { getAll, getOne, getBySlug, create, update, updateStock, updateFeatured, remove } from '../controllers/productController.js';
import validate from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { productSchema } from '../validators/schemas.js';

const router = Router();

router.get('/',                  getAll);
router.get('/slug/:slug',        getBySlug);
router.get('/:id',               getOne);
router.post('/',                 protect, adminOnly, validate(productSchema), create);
router.put('/:id',               protect, adminOnly, validate(productSchema), update);
router.patch('/:id/stock',       protect, adminOnly, updateStock);
router.patch('/:id/featured',    protect, adminOnly, updateFeatured);
router.delete('/:id',            protect, adminOnly, remove);

export default router;
