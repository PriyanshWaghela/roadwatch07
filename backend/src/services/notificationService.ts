import Notification, { INotification } from '../models/Notification';
import User from '../models/User';
import { IComplaint } from '../models/Complaint';
import mongoose from 'mongoose';

/**
 * Create and save a notification
 */
export async function createNotification(
  userId: mongoose.Types.ObjectId | string,
  type: INotification['type'],
  title: string,
  message: string,
  complaintId?: mongoose.Types.ObjectId | string
): Promise<INotification> {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    relatedComplaint: complaintId || undefined,
  });

  return notification;
}

/**
 * Notify citizen and all authority users when a complaint is submitted
 */
export async function notifyComplaintSubmitted(complaint: IComplaint): Promise<void> {
  try {
    // Notify the citizen who submitted
    await createNotification(
      complaint.citizen,
      'complaint_submitted',
      'Complaint Submitted Successfully',
      `Your complaint "${complaint.title}" has been submitted and is being reviewed. Complaint ID: ${complaint._id}`,
      complaint._id
    );

    // Notify all authority users
    const authorities = await User.find({ role: 'authority' }).select('_id');
    const notificationPromises = authorities.map((authority) =>
      createNotification(
        authority._id,
        'complaint_submitted',
        'New Complaint Received',
        `A new ${complaint.severity} severity complaint "${complaint.title}" has been submitted in ${complaint.location?.address || 'unknown location'}. Category: ${complaint.category}`,
        complaint._id
      )
    );

    await Promise.all(notificationPromises);
  } catch (error) {
    console.error('Error sending complaint submitted notifications:', error);
  }
}

/**
 * Notify complaint citizen when status is updated
 */
export async function notifyStatusUpdate(
  complaint: IComplaint,
  oldStatus: string,
  newStatus: string
): Promise<void> {
  try {
    const statusMessages: Record<string, string> = {
      verified: 'Your complaint has been verified by our team and will be addressed soon.',
      in_progress: 'Repair work has been initiated for your complaint. We are working on it!',
      resolved: 'Great news! Your complaint has been resolved. Thank you for helping improve our roads.',
      rejected: 'Your complaint has been reviewed and could not be accepted. Please contact support for more details.',
    };

    const message =
      statusMessages[newStatus] ||
      `Your complaint status has been updated from "${oldStatus}" to "${newStatus}".`;

    await createNotification(
      complaint.citizen,
      'status_updated',
      `Complaint Status: ${newStatus.replace('_', ' ').toUpperCase()}`,
      `${message} (Complaint: "${complaint.title}")`,
      complaint._id
    );
  } catch (error) {
    console.error('Error sending status update notification:', error);
  }
}

/**
 * Notify citizen when repair has started
 */
export async function notifyRepairStarted(complaint: IComplaint): Promise<void> {
  try {
    await createNotification(
      complaint.citizen,
      'repair_started',
      'Repair Work Started',
      `Repair work has started for your complaint "${complaint.title}" at ${complaint.location?.address || 'the reported location'}. Estimated completion time will be shared soon.`,
      complaint._id
    );
  } catch (error) {
    console.error('Error sending repair started notification:', error);
  }
}

/**
 * Notify citizen when repair is completed
 */
export async function notifyRepairCompleted(complaint: IComplaint): Promise<void> {
  try {
    await createNotification(
      complaint.citizen,
      'repair_completed',
      'Repair Completed! 🎉',
      `The repair work for your complaint "${complaint.title}" has been completed. Thank you for reporting this issue and making our roads safer!`,
      complaint._id
    );
  } catch (error) {
    console.error('Error sending repair completed notification:', error);
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: mongoose.Types.ObjectId | string): Promise<number> {
  return Notification.countDocuments({ user: userId, read: false });
}
