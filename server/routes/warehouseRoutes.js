import { Router } from 'express';
import { getAll, getOne, create, update, updateStatus, remove } from '../controllers/warehouseController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/',              getAll);                              // public — list warehouses
router.get('/:id',           getOne);                             // public — single warehouse
router.post('/',             protect, adminOnly, create);          // admin only
router.put('/:id',           protect, adminOnly, update);          // admin only
router.patch('/:id/status',  protect, adminOnly, updateStatus);   // admin only
router.delete('/:id',        protect, adminOnly, remove);          // admin only

export default router;
