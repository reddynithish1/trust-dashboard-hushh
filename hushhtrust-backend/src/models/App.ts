import mongoose, { Document, Schema } from 'mongoose';

export interface IAppPermission {
  categoryId: string;
  category: string;
  purpose: string;
  isGranted: boolean;
  isOptional: boolean;
  _id?: string;
}

export interface IConnectedApp extends Document {
  userId: mongoose.Types.ObjectId;
  appName: string;
  appLogo: string;
  permissions: IAppPermission[];
  lastAccessed: Date;
  usageFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Rarely';
  riskLevel: 'Safe' | 'Moderate' | 'Risky';
  trustScore: number;
  dataCategories: string[];
  riskExplanation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appName: { type: String, required: true },
    appLogo: { type: String, default: 'Box' },
    permissions: [
      {
        categoryId: { type: String, required: true },
        category: { type: String, required: true },
        purpose: { type: String, required: true },
        isGranted: { type: Boolean, default: true },
        isOptional: { type: Boolean, default: true },
      },
    ],
    lastAccessed: { type: Date, default: Date.now },
    usageFrequency: { 
      type: String, 
      enum: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
      default: 'Daily' 
    },
    riskLevel: { 
      type: String, 
      enum: ['Safe', 'Moderate', 'Risky'],
      default: 'Safe' 
    },
    trustScore: { type: Number, default: 100 },
    dataCategories: [{ type: String }],
    riskExplanation: { type: String }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IConnectedApp>('App', appSchema);
