import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'unused_app' | 'high_risk' | 'sensitive_data' | 'system';
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: ['unused_app', 'high_risk', 'sensitive_data', 'system'],
      required: true 
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAlert>('Alert', alertSchema);
