import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import App from '../models/App';
import User from '../models/User';
import Insight from '../models/Insight';
import { calculateTrustScore } from '../services/trustScoreEngine';

export const getInsights = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apps = await App.find({ userId: req.user.id });
    const userInsights = await Insight.find({ userId: req.user.id });
    
    const trustScore = calculateTrustScore(apps);
    
    await User.findByIdAndUpdate(req.user.id, { trustScore });

    const safeApps = apps.filter(a => a.riskLevel === 'Safe').length;
    const moderateApps = apps.filter(a => a.riskLevel === 'Moderate').length;
    const riskyApps = apps.filter(a => a.riskLevel === 'Risky').length;

    res.json({
      overallTrustScore: trustScore,
      totalApps: apps.length,
      riskDistribution: {
        safe: safeApps,
        moderate: moderateApps,
        risky: riskyApps
      },
      insights: userInsights
    });

  } catch (error) {
    next(error);
  }
};
