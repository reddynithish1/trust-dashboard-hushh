import express from 'express';
import { getConnectedApps, getAppById, connectApp, revokeApp, updateAppPermission } from '../controllers/appsController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getConnectedApps);
router.post('/connect', protect, connectApp);
router.get('/:id', protect, getAppById);
router.delete('/:id', protect, revokeApp);
router.put('/:id/permissions', protect, updateAppPermission);

export default router;
