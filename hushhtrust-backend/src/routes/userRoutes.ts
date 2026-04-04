import express from 'express';
import { getUserProfile, updateUserProfile, getUserStats } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getUserProfile);
router.put('/update', protect, updateUserProfile);
router.get('/stats', protect, getUserStats);

export default router;
