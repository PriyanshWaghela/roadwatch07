import { Router, Request, Response, NextFunction } from 'express';
import PublicSpending from '../models/PublicSpending';
import { protect } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/spending
 * @desc    Get all spending data with pagination
 * @access  Private
 */
router.get(
  '/',
  protect,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const fiscalYear = req.query.fiscalYear as string;

      const filter: any = {};
      if (fiscalYear) filter.fiscalYear = fiscalYear;

      const [spending, total] = await Promise.all([
        PublicSpending.find(filter)
          .sort({ area: 1, fiscalYear: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        PublicSpending.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        count: spending.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: spending,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/spending/summary
 * @desc    Get spending totals across all areas
 * @access  Private
 */
router.get(
  '/summary',
  protect,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await PublicSpending.aggregate([
        {
          $group: {
            _id: null,
            totalAllocated: { $sum: '$allocatedBudget' },
            totalReleased: { $sum: '$releasedBudget' },
            totalSpent: { $sum: '$spentBudget' },
            totalAreas: { $addToSet: '$area' },
            averageTransparencyScore: { $avg: '$transparencyScore' },
          },
        },
        {
          $project: {
            _id: 0,
            totalAllocated: 1,
            totalReleased: 1,
            totalSpent: 1,
            totalRemaining: { $subtract: ['$totalAllocated', '$totalSpent'] },
            utilizationRate: {
              $cond: [
                { $eq: ['$totalAllocated', 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ['$totalSpent', '$totalAllocated'] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
              ],
            },
            areaCount: { $size: '$totalAreas' },
            averageTransparencyScore: { $round: ['$averageTransparencyScore', 0] },
          },
        },
      ]);

      // Per-area breakdown
      const areaBreakdown = await PublicSpending.aggregate([
        {
          $group: {
            _id: '$area',
            totalAllocated: { $sum: '$allocatedBudget' },
            totalReleased: { $sum: '$releasedBudget' },
            totalSpent: { $sum: '$spentBudget' },
            averageTransparencyScore: { $avg: '$transparencyScore' },
          },
        },
        {
          $project: {
            _id: 0,
            area: '$_id',
            totalAllocated: 1,
            totalReleased: 1,
            totalSpent: 1,
            remaining: { $subtract: ['$totalAllocated', '$totalSpent'] },
            averageTransparencyScore: { $round: ['$averageTransparencyScore', 0] },
          },
        },
        {
          $sort: { area: 1 },
        },
      ]);

      res.status(200).json({
        success: true,
        summary: summary.length > 0 ? summary[0] : {
          totalAllocated: 0,
          totalReleased: 0,
          totalSpent: 0,
          totalRemaining: 0,
          utilizationRate: 0,
          areaCount: 0,
          averageTransparencyScore: 0,
        },
        areaBreakdown,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/spending/:area
 * @desc    Get spending data for a specific area
 * @access  Private
 */
router.get(
  '/:area',
  protect,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const area = decodeURIComponent(req.params.area);

      const spending = await PublicSpending.find({
        area: { $regex: new RegExp(`^${area}$`, 'i') },
      })
        .sort({ fiscalYear: -1 })
        .lean();

      if (spending.length === 0) {
        res.status(404).json({
          success: false,
          message: `No spending data found for area: ${area}`,
        });
        return;
      }

      // Calculate area totals
      const totals = spending.reduce(
        (acc, s) => ({
          totalAllocated: acc.totalAllocated + s.allocatedBudget,
          totalReleased: acc.totalReleased + s.releasedBudget,
          totalSpent: acc.totalSpent + s.spentBudget,
        }),
        { totalAllocated: 0, totalReleased: 0, totalSpent: 0 }
      );

      res.status(200).json({
        success: true,
        area,
        count: spending.length,
        totals: {
          ...totals,
          remaining: totals.totalAllocated - totals.totalSpent,
        },
        data: spending,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
