import mongoose, { Document, Schema } from 'mongoose';

export interface IProject {
  name: string;
  contractor: string;
  allocatedAmount: number;
  spentAmount: number;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed';
  startDate: Date;
  endDate: Date;
}

export interface IPublicSpending extends Document {
  _id: mongoose.Types.ObjectId;
  area: string;
  fiscalYear: string;
  allocatedBudget: number;
  releasedBudget: number;
  spentBudget: number;
  projects: IProject[];
  transparencyScore: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PublicSpendingSchema = new Schema<IPublicSpending>(
  {
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true,
    },
    fiscalYear: {
      type: String,
      required: [true, 'Fiscal year is required'],
      trim: true,
    },
    allocatedBudget: {
      type: Number,
      default: 0,
    },
    releasedBudget: {
      type: Number,
      default: 0,
    },
    spentBudget: {
      type: Number,
      default: 0,
    },
    projects: [
      {
        name: { type: String, required: true },
        contractor: { type: String, required: true },
        allocatedAmount: { type: Number, required: true },
        spentAmount: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ['planned', 'in_progress', 'completed', 'delayed'],
          default: 'planned',
        },
        startDate: { type: Date },
        endDate: { type: Date },
        _id: false,
      },
    ],
    transparencyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

PublicSpendingSchema.index({ area: 1, fiscalYear: 1 });

const PublicSpending = mongoose.model<IPublicSpending>('PublicSpending', PublicSpendingSchema);

export default PublicSpending;
