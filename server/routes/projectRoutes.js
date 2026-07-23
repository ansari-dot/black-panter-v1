import express from 'express';
import { getAll, getPublic, getOne, getBySlug, create, update, remove, updateFeatured } from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/public',         getPublic);
router.get('/slug/:slug',     getBySlug);
router.get('/',               protect, getAll);
router.get('/:id',            protect, getOne);
router.post('/',              protect, create);
router.put('/:id',            protect, update);
router.patch('/:id/featured', protect, updateFeatured);
router.delete('/:id',         protect, remove);

export default router;
