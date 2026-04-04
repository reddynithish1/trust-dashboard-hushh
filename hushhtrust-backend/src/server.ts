import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/error';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import appsRoutes from './routes/appsRoutes';
import alertsRoutes from './routes/alertsRoutes';
import activityRoutes from './routes/activityRoutes';
import insightsRoutes from './routes/insightsRoutes';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Base route for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', message: 'HushhTrust API is running securely.' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/apps', appsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/insights', insightsRoutes);

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HushhTrust API server running dynamically on port ${PORT}`);
});
