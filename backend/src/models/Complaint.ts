import mongoose, { Document, Schema } from 'mongoose';

export interface IBoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
}

export interface IAIAnalysis {
  damageType: string;
  severity: string;
  confidence: number;
  roadHealthScore: number;
  boundingBoxes: IBoundingBox[];
  recommendations: string[];
  estimatedRepairCost: number;
  estimatedRepairDays: number;
}

export interface IStatusHistory {
  status: string;
  updatedBy: mongoose.Types.ObjectId;
  timestamp: Date;
  note: string;
}

export interface IComplaint extends Document {
  _id: mongoose.Types.ObjectId;
  citizen: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: { url: string; publicId: string }[];
  videos: { url: string; publicId: string }[];
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  category: 'pothole' | 'crack' | 'waterlogging' | 'road_damage' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
  priority: number;
  aiAnalysis?: IAIAnalysis;
  assignedAuthority?: mongoose.Types.ObjectId;
  statusHistory: IStatusHistory[];
  validationScore: number;
  isDuplicate: boolean;
  duplicateOf?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    citizen: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Citizen is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        _id: false,
      },
    ],
    videos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        _id: false,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
    },
    category: {
      type: String,
      enum: ['pothole', 'crack', 'waterlogging', 'road_damage', 'other'],
      default: 'other',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['submitted', 'verified', 'in_progress', 'resolved', 'rejected'],
      default: 'submitted',
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    aiAnalysis: {
      damageType: { type: String },
      severity: { type: String },
      confidence: { type: Number },
      roadHealthScore: { type: Number },
      boundingBoxes: [
        {
          x: { type: Number },
          y: { type: Number },
          w: { type: Number },
          h: { type: Number },
          label: { type: String },
          confidence: { type: Number },
          _id: false,
        },
      ],
      recommendations: [{ type: String }],
      estimatedRepairCost: { type: Number },
      estimatedRepairDays: { type: Number },
    },
    assignedAuthority: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
        _id: false,
      },
    ],
    validationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    duplicateOf: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geospatial queries
ComplaintSchema.index({ location: '2dsphere' });

// Additional indexes for common queries
ComplaintSchema.index({ citizen: 1, createdAt: -1 });
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ severity: 1 });
ComplaintSchema.index({ category: 1 });

const Complaint = mongoose.model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;
