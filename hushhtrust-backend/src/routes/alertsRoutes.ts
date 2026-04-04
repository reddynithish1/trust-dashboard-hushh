import express from 'express';
import { getAlerts, markAlertRead, clearAlerts } from '../controllers/alertsController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getAlerts);
router.put('/:id/read', protect, markAlertRead);
router.delete('/clear', protect, clearAlerts);

export default router;
