import express from 'express';
import { getActivityTimeline } from '../controllers/activityController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/timeline', protect, getActivityTimeline);

export default router;
