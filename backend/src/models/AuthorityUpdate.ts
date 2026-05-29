import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthorityUpdate extends Document {
  _id: mongoose.Types.ObjectId;
  complaint: mongoose.Types.ObjectId;
  authority: mongoose.Types.ObjectId;
  action: 'priority_changed' | 'status_updated' | 'assigned' | 'note_added';
  previousValue: string;
  newValue: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorityUpdateSchema = new Schema<IAuthorityUpdate>(
  {
    complaint: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
      required: [true, 'Complaint is required'],
    },
    authority: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Authority is required'],
    },
    action: {
      type: String,
      enum: ['priority_changed', 'status_updated', 'assigned', 'note_added'],
      required: [true, 'Action is required'],
    },
    previousValue: {
      type: String,
      default: '',
    },
    newValue: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

AuthorityUpdateSchema.index({ complaint: 1, createdAt: -1 });
AuthorityUpdateSchema.index({ authority: 1 });

const AuthorityUpdate = mongoose.model<IAuthorityUpdate>('AuthorityUpdate', AuthorityUpdateSchema);

export default AuthorityUpdate;
