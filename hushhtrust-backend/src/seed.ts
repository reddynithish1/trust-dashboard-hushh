import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import App from './models/App';
import Alert from './models/Alert';
import ActivityLog from './models/ActivityLog';
import Insight from './models/Insight';
import { connectDB } from './config/db';

dotenv.config();

const seedData = async () => {
  try {
    await User.deleteMany();
    await App.deleteMany();
    await Alert.deleteMany();
    await ActivityLog.deleteMany();
    await Insight.deleteMany();

    // ============================================
    // USER A: Jane Doe
    // ============================================
    const userA = await User.create({
      name: 'User A',
      email: 'usera@example.com',
      password: 'password123',
      trustScore: 85,
    });

    // ============================================
    // USER B: John Smith
    // ============================================
    const userB = await User.create({
      name: 'User B',
      email: 'userb@example.com',
      password: 'password123',
      trustScore: 92,
    });

    // --------------------------------------------
    // SEED USER A DATA (Strictly Isolated)
    // --------------------------------------------
    const appsA = [
      {
        userId: userA._id,
        appName: 'Spotify',
        appLogo: 'spotify.com',
        permissions: [
          { categoryId: 'audio', category: 'Microphone', purpose: 'Voice search', isGranted: false, isOptional: true },
          { categoryId: 'media', category: 'Media Library', purpose: 'Playback local files', isGranted: true, isOptional: false }
        ],
        lastAccessed: new Date(),
        usageFrequency: 'Daily',
        riskLevel: 'Safe',
        trustScore: 95,
        dataCategories: ['Media Library']
      },
      {
        userId: userA._id,
        appName: 'Snapchat',
        appLogo: 'snapchat.com',
        permissions: [
          { categoryId: 'cam', category: 'Camera', purpose: 'Take snaps', isGranted: true, isOptional: false },
          { categoryId: 'loc', category: 'Location', purpose: 'Filters', isGranted: true, isOptional: true }
        ],
        lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        usageFrequency: 'Rarely',
        riskLevel: 'Risky',
        trustScore: 40,
        dataCategories: ['Camera', 'Location']
      }
    ];

    await App.insertMany(appsA);

    await Alert.create([
      { userId: userA._id, type: 'high_risk', message: 'User A: Snapchat has high risk permissions and is rarely used.', read: false }
    ]);

    await ActivityLog.create([
      { userId: userA._id, appName: 'Spotify', action: 'Accessed Media Library' }
    ]);

    await Insight.create([
      { userId: userA._id, dataType: 'Location', usageCount: 45 },
      { userId: userA._id, dataType: 'Microphone', usageCount: 12 }
    ]);

    // --------------------------------------------
    // SEED USER B DATA (Strictly Isolated)
    // --------------------------------------------
    const appsB = [
      {
        userId: userB._id,
        appName: 'Uber',
        appLogo: 'uber.com',
        permissions: [
          { categoryId: 'loc', category: 'Location', purpose: 'Find rides', isGranted: true, isOptional: false },
          { categoryId: 'bg_loc', category: 'Background Location', purpose: 'Track driver', isGranted: true, isOptional: true }
        ],
        lastAccessed: new Date(),
        usageFrequency: 'Weekly',
        riskLevel: 'Moderate',
        trustScore: 75,
        dataCategories: ['Location', 'Background Location']
      }
    ];

    await App.insertMany(appsB);

    await Alert.create([
      { userId: userB._id, type: 'sensitive_data', message: 'User B: Uber accessed your background location 3 times today.', read: false }
    ]);

    await ActivityLog.create([
      { userId: userB._id, appName: 'Uber', action: 'Accessed Background Location' }
    ]);

    await Insight.create([
      { userId: userB._id, dataType: 'Background Location', usageCount: 88 }
    ]);

    console.log('✅ DATABASE SUCCESSFULLY SEEDED: 2 strictly isolated user environments created.');
  } catch (error) {
    console.error('❌ SEED ERROR:', error);
    throw error;
  }
};

export default seedData;

if (require.main === module) {
  connectDB().then(() => seedData())
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
