import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import App from '../models/App';

export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apps = await App.find({ userId: req.user.id });
    const user = await User.findById(req.user.id).select('trustScore');
    
    res.json({
      trustScore: user?.trustScore || 100,
      connectedAppsCount: apps.length,
      lastActivity: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
