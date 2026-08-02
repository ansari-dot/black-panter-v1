import express from 'express';
import { adminOnly, protect } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAll
} from '../controllers/notificationController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/', getNotifications);
router.put('/mark-all-read', markAllAsRead);
router.delete('/clear', clearAll);
router.put('/:id/read', markAsRead);

export default router;
