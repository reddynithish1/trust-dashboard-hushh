import express from 'express';
import { getInsights } from '../controllers/insightsController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/trust-score', protect, getInsights);

export default router;
