import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type:
    | 'complaint_submitted'
    | 'complaint_accepted'
    | 'repair_started'
    | 'repair_completed'
    | 'status_updated'
    | 'system';
  title: string;
  message: string;
  relatedComplaint?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    type: {
      type: String,
      enum: [
        'complaint_submitted',
        'complaint_accepted',
        'repair_started',
        'repair_completed',
        'status_updated',
        'system',
      ],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    relatedComplaint: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, read: 1 });

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
