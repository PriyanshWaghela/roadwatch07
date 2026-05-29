import { Router, Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';
import { protect } from '../middleware/auth';
import { getUnreadCount } from '../services/notificationService';

const router = Router();

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications sorted by date desc
 * @access  Private
 */
router.get(
  '/',
  protect,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const readFilter = req.query.read;

      const filter: any = { user: req.user!._id };
      if (readFilter === 'true') filter.read = true;
      if (readFilter === 'false') filter.read = false;

      const [notifications, total] = await Promise.all([
        Notification.find(filter)
          .populate('relatedComplaint', 'title status')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Notification.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        count: notifications.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        notifications,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get count of unread notifications
 * @access  Private
 */
router.get(
  '/unread-count',
  protect,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const count = await getUnreadCount(req.user!._id);

      res.status(200).json({
        success: true,
        count,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all user's notifications as read
 * @access  Private
 */
router.put(
  '/read-all',
  protect,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await Notification.updateMany(
        { user: req.user!._id, read: false },
        { read: true }
      );

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private
 */
router.put(
  '/:id/read',
  protect,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user!._id },
        { read: true },
        { new: true }
      );

      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        notification,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
