import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Alert from '../models/Alert';

export const getAlerts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

export const markAlertRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const alert = await Alert.findOne({ _id: req.params.id, userId: req.user.id });
    if (alert) {
      alert.read = true;
      await alert.save();
      res.json(alert);
    } else {
      res.status(404);
      throw new Error('Alert not found');
    }
  } catch (error) {
    next(error);
  }
};

export const clearAlerts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Alert.deleteMany({ userId: req.user.id });
    res.json({ message: 'All alerts successfully cleared' });
  } catch (error) {
    next(error);
  }
};
