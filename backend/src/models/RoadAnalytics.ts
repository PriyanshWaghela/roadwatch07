import mongoose, { Document, Schema } from 'mongoose';

export interface ITrendData {
  date: Date;
  healthScore: number;
  complaints: number;
}

export interface IRoadAnalytics extends Document {
  _id: mongoose.Types.ObjectId;
  area: string;
  location: {
    type: string;
    coordinates: number[];
  };
  roadHealthScore: number;
  totalComplaints: number;
  resolvedComplaints: number;
  averageResolutionDays: number;
  severityDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  trendData: ITrendData[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RoadAnalyticsSchema = new Schema<IRoadAnalytics>(
  {
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
    roadHealthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    totalComplaints: {
      type: Number,
      default: 0,
    },
    resolvedComplaints: {
      type: Number,
      default: 0,
    },
    averageResolutionDays: {
      type: Number,
      default: 0,
    },
    severityDistribution: {
      low: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      critical: { type: Number, default: 0 },
    },
    trendData: [
      {
        date: { type: Date, required: true },
        healthScore: { type: Number, required: true },
        complaints: { type: Number, required: true },
        _id: false,
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

RoadAnalyticsSchema.index({ location: '2dsphere' });
RoadAnalyticsSchema.index({ area: 1 });

const RoadAnalytics = mongoose.model<IRoadAnalytics>('RoadAnalytics', RoadAnalyticsSchema);

export default RoadAnalytics;
