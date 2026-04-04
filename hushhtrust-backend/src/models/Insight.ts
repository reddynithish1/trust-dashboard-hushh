import mongoose, { Document, Schema } from 'mongoose';

export interface IInsight extends Document {
  userId: mongoose.Types.ObjectId;
  dataType: string;
  usageCount: number;
}

const insightSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dataType: { type: String, required: true },
    usageCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInsight>('Insight', insightSchema);
