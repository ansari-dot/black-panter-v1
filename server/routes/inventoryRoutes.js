import { Router } from 'express';
import {
  getInventory,
  getMovements,
  addMovement,
  updateInventoryConfig,
  getInventorySummary,
} from '../controllers/inventoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public — used to display stock status on client site too
router.get('/',           getInventory);
router.get('/summary',    getInventorySummary);

// Admin only — movement history and config
router.get('/movements',                        protect, adminOnly, getMovements);
router.post('/movement',                        protect, adminOnly, addMovement);
router.patch('/:productId/config',              protect, adminOnly, updateInventoryConfig);

export default router;
