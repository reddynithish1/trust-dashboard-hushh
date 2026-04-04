import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import ActivityLog from '../models/ActivityLog';

export const getActivityTimeline = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
