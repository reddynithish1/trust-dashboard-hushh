import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import App from '../models/App';
import ActivityLog from '../models/ActivityLog';

export const getConnectedApps = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apps = await App.find({ userId: req.user.id });
    res.json(apps);
  } catch (error) {
    next(error);
  }
};

export const getAppById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const app = await App.findOne({ _id: req.params.id, userId: req.user.id });
    if (app) {
      res.json(app);
    } else {
      res.status(404);
      throw new Error('App not found or access denied');
    }
  } catch (error) {
    next(error);
  }
};

export const connectApp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const newApp = await App.create({
      userId: req.user.id,
      ...req.body
    });
    
    await ActivityLog.create({
      userId: req.user.id,
      appName: newApp.appName,
      action: 'Authorized application connection.'
    });

    res.status(201).json(newApp);
  } catch (error) {
    next(error);
  }
};

export const revokeApp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const app = await App.findOne({ _id: req.params.id, userId: req.user.id });
    if (app) {
      await app.deleteOne();
      
      await ActivityLog.create({
        userId: req.user.id,
        appName: app.appName,
        action: 'Revoked application access.'
      });
      
      res.json({ message: 'App access revoked permanently' });
    } else {
      res.status(404);
      throw new Error('App not found');
    }
  } catch (error) {
    next(error);
  }
};

export const updateAppPermission = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const app = await App.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (app) {
      const { permissionId, isGranted } = req.body;
      const permItem = app.permissions.find(p => p._id?.toString() === permissionId);
      
      if (permItem) {
        permItem.isGranted = isGranted;
        await app.save();

        await ActivityLog.create({
          userId: req.user.id,
          appName: app.appName,
          action: `${isGranted ? 'Granted' : 'Blocked'} permission for ${permItem.category}.`
        });

        res.json(app);
      } else {
        res.status(404);
        throw new Error('Permission element not found on this application');
      }
    } else {
      res.status(404);
      throw new Error('App not found in your context');
    }
  } catch (error) {
    next(error);
  }
};
