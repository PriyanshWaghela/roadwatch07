import mongoose, { Document, Schema } from 'mongoose';

export interface IRoadHealthHistory extends Document {
  _id: mongoose.Types.ObjectId;
  area: string;
  date: Date;
  healthScore: number;
  complaintCount: number;
  resolvedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoadHealthHistorySchema = new Schema<IRoadHealthHistory>(
  {
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    complaintCount: {
      type: Number,
      default: 0,
    },
    resolvedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

RoadHealthHistorySchema.index({ area: 1, date: -1 });

const RoadHealthHistory = mongoose.model<IRoadHealthHistory>(
  'RoadHealthHistory',
  RoadHealthHistorySchema
);

export default RoadHealthHistory;
