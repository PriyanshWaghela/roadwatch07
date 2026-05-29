import { Router, Request, Response, NextFunction } from 'express';
import Complaint from '../models/Complaint';
import RoadAnalytics from '../models/RoadAnalytics';
import { protect } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/analytics/overview
 * @desc    Get KPI summary dashboard data
 * @access  Private
 */
router.get(
  '/overview',
  protect,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        criticalComplaints,
      ] = await Promise.all([
        Complaint.countDocuments(),
        Complaint.countDocuments({ status: 'resolved' }),
        Complaint.countDocuments({ status: { $in: ['submitted', 'verified'] } }),
        Complaint.countDocuments({ severity: 'critical' }),
      ]);

      // Calculate average resolution time for resolved complaints
      const resolutionTimeResult = await Complaint.aggregate([
        {
          $match: {
            status: 'resolved',
            resolvedAt: { $exists: true, $ne: null },
          },
        },
        {
          $project: {
            resolutionDays: {
              $divide: [
                { $subtract: ['$resolvedAt', '$createdAt'] },
                1000 * 60 * 60 * 24, // Convert ms to days
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            averageResolutionTime: { $avg: '$resolutionDays' },
          },
        },
      ]);

      const averageResolutionTime = resolutionTimeResult.length > 0
        ? Math.round(resolutionTimeResult[0].averageResolutionTime * 10) / 10
        : 0;

      // Calculate overall road health index from RoadAnalytics
      const healthResult = await RoadAnalytics.aggregate([
        {
          $group: {
            _id: null,
            roadHealthIndex: { $avg: '$roadHealthScore' },
          },
        },
      ]);

      const roadHealthIndex = healthResult.length > 0
        ? Math.round(healthResult[0].roadHealthIndex)
        : 50;

      res.status(200).json({
        success: true,
        data: {
          totalComplaints,
          resolvedComplaints,
          pendingComplaints,
          criticalComplaints,
          averageResolutionTime,
          roadHealthIndex,
          resolutionRate: totalComplaints > 0
            ? Math.round((resolvedComplaints / totalComplaints) * 100)
            : 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/analytics/road-health
 * @desc    Get road health analytics for all areas
 * @access  Private
 */
router.get(
  '/road-health',
  protect,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roadHealth = await RoadAnalytics.find()
        .sort({ roadHealthScore: 1 })
        .lean();

      res.status(200).json({
        success: true,
        count: roadHealth.length,
        data: roadHealth,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/analytics/trends
 * @desc    Get complaint trends grouped by month for the last 12 months
 * @access  Private
 */
router.get(
  '/trends',
  protect,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const trends = await Complaint.aggregate([
        {
          $match: {
            createdAt: { $gte: twelveMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            total: { $sum: 1 },
            resolved: {
              $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
            },
            critical: {
              $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] },
            },
            high: {
              $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] },
            },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            label: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                {
                  $cond: [
                    { $lt: ['$_id.month', 10] },
                    { $concat: ['0', { $toString: '$_id.month' }] },
                    { $toString: '$_id.month' },
                  ],
                },
              ],
            },
            total: 1,
            resolved: 1,
            critical: 1,
            high: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        count: trends.length,
        data: trends,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/analytics/heatmap
 * @desc    Get all complaint locations with severity for heatmap visualization
 * @access  Private
 */
router.get(
  '/heatmap',
  protect,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const complaints = await Complaint.find(
        {},
        {
          'location.coordinates': 1,
          'location.address': 1,
          severity: 1,
          category: 1,
          status: 1,
        }
      ).lean();

      const heatmapData = complaints.map((c) => ({
        lat: c.location.coordinates[1],
        lng: c.location.coordinates[0],
        address: c.location.address,
        severity: c.severity,
        category: c.category,
        status: c.status,
        weight:
          c.severity === 'critical' ? 4 :
          c.severity === 'high' ? 3 :
          c.severity === 'medium' ? 2 : 1,
      }));

      res.status(200).json({
        success: true,
        count: heatmapData.length,
        data: heatmapData,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/analytics/severity-distribution
 * @desc    Get complaint count per severity level
 * @access  Private
 */
router.get(
  '/severity-distribution',
  protect,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const distribution = await Complaint.aggregate([
        {
          $group: {
            _id: '$severity',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            severity: '$_id',
            count: 1,
          },
        },
        {
          $sort: {
            severity: 1,
          },
        },
      ]);

      // Ensure all severity levels are represented
      const severityLevels = ['low', 'medium', 'high', 'critical'];
      const fullDistribution = severityLevels.map((level) => {
        const found = distribution.find((d: any) => d.severity === level);
        return {
          severity: level,
          count: found ? found.count : 0,
        };
      });

      const total = fullDistribution.reduce((sum, d) => sum + d.count, 0);

      res.status(200).json({
        success: true,
        total,
        data: fullDistribution,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/analytics/resolution-time
 * @desc    Get average resolution time per month
 * @access  Private
 */
router.get(
  '/resolution-time',
  protect,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const resolutionTimes = await Complaint.aggregate([
        {
          $match: {
            status: 'resolved',
            resolvedAt: { $exists: true, $ne: null },
            createdAt: { $gte: twelveMonthsAgo },
          },
        },
        {
          $project: {
            resolutionDays: {
              $divide: [
                { $subtract: ['$resolvedAt', '$createdAt'] },
                1000 * 60 * 60 * 24,
              ],
            },
            year: { $year: '$resolvedAt' },
            month: { $month: '$resolvedAt' },
          },
        },
        {
          $group: {
            _id: { year: '$year', month: '$month' },
            averageDays: { $avg: '$resolutionDays' },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            label: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                {
                  $cond: [
                    { $lt: ['$_id.month', 10] },
                    { $concat: ['0', { $toString: '$_id.month' }] },
                    { $toString: '$_id.month' },
                  ],
                },
              ],
            },
            averageDays: { $round: ['$averageDays', 1] },
            resolvedCount: '$count',
          },
        },
      ]);

      res.status(200).json({
        success: true,
        count: resolutionTimes.length,
        data: resolutionTimes,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
