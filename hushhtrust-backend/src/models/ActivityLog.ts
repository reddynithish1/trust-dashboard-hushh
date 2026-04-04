import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  appName: string;
  action: string;
  timestamp: Date;
}

const activityLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appName: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
