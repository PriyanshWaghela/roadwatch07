import { Router, Request, Response, NextFunction } from 'express';
import { body, query, param } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Complaint from '../models/Complaint';
import AuthorityUpdate from '../models/AuthorityUpdate';
import { protect, authorize } from '../middleware/auth';
import validate from '../middleware/validate';
import { analyzeImage } from '../services/aiEngine';
import { validateComplaint, checkDuplicate, validateImage } from '../services/preprocessor';
import {
  notifyComplaintSubmitted,
  notifyStatusUpdate,
  notifyRepairStarted,
  notifyRepairCompleted,
} from '../services/notificationService';

const router = Router();

// Configure multer for local file uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

  if ([...allowedImageTypes, ...allowedVideoTypes].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP images and MP4 videos are allowed.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
});

/**
 * @route   POST /api/complaints
 * @desc    Create a new complaint
 * @access  Private (citizen)
 */
router.post(
  '/',
  protect,
  authorize('citizen'),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 },
  ]),
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('category')
      .optional()
      .isIn(['pothole', 'crack', 'waterlogging', 'road_damage', 'other'])
      .withMessage('Invalid category'),
    body('severity')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Invalid severity'),
    body('address')
      .trim()
      .notEmpty()
      .withMessage('Address is required'),
    body('latitude')
      .notEmpty()
      .withMessage('Latitude is required')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Invalid latitude'),
    body('longitude')
      .notEmpty()
      .withMessage('Longitude is required')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Invalid longitude'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        title,
        description,
        category,
        severity,
        address,
        latitude,
        longitude,
      } = req.body;

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const coordinates = [lng, lat]; // GeoJSON format: [longitude, latitude]

      // Process uploaded files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const images = (files?.images || []).map((file) => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename,
      }));
      const videos = (files?.videos || []).map((file) => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename,
      }));

      // Validate image files
      if (files?.images) {
        for (const file of files.images) {
          const imgValidation = validateImage(file);
          if (!imgValidation.isValid) {
            res.status(400).json({
              success: false,
              message: 'Image validation failed',
              errors: imgValidation.errors,
            });
            return;
          }
        }
      }

      // Run preprocessor validation
      const validation = await validateComplaint({
        title,
        description,
        category,
        location: { coordinates, address },
        images,
      });

      // Check for duplicates
      const duplicateCheck = await checkDuplicate(coordinates);

      // Run AI analysis on first image (if available)
      let aiAnalysis;
      if (images.length > 0) {
        aiAnalysis = await analyzeImage(images[0].url, category);
      }

      // Create complaint
      const complaint = await Complaint.create({
        citizen: req.user!._id,
        title,
        description,
        images,
        videos,
        location: {
          type: 'Point',
          coordinates,
          address,
        },
        category: category || 'other',
        severity: aiAnalysis?.severity || severity || 'medium',
        aiAnalysis,
        validationScore: validation.score,
        isDuplicate: duplicateCheck.isDuplicate,
        duplicateOf: duplicateCheck.duplicateOf || undefined,
        statusHistory: [
          {
            status: 'submitted',
            updatedBy: req.user!._id,
            timestamp: new Date(),
            note: 'Complaint submitted by citizen',
          },
        ],
      });

      // Send notifications
      await notifyComplaintSubmitted(complaint);

      // Populate citizen for response
      await complaint.populate('citizen', 'name email');

      res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully',
        complaint,
        validation: {
          score: validation.score,
          warnings: validation.warnings,
        },
        duplicate: duplicateCheck.isDuplicate
          ? {
              isDuplicate: true,
              existingComplaintId: duplicateCheck.duplicateOf,
              similarity: duplicateCheck.similarity,
            }
          : undefined,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints (authority) or own complaints (citizen)
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
      const sortField = (req.query.sort as string) || '-createdAt';
      const { status, severity, category, search } = req.query;

      // Build filter
      const filter: any = {};

      // Citizens only see their own complaints
      if (req.user!.role === 'citizen') {
        filter.citizen = req.user!._id;
      }

      if (status) filter.status = status;
      if (severity) filter.severity = severity;
      if (category) filter.category = category;

      // Text search on title and description
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'location.address': { $regex: search, $options: 'i' } },
        ];
      }

      const [complaints, total] = await Promise.all([
        Complaint.find(filter)
          .populate('citizen', 'name email avatar')
          .populate('assignedAuthority', 'name email')
          .sort(sortField)
          .skip(skip)
          .limit(limit),
        Complaint.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        count: complaints.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        complaints,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/complaints/my
 * @desc    Get current citizen's complaints
 * @access  Private (citizen)
 */
router.get(
  '/my',
  protect,
  authorize('citizen'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [complaints, total] = await Promise.all([
        Complaint.find({ citizen: req.user!._id })
          .populate('assignedAuthority', 'name email')
          .sort('-createdAt')
          .skip(skip)
          .limit(limit),
        Complaint.countDocuments({ citizen: req.user!._id }),
      ]);

      res.status(200).json({
        success: true,
        count: complaints.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        complaints,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/complaints/nearby
 * @desc    Get complaints near a location
 * @access  Private
 */
router.get(
  '/nearby',
  protect,
  [
    query('lat')
      .notEmpty()
      .withMessage('Latitude is required')
      .isFloat()
      .withMessage('Latitude must be a number'),
    query('lng')
      .notEmpty()
      .withMessage('Longitude is required')
      .isFloat()
      .withMessage('Longitude must be a number'),
    query('radius')
      .optional()
      .isFloat({ min: 0.1, max: 50 })
      .withMessage('Radius must be between 0.1 and 50 km'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radiusKm = parseFloat(req.query.radius as string) || 5;
      const radiusMeters = radiusKm * 1000;

      const complaints = await Complaint.find({
        'location.coordinates': {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: radiusMeters,
          },
        },
      })
        .populate('citizen', 'name email avatar')
        .limit(50);

      res.status(200).json({
        success: true,
        count: complaints.length,
        center: { lat, lng },
        radiusKm,
        complaints,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/complaints/:id
 * @desc    Get single complaint by ID
 * @access  Private
 */
router.get(
  '/:id',
  protect,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const complaint = await Complaint.findById(req.params.id)
        .populate('citizen', 'name email avatar phone')
        .populate('assignedAuthority', 'name email phone')
        .populate('statusHistory.updatedBy', 'name email role')
        .populate('duplicateOf', 'title status');

      if (!complaint) {
        res.status(404).json({
          success: false,
          message: 'Complaint not found',
        });
        return;
      }

      // Citizens can only view their own complaints
      if (
        req.user!.role === 'citizen' &&
        complaint.citizen._id.toString() !== req.user!._id.toString()
      ) {
        res.status(403).json({
          success: false,
          message: 'Not authorized to view this complaint',
        });
        return;
      }

      res.status(200).json({
        success: true,
        complaint,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   PUT /api/complaints/:id/status
 * @desc    Update complaint status
 * @access  Private (authority)
 */
router.put(
  '/:id/status',
  protect,
  authorize('authority'),
  [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['submitted', 'verified', 'in_progress', 'resolved', 'rejected'])
      .withMessage('Invalid status'),
    body('note')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Note cannot exceed 500 characters'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, note } = req.body;

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        res.status(404).json({
          success: false,
          message: 'Complaint not found',
        });
        return;
      }

      const oldStatus = complaint.status;

      // Update status
      complaint.status = status;

      // Push to status history
      complaint.statusHistory.push({
        status,
        updatedBy: req.user!._id,
        timestamp: new Date(),
        note: note || `Status updated from ${oldStatus} to ${status}`,
      });

      // Set resolvedAt if status is 'resolved'
      if (status === 'resolved') {
        complaint.resolvedAt = new Date();
      }

      await complaint.save();

      // Create authority update record
      await AuthorityUpdate.create({
        complaint: complaint._id,
        authority: req.user!._id,
        action: 'status_updated',
        previousValue: oldStatus,
        newValue: status,
        note: note || '',
      });

      // Send notifications
      await notifyStatusUpdate(complaint, oldStatus, status);

      if (status === 'in_progress') {
        await notifyRepairStarted(complaint);
      }

      if (status === 'resolved') {
        await notifyRepairCompleted(complaint);
      }

      await complaint.populate('citizen', 'name email');
      await complaint.populate('assignedAuthority', 'name email');

      res.status(200).json({
        success: true,
        message: `Complaint status updated to ${status}`,
        complaint,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   PUT /api/complaints/:id/priority
 * @desc    Update complaint priority
 * @access  Private (authority)
 */
router.put(
  '/:id/priority',
  protect,
  authorize('authority'),
  [
    body('priority')
      .notEmpty()
      .withMessage('Priority is required')
      .isInt({ min: 1, max: 5 })
      .withMessage('Priority must be between 1 and 5'),
    body('note')
      .optional()
      .trim(),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { priority, note } = req.body;

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        res.status(404).json({
          success: false,
          message: 'Complaint not found',
        });
        return;
      }

      const previousPriority = complaint.priority;
      complaint.priority = priority;
      await complaint.save();

      // Create authority update record
      await AuthorityUpdate.create({
        complaint: complaint._id,
        authority: req.user!._id,
        action: 'priority_changed',
        previousValue: previousPriority.toString(),
        newValue: priority.toString(),
        note: note || `Priority changed from ${previousPriority} to ${priority}`,
      });

      res.status(200).json({
        success: true,
        message: `Complaint priority updated to ${priority}`,
        complaint,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   PUT /api/complaints/:id/assign
 * @desc    Assign complaint to an authority user
 * @access  Private (authority)
 */
router.put(
  '/:id/assign',
  protect,
  authorize('authority'),
  [
    body('authorityId')
      .notEmpty()
      .withMessage('Authority ID is required')
      .isMongoId()
      .withMessage('Invalid authority ID'),
    body('note')
      .optional()
      .trim(),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { authorityId, note } = req.body;
      const { User } = await import('../models/User');

      // Verify the target user exists and is an authority
      const authorityUser = await User.findById(authorityId);
      if (!authorityUser || authorityUser.role !== 'authority') {
        res.status(400).json({
          success: false,
          message: 'Invalid authority user',
        });
        return;
      }

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        res.status(404).json({
          success: false,
          message: 'Complaint not found',
        });
        return;
      }

      const previousAuthority = complaint.assignedAuthority?.toString() || 'none';
      complaint.assignedAuthority = authorityUser._id;
      await complaint.save();

      // Create authority update record
      await AuthorityUpdate.create({
        complaint: complaint._id,
        authority: req.user!._id,
        action: 'assigned',
        previousValue: previousAuthority,
        newValue: authorityId,
        note: note || `Assigned to ${authorityUser.name}`,
      });

      await complaint.populate('assignedAuthority', 'name email');

      res.status(200).json({
        success: true,
        message: `Complaint assigned to ${authorityUser.name}`,
        complaint,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
