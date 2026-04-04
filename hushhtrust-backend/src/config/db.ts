import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import seedData from '../seed'; // We will export this from seed.ts

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hushhtrust';
    
    try {
      const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (e) {
      console.log('Local MongoDB not found, falling back to in-memory database...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`In-memory MongoDB Connected: ${conn.connection.host}`);
      // Seed the in-memory database so it has demo data
      await seedData();
    }
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
